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
// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
let osPlat = os.platform();
let osArch = os.arch();
if (!tempDirectory) {
    let baseLocation;
    if (process.platform === 'win32') {
        // On windows use the USERPROFILE env variable
        baseLocation = process.env['USERPROFILE'] || 'C:\\';
    }
    else {
        if (process.platform === 'darwin') {
            baseLocation = '/Users';
        }
        else {
            baseLocation = '/home';
        }
    }
    tempDirectory = path.join(baseLocation, 'actions', 'temp');
}
function getQshell(version) {
    return __awaiter(this, void 0, void 0, function* () {
        // check cache
        let toolPath = tc.find('qshell', version);
        // If not found in cache, download
        if (!toolPath) {
            // download, extract, cache
            toolPath = yield acquireQshell(version);
        }
        console.log(`toolPath: ${toolPath}`);
        //
        // a tool installer initimately knows details about the layout of that tool
        // for example, node binary is in the bin folder after the extract on Mac/Linux.
        // layouts could change by version, by platform etc... but that's the tool installers job
        //
        // if (osPlat != 'win32') {
        //   toolPath = path.join(toolPath, 'bin');
        // }
        //
        // prepend the tools path. instructs the agent to prepend for future tasks
        core.addPath(toolPath);
    });
}
exports.getQshell = getQshell;
function acquireQshell(version) {
    return __awaiter(this, void 0, void 0, function* () {
        //
        // Download - a tool installer intimately knows how to get the tool (and construct urls)
        //  http://devtools.qiniu.com/qshell-linux-x86-v2.4.0.zip
        //  https://devtools.qiniu.com/qshell-windows-x64-v2.4.0.exe.zip
        let urlFileName = `qshell-${osPlat == 'win32' ? 'windows' : osPlat}-${osArch}-v${version}${osPlat == 'win32' ? '.exe' : ''}.zip`;
        let fileName = `qshell_${osPlat == 'win32' ? 'windows' : osPlat}${osArch}${osPlat == 'win32' ? '.exe' : ''}`;
        let downloadUrl = `http://devtools.qiniu.com/${urlFileName}`;
        console.log(`downloadUrl: ${downloadUrl}`);
        let downloadPath;
        downloadPath = yield tc.downloadTool(downloadUrl);
        console.log(`downloadPath: ${downloadPath}`);
        //
        // Extract
        //
        let zipPath = path.join(downloadPath, urlFileName);
        console.log(`zipPath: ${zipPath}`);
        // const items = await fse.readdir(downloadPath);
        // console.log(`downloadPath files: ${items.join('\n')}`);
        let extPath = yield tc.extractZip(downloadPath);
        console.log(`extPath: ${extPath}`);
        //
        // cache qshell
        //
        let oldPath = path.join(extPath, fileName);
        let newPath = path.join(extPath, `qshell${osPlat == 'win32' ? '.exe' : ''}`);
        // await fse.rename(oldPath, newPath);
        const cacheRst = yield tc.cacheFile(oldPath, newPath, 'qshell', version);
        console.log(`cacheRst: ${cacheRst}`);
        return cacheRst;
    });
}
