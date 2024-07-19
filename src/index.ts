import * as core from '@actions/core'
import { promises as fs, createWriteStream } from 'fs'
import { dirname, join, resolve } from 'path'
import { pipeline } from 'stream'
import * as tar from 'tar'
import { promisify } from 'util'

const streamPipeline = promisify(pipeline)

async function downloadFile(url: string, outputPath: string, token?: string): Promise<void> {
  core.info(`Starting download from URL: ${url}`)
  const packageJson = require('../package.json')
  const userAgent = `beat-forge/init-beatsaber@${packageJson.version}`
  core.debug(`User-Agent: ${userAgent}`)

  const headers: Record<string, string> = {
    'User-Agent': userAgent
  }
  if (token) {
    headers['Authorization'] = `token ${token}`
  }

  const response = await fetch(url, {
    headers
  })

  core.info(`Response status: ${response.status}`)
  core.debug(`Response headers: ${JSON.stringify([...response.headers])}`)

  if (!response.ok) {
    core.error(`Failed to download file: ${response.statusText}`)
    throw new Error(`Failed to download file: ${response.statusText}`)
  }

  await fs.mkdir(dirname(outputPath), { recursive: true })
  core.debug(`Created directory for output path: ${dirname(outputPath)}`)

  const fileStream = createWriteStream(outputPath)

  core.info('Starting to read and write file stream')

  if (response.body) {
    await streamPipeline(response.body, fileStream)
  } else {
    throw new Error('Response body is null')
  }

  core.info('File downloaded and written successfully')
}

async function extractTarball(
  tarballPath: string,
  extractPath: string
): Promise<void> {
  core.info(`Extracting tarball from ${tarballPath} to ${extractPath}`)
  try {
    await fs.mkdir(extractPath, { recursive: true })
    await tar.extract({
      file: tarballPath,
      cwd: extractPath
    })
    core.info('Tarball extraction completed successfully')
  } catch (error) {
    core.error(
      `Failed to extract tarball from ${tarballPath} to ${extractPath}`
    )
    core.error(`Error details: ${error}`)
    throw error
  }
}

async function moveContents(srcDir: string, destDir: string): Promise<void> {
  core.info(`Moving contents from ${srcDir} to ${destDir}`)
  try {
    await fs.mkdir(destDir, { recursive: true })
    const files = await fs.readdir(srcDir, { withFileTypes: true })
    core.debug(`Files to move: ${files.map(file => file.name).join(', ')}`)

    for (const file of files) {
      const srcPath = join(srcDir, file.name)
      const destPath = join(destDir, file.name)

      if (file.isDirectory()) {
        await moveContents(srcPath, destPath)
      } else {
        await fs.rename(srcPath, destPath)
      }
      core.debug(`Moved ${srcPath} to ${destPath}`)
    }
    core.info('Content move completed successfully')
  } catch (error) {
    core.error(`Failed to move contents from ${srcDir} to ${destDir}`)
    core.error(`Error details: ${error}`)
    throw error
  }
}

async function findManifest(dir: string): Promise<string | null> {
  core.info(`Searching for manifest.json in directory: ${dir}`)
  const files = await fs.readdir(dir, { withFileTypes: true })
  for (const file of files) {
    const fullPath = join(dir, file.name)
    if (file.isDirectory()) {
      const manifest = await findManifest(fullPath)
      if (manifest) return manifest
    } else if (file.name === 'manifest.json') {
      core.info(`Found manifest.json at ${fullPath}`)
      return fullPath
    }
  }
  core.debug(`No manifest.json found in directory: ${dir}`)
  return null
}

async function run(): Promise<void> {
  try {
    core.info('Initializing Beat Saber modding environment...')

    const token = core.getInput('token')
    const repo = core.getInput('repo')
    const host = core.getInput('host')

    const manifestPath = core.getInput('manifest')
    const referencesPath = core.getInput('path')
    let requestedVersion = core.getInput('version')

    core.debug(
      `Inputs: version=${requestedVersion}, manifest=${manifestPath}, path=${referencesPath}, repo=${repo}, host=${host}`
    )

    if (!requestedVersion) {
      core.info(
        'No version specified. Attempting to infer version from manifest.json...'
      )
      const manifestFile = manifestPath
        ? resolve(manifestPath)
        : await findManifest(process.cwd())
      if (manifestFile) {
        core.info(`Found manifest.json at ${manifestFile}`)

        let manifestStringData = await fs.readFile(manifestFile, 'utf-8')
        if (manifestStringData.startsWith('\ufeff')) {
          core.debug('Removing BOM from manifest.json')
          manifestStringData = manifestStringData.substring(1)
        }

        const manifest = JSON.parse(manifestStringData)
        requestedVersion = manifest.gameVersion

        core.info(`Inferred version: ${requestedVersion}`)
      } else {
        core.error('No manifest.json found and no version specified.')
        throw new Error('No manifest.json found and no version specified.')
      }
    }

    if (repo.split('/').length !== 2) {
      core.error(`Invalid repo format: ${repo} (expected owner/repo)`)
      throw new Error(`Invalid repo format: ${repo} (expected owner/repo)`)
    }

    const branch = `version/${requestedVersion}`
    const archiveUrl = `https://${host}/${repo}/archive/refs/heads/${branch}.tar.gz`
    const tarballPath = resolve('archive.tar.gz')
    const extractPath = resolve('extract')
    const refsPath = resolve(referencesPath)

    core.info(`Downloading from ${archiveUrl}`)
    await downloadFile(archiveUrl, tarballPath, token)

    core.info(`Extracting tarball to ${extractPath}`)
    await extractTarball(tarballPath, extractPath)

    core.info(`Moving contents to ${refsPath}`)
    await moveContents(
      join(
        extractPath,
        `beatsaber-stripped-version-${requestedVersion}`,
        'data'
      ),
      refsPath
    )

    core.info('Beat Saber references initialized successfully')
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`)
  }
}

run()
