import * as core from '@actions/core';
import { promises as fs, createWriteStream } from 'fs';
import { dirname, join, resolve } from 'path';
import * as tar from 'tar';

async function downloadFile(
  url: string,
  outputPath: string,
  token: string
): Promise<void> {
  const packageJson = require('../package.json');
  const userAgent = `beat-forge/init-beatsaber@${packageJson.version}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': userAgent,
      Authorization: `token ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  await fs.mkdir(dirname(outputPath), { recursive: true });

  const fileStream = createWriteStream(outputPath);
  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error('Failed to get reader from response body');
  }

  const pump = async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) fileStream.write(value);
    }
    fileStream.close();
  };

  await pump();
}

async function extractTarball(
  tarballPath: string,
  extractPath: string
): Promise<void> {
  await fs.mkdir(extractPath, { recursive: true });

  await tar.x({
    file: tarballPath,
    cwd: extractPath
  });
}

async function moveContents(srcDir: string, destDir: string): Promise<void> {
  try {
    await fs.mkdir(destDir, { recursive: true });
    const files = await fs.readdir(srcDir, { withFileTypes: true });

    for (const file of files) {
      const srcPath = join(srcDir, file.name);
      const destPath = join(destDir, file.name);

      if (file.isDirectory()) {
        await moveContents(srcPath, destPath);
      } else {
        await fs.rename(srcPath, destPath);
      }
    }
  } catch (error) {
    core.error(`Failed to move contents from ${srcDir} to ${destDir}`);
    throw error;
  }
}

async function run(): Promise<void> {
  try {
    core.info('Initializing Beat Saber references...');

    const token = core.getInput('token', { required: true });
    const requestedVersion = core.getInput('version', { required: true });
    const referencesPath = core.getInput('path') || './Refs';
    const repo = core.getInput('repo') || 'beat-forge/beatsaber-stripped';
    const host = core.getInput('host') || 'github.com';

    const [owner, repoName] = repo.split('/');
    if (!owner || !repoName) {
      throw new Error(
        'Repository input is invalid. Expected format {owner}/{repo}.'
      );
    }

    const branch = `version/${requestedVersion}`;
    const archiveUrl = `https://${host}/${owner}/${repoName}/archive/refs/heads/${branch}.tar.gz`;
    const tarballPath = `./${repoName}-${branch}.tar.gz`;
    const extractPath = `./${repoName}-${branch}`;
    const refsPath = resolve(referencesPath);

    const files = await fs.readdir('.');
    core.info(`${process.cwd()} contents:`);
    for (const file of files) {
      core.info(file);
    }

    core.info(`Downloading ${archiveUrl} to ${tarballPath}...`);
    await downloadFile(archiveUrl, tarballPath, token);

    core.info(`Extracting ${tarballPath} to ${extractPath}...`);
    await extractTarball(tarballPath, extractPath);

    core.info(`Moving 'data' folder contents from ${extractPath} to ${refsPath}...`);
    await moveContents(join(extractPath, 'data'), refsPath);

    core.info('Cleaning up...');
    await fs.rm(tarballPath);
    await fs.rm(extractPath, { recursive: true });
  } catch (error) {
    core.setFailed(
      error instanceof Error ? error.message : 'An unknown error occurred'
    );
  }
}

run();
