import * as core from '@actions/core'
import { promises as fsPromises, createWriteStream } from 'fs'
import { dirname, join, resolve, basename } from 'path'
import { pipeline } from 'stream/promises'
import * as tar from 'tar'
import os from 'os'

/**
 * Downloads a file from the given URL and saves it to the specified output path.
 * Uses the provided GitHub token if available.
 * @param url - The URL to download the file from.
 * @param outputPath - The local file path where the file will be saved.
 * @param token - Optional GitHub token for authenticated requests.
 */
async function downloadFile(
  url: string,
  outputPath: string,
  token?: string
): Promise<void> {
  core.info(`Starting download from URL: ${url}`)

  // Read package.json to get the version
  const packageJsonPath = resolve(__dirname, '..', 'package.json')
  let packageJsonContent: string
  try {
    packageJsonContent = await fsPromises.readFile(packageJsonPath, 'utf-8')
  } catch (error) {
    core.warning(
      `Failed to read package.json from ${packageJsonPath}. Using default version.`
    )
    packageJsonContent = JSON.stringify({ version: '1.0.0' })
  }

  let packageJson: { version: string }
  try {
    packageJson = JSON.parse(packageJsonContent)
  } catch (error) {
    core.error(`Failed to parse package.json: ${error}`)
    throw new Error(`Failed to parse package.json: ${error}`)
  }

  const userAgent = `beat-forge/init-beatsaber@${packageJson.version}`
  core.debug(`User-Agent: ${userAgent}`)

  const headers = new Headers({
    'User-Agent': userAgent,
    Accept: 'application/octet-stream'
  })

  if (token) {
    headers.set('Authorization', `token ${token}`)
  }

  let response: Response
  try {
    response = await fetch(url, { headers })
  } catch (error) {
    core.error(`Network error while fetching ${url}: ${error}`)
    throw new Error(`Network error: ${error}`)
  }

  core.info(`Response status: ${response.status} ${response.statusText}`)

  if (!response.ok) {
    const errorBody = await response.text().catch(() => 'No response body')
    core.error(`Failed to download file: ${response.statusText}`)
    core.debug(`Error response body: ${errorBody}`)
    throw new Error(
      `Failed to download file: ${response.status} ${response.statusText}`
    )
  }

  try {
    await fsPromises.mkdir(dirname(outputPath), { recursive: true })
    core.debug(`Created directory for output path: ${dirname(outputPath)}`)
  } catch (error) {
    core.error(`Failed to create directory ${dirname(outputPath)}: ${error}`)
    throw error
  }

  const fileStream = createWriteStream(outputPath)

  core.info('Starting to read and write file stream')

  if (response.body) {
    try {
      await pipeline(response.body, fileStream)
    } catch (error) {
      core.error(`Error during file stream pipeline: ${error}`)
      throw error
    }
  } else {
    throw new Error('Response body is null')
  }

  core.info('File downloaded and written successfully')
}

/**
 * Extracts a tarball file to the specified directory.
 * @param tarballPath - The path to the tarball file.
 * @param extractPath - The directory where the tarball will be extracted.
 */
async function extractTarball(
  tarballPath: string,
  extractPath: string
): Promise<void> {
  core.info(`Extracting tarball from ${tarballPath} to ${extractPath}`)
  try {
    await fsPromises.mkdir(extractPath, { recursive: true })
    await tar.extract({
      file: tarballPath,
      cwd: extractPath,
      strip: 1
    })
    core.info('Tarball extraction completed successfully')
  } catch (error) {
    core.error(
      `Failed to extract tarball from ${tarballPath} to ${extractPath}: ${error}`
    )
    throw error
  }
}

/**
 * Recursively moves contents from the source directory to the destination directory.
 * @param srcDir - The source directory.
 * @param destDir - The destination directory.
 */
async function moveContents(srcDir: string, destDir: string): Promise<void> {
  core.info(`Moving contents from ${srcDir} to ${destDir}`)
  try {
    await fsPromises.mkdir(destDir, { recursive: true })
    const entries = await fsPromises.readdir(srcDir, { withFileTypes: true })
    core.debug(`Entries to move: ${entries.map(e => e.name).join(', ')}`)

    for (const entry of entries) {
      const srcPath = join(srcDir, entry.name)
      const destPath = join(destDir, entry.name)

      if (entry.isDirectory()) {
        await moveContents(srcPath, destPath)
      } else {
        try {
          await fsPromises.rename(srcPath, destPath)
          core.debug(`Renamed ${srcPath} to ${destPath}`)
        } catch (renameError) {
          // Fallback to copy and delete if rename fails (e.g., cross-filesystem)
          core.debug(
            `Rename failed for ${srcPath}. Attempting to copy and delete.`
          )
          await fsPromises.copyFile(srcPath, destPath)
          await fsPromises.unlink(srcPath)
          core.debug(`Copied and deleted ${srcPath} to ${destPath}`)
        }
      }
    }
    core.info('Content move completed successfully')
  } catch (error) {
    core.error(`Failed to move contents from ${srcDir} to ${destDir}: ${error}`)
    throw error
  }
}

