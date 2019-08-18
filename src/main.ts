import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as fs from 'fs';

async function run() {
  try {

    let directoryToAddToPath;

    // Try & find tool in cache
    directoryToAddToPath = await tc.find("nuget", "latest");

    if(directoryToAddToPath){
      core.debug(`Found local cached tool at ${directoryToAddToPath}`);
      await core.addPath(directoryToAddToPath);
      return;
    }

    core.debug("Downloading Nuget tool");
    core.debug(`Process platform: ${process.platform}`);

    // Download latest Nuget.exe
    const nugetPath = await tc.downloadTool("https://dist.nuget.org/win-x86-commandline/latest/nuget.exe");
    core.debug(`Nuget file location ${nugetPath}`);

    // Rename the file which is a GUID without extension
    var folder = path.dirname(nugetPath);
    var fullPath = path.join(folder, "nuget.exe");
    fs.renameSync(nugetPath, fullPath);

    var cachedToolDir = await tc.cacheDir(folder, "nuget", "latest");

    // Add Nuget.exe CLI tool to path for
    // Other steps to be able to access it
    core.debug(`Fullpath ${fullPath}`);
    core.debug(`Cached Tool Dir ${cachedToolDir}`);
    await core.addPath(cachedToolDir);

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
