/* eslint-disable @typescript-eslint/no-explicit-any */
import * as core from '@actions/core';
import * as github from '@actions/github';
import { mkdir, access, constants } from 'fs/promises';
import { createWriteStream, existsSync, unlinkSync } from 'fs';
import { pipeline } from 'stream';
import { promisify } from 'util';
import * as tar from 'tar';
import fetch from 'node-fetch';

const streamPipeline = promisify(pipeline);

async function downloadArchive(
  url: string,
  token: string,
  destination: string
): Promise<void> {
  core.info(`Downloading archive from ${url}`);
  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to download archive: ${response.status} ${response.statusText}`);
  }

  if (!response.body) {
    throw new Error('Response body is null');
  }

  await streamPipeline(response.body, createWriteStream(destination));
  core.info(`Downloaded archive to ${destination}`);
}

async function extractArchive(
  filePath: string,
  extractPath: string
): Promise<void> {
  core.info(`Extracting archive from ${filePath} to ${extractPath}`);
  await tar.x({
    file: filePath,
    cwd: extractPath,
    strip: 1,
    filter: (path: string) => path.includes('data/')
  });
  core.info(`Extracted archive to ${extractPath}`);
}

async function ensureDirectoryExists(path: string): Promise<void> {
  try {
    await access(path, constants.F_OK);
  } catch {
    await mkdir(path, { recursive: true });
    core.info(`Created directory ${path}`);
  }
}

async function run(): Promise<void> {
  try {
    const token = core.getInput('token', { required: true });
    const requestedVersion = core.getInput('version', { required: true });
    const referencesPath = core.getInput('path') || 'references';
    const repo = core.getInput('repo') || `beat-forge/beatsaber-stripped`;
    const host = core.getInput('host') || 'github.com';

    const [owner, repoName] = repo.split('/');
    if (!owner || !repoName) {
      throw new Error('Repository input is invalid. Expected format {owner}/{repo}.');
    }

    const branch = `version/${requestedVersion}`;
    const archiveUrl = `https://${host}/${owner}/${repoName}/archive/refs/heads/${branch}.tar.gz`;
    const tarballPath = `${referencesPath}/${branch}.tar.gz`;

    await ensureDirectoryExists(referencesPath);
    await downloadArchive(archiveUrl, token, tarballPath);
    await extractArchive(tarballPath, referencesPath);

    if (existsSync(tarballPath)) {
      unlinkSync(tarballPath);
      core.info(`Deleted tarball ${tarballPath}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.error(error.message);
      core.setFailed(error.message);
    } else {
      core.setFailed('An unknown error occurred');
    }
  }
}

run();
