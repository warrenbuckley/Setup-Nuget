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
const tc = __importStar(require("@actions/tool-cache"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Tripple check it's Windows process
            // Can't install nuget.exe for Ubuntu image etc..
            const IS_WINDOWS = process.platform === 'win32';
            if (IS_WINDOWS === false) {
                core.setFailed("Nuget.exe only works for Windows.");
                return;
            }
            // Try & find tool in cache
            let directoryToAddToPath;
            directoryToAddToPath = yield tc.find("nuget", "latest");
            if (directoryToAddToPath) {
                core.debug(`Found local cached tool at ${directoryToAddToPath} adding that to path`);
                yield core.addPath(directoryToAddToPath);
                return;
            }
            // Download latest Nuget.exe
            core.debug("Downloading Nuget tool");
            const nugetPath = yield tc.downloadTool("https://dist.nuget.org/win-x86-commandline/latest/nuget.exe");
            // Rename the file which is a GUID without extension
            var folder = path.dirname(nugetPath);
            var fullPath = path.join(folder, "nuget.exe");
            fs.renameSync(nugetPath, fullPath);
            //Cache the directory with Nuget in it - which returns a NEW cached location
            var cachedToolDir = yield tc.cacheDir(folder, "nuget", "latest");
            core.debug(`Cached Tool Dir ${cachedToolDir}`);
            // Add Nuget.exe CLI tool to path for other steps to be able to access it
            yield core.addPath(cachedToolDir);
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
