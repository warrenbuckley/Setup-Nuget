import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as fs from 'fs';

async function run() {
  try {
    core.debug("Downloading Nuget tool");
    core.debug(`Process platform: ${process.platform}`);

    // Download latest Nuget.exe
    const nugetPath = await tc.downloadTool("https://dist.nuget.org/win-x86-commandline/latest/nuget.exe");
    core.debug(`Nuget file location ${nugetPath}`);

    // TODO Path join?!
    // So we get a nuget.exe file not GUID.exe
    fs.renameSync(nugetPath, `${nugetPath}.exe`)

    // Add Nuget.exe CLI tool to path for
    // Other steps to be able to access it
    const fullPath = `${nugetPath}.exe`
    core.debug(`Fullpath ${fullPath}`);

    await core.addPath(fullPath);

    // Verify Nuget installed
    await exec.exec(fullPath);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
