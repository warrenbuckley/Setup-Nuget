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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            core.debug("Downloading Nuget tool");
            // Download latest Nuget.exe
            const nugetPath = yield tc.downloadTool("https://dist.nuget.org/win-x86-commandline/latest/nuget.exe");
            core.debug(`Nuget file location ${nugetPath}`);
            // Add Nuget.exe CLI tool to path for
            // Other steps to be able to access it
            const fullPath = `${nugetPath}\\nuget.exe`;
            core.debug(`Fullpath ${fullPath}`);
            yield core.addPath(fullPath);
            // Verify Nuget installed
            yield exec.exec("nuget");
        }
        catch (error) {
            core.setFailed(error.message);
        }
    });
}
run();
