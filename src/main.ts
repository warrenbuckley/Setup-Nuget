import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as fs from 'fs';
import * as exec from '@actions/exec';

async function run() {
  try {

    // Download mono when linux (macos already supports mono)
    if (process.platform == 'linux') {
      await exec.exec('sudo apt-get install mono-complete');
    }

    // Try & find tool in cache
    let directoryToAddToPath: string;
    directoryToAddToPath = await tc.find("nuget", "latest");

    if (directoryToAddToPath) {
      core.debug(`Found local cached tool at ${directoryToAddToPath} adding that to path`);
      await core.addPath(directoryToAddToPath);

      core.exportVariable('NUGET_ROOT', directoryToAddToPath);
      return;
    }

    // Download latest Nuget.exe
    core.debug("Downloading Nuget tool");
    const nugetPath = await tc.downloadTool("https://dist.nuget.org/win-x86-commandline/latest/nuget.exe");

    // Rename the file which is a GUID without extension
    var folder = path.dirname(nugetPath);
    var fullPath = path.join(folder, "nuget.exe");
    fs.renameSync(nugetPath, fullPath);

    //Cache the directory with Nuget in it - which returns a NEW cached location
    var cachedToolDir = await tc.cacheDir(folder, "nuget", "latest");
    core.debug(`Cached Tool Dir ${cachedToolDir}`);

    // Add Nuget.exe CLI tool to path for other steps to be able to access it
    await core.addPath(cachedToolDir);

    //Store Nuget path for Ubuntu and MacOS
    core.exportVariable('NUGET_ROOT', cachedToolDir);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
