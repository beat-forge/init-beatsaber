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

  core.info(`Response status: ${response.status}`)
  core.info(`Response headers: ${JSON.stringify([...response.headers])}`)

  if (!response.ok) {
    core.error(`Failed to download file: ${response.statusText}`)
    throw new Error(`Failed to download file: ${response.statusText}`)
  }

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
  try {
    await fs.mkdir(extractPath, { recursive: true })
    await tar.extract({
      file: tarballPath,
      cwd: extractPath,
      filter: path => {
        const segments = path.split('/')
        return segments.length > 1 && segments[1] === 'data'
      }
    })
  } catch (error) {
    core.error(`Failed to extract tarball from ${tarballPath} to ${extractPath}`)
    core.error(`Error details: ${error}`)
    throw error
  }
  core.info('Tarball extraction completed successfully')
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

    core.info(
      `Inputs: token=${token}, version=${requestedVersion}, path=${referencesPath}, repo=${repo}, host=${host}`
    )

    const [owner, repoName] = repo.split('/')
    if (!owner || !repoName) {
      core.error('Repository input is invalid. Expected format {owner}/{repo}.')
      throw new Error(
        'Repository input is invalid. Expected format {owner}/{repo}.'
      )
    }

    const branch = `version/${requestedVersion}`
    const archiveUrl = `https://${host}/${owner}/${repoName}/archive/refs/heads/${branch}.tar.gz`
    const tarballPath = resolve('archive.tar.gz')
    const extractPath = resolve('extract')
    const refsPath = resolve(referencesPath)

    core.info(`Archive URL: ${archiveUrl}`)
    core.info(`Tarball path: ${tarballPath}`)
    core.info(`Extract path: ${extractPath}`)
    core.info(`References path: ${refsPath}`)

    await downloadFile(archiveUrl, tarballPath, token)
    await extractTarball(tarballPath, extractPath)
    await moveContents(join(extractPath, 'data'), refsPath)

    core.info('Beat Saber references initialized successfully')
  } catch (error) {
    core.setFailed(`Action failed with error: ${error}`)
  }
}

run()
