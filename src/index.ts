/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from '@actions/core'
import * as github from '@actions/github'
import { mkdir, access, constants } from 'fs/promises'
import { createWriteStream, existsSync, unlinkSync } from 'fs'
import { pipeline } from 'stream'
import { promisify } from 'util'
import * as tar from 'tar'
import fetch from 'node-fetch'

const streamPipeline = promisify(pipeline)

async function downloadArchive(url: string, token: string, destination: string): Promise<void> {
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to download archive: ${response.statusText}`)
  }

  await streamPipeline(response.body, createWriteStream(destination))
}

async function extractArchive(filePath: string, extractPath: string): Promise<void> {
  await tar.x({
    file: filePath,
    cwd: extractPath,
    strip: 1
  })
}

async function ensureDirectoryExists(path: string): Promise<void> {
  try {
    await access(path, constants.F_OK)
  } catch {
    await mkdir(path, { recursive: true })
  }
}

async function run(): Promise<void> {
  try {
    const token = core.getInput('token', { required: true })
    const requestedVersion = core.getInput('version', { required: true })
    const referencesPath = core.getInput('path', { required: true })
    const repo = core.getInput('repo', { required: true })

    const [owner, repoName] = repo.split('/')
    if (!owner || !repoName) {
      throw new Error('Repository input is invalid. Expected format {owner}/{repo}.')
    }

    const branch = `version/${requestedVersion}`
    const archiveUrl = `https://github.com/${owner}/${repoName}/archive/refs/heads/${branch}.tar.gz`
    const tarballPath = `${referencesPath}/${branch}.tar.gz`

    console.log(`Downloading ${archiveUrl}`)

    await ensureDirectoryExists(referencesPath)
    await downloadArchive(archiveUrl, token, tarballPath)

    console.log(`Extracting ${tarballPath}`)
    await extractArchive(tarballPath, referencesPath)

    console.log(`Version ${requestedVersion} downloaded and extracted successfully`)

    // Clean up the downloaded tarball file
    if (existsSync(tarballPath)) {
      unlinkSync(tarballPath)
    }
  } catch (error) {
    if (error instanceof Error) {
      core.error(error.message)
      core.setFailed(error.message)
    } else {
      core.setFailed('An unknown error occurred')
    }
  }
}

run()