/**
 * Recursively searches for a 'manifest.json' file starting from the given directory.
 * @param dir - The directory to start searching from.
 * @returns The full path to 'manifest.json' if found, otherwise null.
 */
async function findManifest(dir: string): Promise<string | null> {
  core.info(`Searching for manifest.json in directory: ${dir}`)
  try {
    const entries = await fsPromises.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = join(dir, entry.name)
      if (entry.isDirectory()) {
        const manifest = await findManifest(fullPath)
        if (manifest) return manifest
      } else if (entry.isFile() && entry.name === 'manifest.json') {
        core.info(`Found manifest.json at ${fullPath}`)
        return fullPath
      }
    }
    core.debug(`No manifest.json found in directory: ${dir}`)
    return null
  } catch (error) {
    core.error(`Error searching for manifest.json in ${dir}: ${error}`)
    throw error
  }
}

async function run(): Promise<void> {
  let tmpDir: string | undefined = undefined

  try {
    core.info('Initializing Beat Saber modding environment...')

    // Retrieve inputs
    const token = core.getInput('token', { required: false })
    const repo = core.getInput('repo', { required: true })
    const host = core.getInput('host', { required: true })
    const manifestPathInput = core.getInput('manifest', { required: false })
    const referencesPathInput = core.getInput('path', { required: true })
    let requestedVersion = core.getInput('version', { required: false })
    const refInput = core.getInput('ref', { required: false })

    core.debug(
      `Inputs - version: ${requestedVersion}, manifest: ${manifestPathInput}, path: ${referencesPathInput}, repo: ${repo}, host: ${host}, ref: ${refInput}`
    )

    // Validate 'repo' format (owner/repo)
    if (!/^([\w-]+)\/([\w-]+)$/.test(repo)) {
      throw new Error(
        `Invalid repo format: "${repo}". Expected format "owner/repo".`
      )
    }

    let version = requestedVersion
    if (!refInput && !version) {
      core.info(
        'No ref or version specified. Attempting to infer version from manifest.json...'
      )
      const manifestFile = manifestPathInput
        ? resolve(manifestPathInput)
        : await findManifest(process.cwd())

      if (manifestFile) {
        core.info(`Using manifest.json at ${manifestFile} to infer version.`)

        let manifestContent: string
        try {
          manifestContent = await fsPromises.readFile(manifestFile, 'utf-8')
        } catch (readError) {
          core.error(`Failed to read manifest.json: ${readError}`)
          throw new Error('Failed to read manifest.json.')
        }

        // Remove BOM if present
        if (manifestContent.charCodeAt(0) === 0xfeff) {
          core.debug('Removing BOM from manifest.json')
          manifestContent = manifestContent.slice(1)
        }

        let manifest: { gameVersion?: string }
        try {
          manifest = JSON.parse(manifestContent)
        } catch (parseError) {
          core.error(`Failed to parse manifest.json: ${parseError}`)
          throw new Error('Invalid JSON in manifest.json.')
        }

        if (manifest.gameVersion) {
          version = manifest.gameVersion
          core.info(`Inferred version from manifest: ${version}`)
        } else {
          throw new Error(
            'No version specified and "gameVersion" not found in manifest.json.'
          )
        }
      } else {
        throw new Error('No manifest.json found and no version specified.')
      }
    }

    let ref: string
    if (refInput) {
      ref = refInput
      core.info(`Using ref from input: ${ref}`)
    } else if (version) {
      ref = `version/${version}`
      core.info(`Using ref from version: ${ref}`)
    } else {
      throw new Error(
        'No ref or version specified, and unable to infer from manifest.'
      )
    }

    const archiveUrl = `https://${host}/${repo}/archive/${ref}.tar.gz`

    tmpDir = await fsPromises.mkdtemp(join(os.tmpdir(), 'action-'))

    const tarballPath = join(tmpDir, 'archive.tar.gz')
    const extractPath = join(tmpDir, 'extract')
    const refsPath = resolve(referencesPathInput)

    core.info(`Downloading tarball from ${archiveUrl}`)
    await downloadFile(archiveUrl, tarballPath, token)

    core.info(`Extracting tarball to ${extractPath}`)
    await extractTarball(tarballPath, extractPath)

    core.info(`Moving extracted contents to ${refsPath}`)
    await moveContents(extractPath, refsPath)

    core.info('Beat Saber references initialized successfully')
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Action failed with error: ${error.message}`)
    } else {
      core.setFailed(`Action failed with unknown error: ${error}`)
    }
  } finally {
    if (tmpDir) {
      try {
        await fsPromises.rm(tmpDir, { recursive: true, force: true })
        core.debug(`Cleaned up temporary directory: ${tmpDir}`)
      } catch (cleanupError) {
        core.warning(`Failed to clean up temporary directory: ${cleanupError}`)
      }
    }
  }
}

run()
