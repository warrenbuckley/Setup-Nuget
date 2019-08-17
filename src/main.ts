import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as fs from 'fs';

async function run() {
  try {
    core.debug("Downloading Nuget tool");
    core.debug(`Process platform: ${process.platform}`);

    // Download latest Nuget.exe
    const nugetPath = await tc.downloadTool("https://dist.nuget.org/win-x86-commandline/latest/nuget.exe");
    core.debug(`Nuget file location ${nugetPath}`);

    // Rename the file which is a GUID without extension
    var folder = path.dirname(nugetPath);
    var fullPath = path.join(folder, "nuget.exe");
    fs.renameSync(nugetPath, fullPath);

    // Add Nuget.exe CLI tool to path for
    // Other steps to be able to access it
    core.debug(`Fullpath ${fullPath}`);
    await core.addPath(fullPath);

    // Verify Nuget installed
    await exec.exec(fullPath);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
