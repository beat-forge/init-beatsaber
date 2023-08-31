/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from '@actions/core'
import * as github from '@actions/github'
import { access, mkdir, writeFile } from 'fs/promises'

try {
  const octokit = github.getOctokit(core.getInput('token'))
  const versionsRepo = core.getInput('repo').split('/')

  const owner = versionsRepo[3]
  const repo = versionsRepo[4]

  const requestedVersion = core.getInput('version')
  const refPath = core.getInput('path')

  const res = await octokit.rest.repos.getContent({
    owner,
    repo,
    path: 'versions'
  })

  if (res.status !== 200) {
    throw new Error(`Failed to get versions from repo: ${res.status}`)
  }

  let versions: string[] = []
  if (Array.isArray(res.data) && res.data.every(item => 'name' in item)) {
    versions = res.data.map((file: { name: string }) => file.name)
  } else {
    throw new Error('Unexpected response from GitHub API')
  }

  if (!versions.includes(requestedVersion)) {
    throw new Error(`Version ${requestedVersion} does not exist`)
  }

  const versionList = await exploreDirectory(
    octokit,
    owner,
    repo,
    `versions/${requestedVersion}`
  )

  for (const version of versionList) {
    const versionPath = `${refPath}/${version.split('/').slice(2).join('/')}` // Remove "versions/<version>" from the path

    try {
      await access(versionPath)
      console.log(`File ${versionPath} already exists, skipping`)
      continue
    } catch {
      /* empty */
    }

    const versionRes = await fetch(
      `https://raw.githubusercontent.com/${owner}/${repo}/main/${versionPath}`
    )

    if (!versionRes.ok) {
      throw new Error(
        `Failed to get ${versionPath} from repo: ${versionRes.status}`
      )
    }

    const content = await versionRes.arrayBuffer()
    const buffer = Buffer.from(content)

    await mkdir(versionPath.split('/').slice(0, -1).join('/'), {
      recursive: true
    })
    await writeFile(versionPath, buffer)
  }
} catch (error) {
  if (error instanceof Error) {
    console.log(error.message)
    core.setFailed(error.message)
  } else {
    core.setFailed('An unknown error occurred')
  }
}

async function exploreDirectory(
  octokit: any,
  owner: string,
  repo: string,
  path: string,
  files: string[] = []
): Promise<string[]> {
  try {
    const response = await octokit.rest.repos.getContent({
      owner,
      repo,
      path
    })

    if (response.status !== 200) {
      throw new Error(`Failed to get versions from repo: ${response.status}`)
    }

    if (Array.isArray(response.data)) {
      for (const file of response.data) {
        if (file.type === 'dir') {
          await exploreDirectory(
            octokit,
            owner,
            repo,
            `${path}/${file.name}`,
            files
          )
        } else {
          files.push(`${path}/${file.name}`)
        }
      }
    } else {
      throw new Error(
        'Expected an array of files, but received a different type of data'
      )
    }

    return files
  } catch (error) {
    console.error(error)
    throw error
  }
}
