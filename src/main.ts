import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as path from 'path';
import * as fs from 'fs';

async function run() {
  try {

    // Tripple check it's Windows process
    // Can't install nuget.exe for Ubuntu image etc..
    const IS_WINDOWS = process.platform === 'win32';
    if(IS_WINDOWS === false){
      core.setFailed("Nuget.exe only works for Windows.");
      return;
    }

    // Try & find tool in cache
    let directoryToAddToPath:string;
    directoryToAddToPath = await tc.find("nuget", "latest");

    if(directoryToAddToPath){
      core.debug(`Found local cached tool at ${directoryToAddToPath} adding that to path`);
      await core.addPath(directoryToAddToPath);
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

  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
