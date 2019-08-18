"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const exec = __importStar(require("@actions/exec"));
const tc = __importStar(require("@actions/tool-cache"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let directoryToAddToPath;
            // Try & find tool in cache
            directoryToAddToPath = yield tc.find("nuget", "latest");
            if (directoryToAddToPath) {
                core.debug(`Found local cached tool at ${directoryToAddToPath}`);
                core.addPath(directoryToAddToPath);
                return;
            }
            core.debug("Downloading Nuget tool");
            core.debug(`Process platform: ${process.platform}`);
            // Download latest Nuget.exe
            const nugetPath = yield tc.downloadTool("https://dist.nuget.org/win-x86-commandline/latest/nuget.exe");
            core.debug(`Nuget file location ${nugetPath}`);
            // Rename the file which is a GUID without extension
            var folder = path.dirname(nugetPath);
            var fullPath = path.join(folder, "nuget.exe");
            fs.renameSync(nugetPath, fullPath);
            tc.cacheDir(folder, "nuget", "latest");
            // Add Nuget.exe CLI tool to path for
            // Other steps to be able to access it
            core.debug(`Fullpath ${fullPath}`);
            yield core.addPath(folder);
            // Verify Nuget installed
            yield exec.exec(fullPath);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
