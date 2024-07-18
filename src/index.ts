import * as core from '@actions/core'
import { promises as fs, createWriteStream } from 'fs'
import { dirname, join, resolve } from 'path'
import * as tar from 'tar'

async function downloadFile(
  url: string,
  outputPath: string,
  token: string
): Promise<void> {
  core.info(`Starting download from URL: ${url}`)
  const packageJson = require('../package.json')
  const userAgent = `beat-forge/init-beatsaber@${packageJson.version}`
  core.info(`User-Agent: ${userAgent}`)

  const response = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
      Authorization: `token ${token}`
    }
  })

  if (!response.ok) {
    core.error(`Failed to download file: ${response.statusText}`)
    throw new Error(`Failed to download file: ${response.statusText}`)
  }

  core.info(`Response status: ${response.status}`)
  core.info(`Response headers: ${JSON.stringify(response.headers.raw())}`)

  await fs.mkdir(dirname(outputPath), { recursive: true })
  core.info(`Directory created for output path: ${dirname(outputPath)}`)

  const fileStream = createWriteStream(outputPath)
  const reader = response.body?.getReader()

  if (!reader) {
    core.error('Failed to get reader from response body')
    throw new Error('Failed to get reader from response body')
  }

  core.info('Starting to read and write file stream')
  const pump = async () => {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) fileStream.write(value)
    }
    fileStream.close()
  }

  await pump()
  core.info('File downloaded and written successfully')
}

async function extractTarball(
  tarballPath: string,
  extractPath: string
): Promise<void> {
  core.info(`Extracting tarball from ${tarballPath} to ${extractPath}`)
  await fs.mkdir(extractPath, { recursive: true })
  core.info(`Directory created for extraction: ${extractPath}`)

  core.info(`Listing contents of tarball: ${tarballPath}`)
  await tar.t({
    file: tarballPath,
    onReadEntry: entry => {
      core.info(`Tarball entry: ${entry.path}`)
    }
  })

  await tar.x({
    file: tarballPath,
    cwd: extractPath
  })
  core.info('Extraction completed successfully')
}

async function moveContents(srcDir: string, destDir: string): Promise<void> {
  core.info(`Moving contents from ${srcDir} to ${destDir}`)
  try {
    await fs.mkdir(destDir, { recursive: true })
    const files = await fs.readdir(srcDir, { withFileTypes: true })
    core.info(`Files to move: ${files.map(file => file.name).join(', ')}`)

    for (const file of files) {
      const srcPath = join(srcDir, file.name)
      const destPath = join(destDir, file.name)

      if (file.isDirectory()) {
        await moveContents(srcPath, destPath)
      } else {
        await fs.rename(srcPath, destPath)
      }
      core.info(`Moved ${srcPath} to ${destPath}`)
    }
  } catch (error) {
    core.error(`Failed to move contents from ${srcDir} to ${destDir}`)
    core.error(`Error details: ${error}`)
    throw error
  }
  core.info('Content move completed successfully')
}

async function run(): Promise<void> {
  try {
    core.info('Initializing Beat Saber references...')

    const token = core.getInput('token', { required: true })
    const requestedVersion = core.getInput('version', { required: true })
    const referencesPath = core.getInput('path') || './Refs'
    const repo = core.getInput('repo') || 'beat-forge/beatsaber-stripped'
    const host = core.getInput('host') || 'github.com'

    core.info(`Inputs: token=${token}, version=${requestedVersion}, path=${referencesPath}, repo=${repo}, host=${host}`)

    const [owner, repoName] = repo.split('/')
    if (!owner || !repoName) {
      core.error('Repository input is invalid. Expected format {owner}/{repo}.')
      throw new Error('Repository input is invalid. Expected format {owner}/{repo}.')
    }

    const branch = `version/${requestedVersion}`
    const archiveUrl = `https://${host}/${owner}/${repoName}/archive/refs/heads/${branch}.tar.gz`
    const tarballPath = `./${repoName}-${branch}.tar.gz`
    const extractPath = `./${repoName}-${branch}`
    const refsPath = resolve(referencesPath)

    core.info(`Calculated paths: archiveUrl=${archiveUrl}, tarballPath=${tarballPath}, extractPath=${extractPath}, refsPath=${refsPath}`)

    const files = await fs.readdir('.')
    core.info(`${process.cwd()} contents: ${files.join(', ')}`)

    core.info(`Downloading ${archiveUrl} to ${tarballPath}...`)
    await downloadFile(archiveUrl, tarballPath, token)

    core.info(`Extracting ${tarballPath} to ${extractPath}...`)
    await extractTarball(tarballPath, extractPath)

    core.info(`Moving 'data' folder contents from ${extractPath} to ${refsPath}...`)
    await moveContents(join(extractPath, 'data'), refsPath)

    core.info('Cleaning up...')
    await fs.rm(tarballPath)
    await fs.rm(extractPath, { recursive: true })
    core.info('Cleanup completed successfully')
  } catch (error) {
    core.error(`An error occurred: ${error}`)
    core.setFailed(
      error instanceof Error ? error.message : 'An unknown error occurred'
    )
  }
}

run()
