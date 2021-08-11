"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getQshell = void 0;
// Load tempDirectory before it gets wiped by tool-cache
const core = __importStar(require("@actions/core"));
const tc = __importStar(require("@actions/tool-cache"));
const os = __importStar(require("os"));
const path = __importStar(require("path"));
// import {promises as fse} from 'fs';
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
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
async function getQshell(version) {
    // check cache
    let toolPath = tc.find('qshell', version);
    // If not found in cache, download
    if (!toolPath) {
        // download, extract, cache
        toolPath = await acquireQshell(version);
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
}
exports.getQshell = getQshell;
async function acquireQshell(version) {
    //
    // Download - a tool installer intimately knows how to get the tool (and construct urls)
    // https://github.com/qiniu/qshell/releases/download/v2.6.2/qshell-v2.6.2-darwin-amd64.tar.gz
    // https://github.com/qiniu/qshell/releases/download/v2.6.2/qshell-v2.6.2-linux-386.tar.gz
    let arch;
    switch (os.arch()) {
        case 'x64':
            arch = 'amd64';
            break;
        case 'x32':
            arch = '386';
            break;
        default:
            arch = os.arch();
            break;
    }
    const platform = os.platform() === 'win32' ? 'windows' : os.platform();
    const fileName = `qshell-v${version}-${platform}-${arch}.tar.gz`;
    const extFileName = `qshell${platform === 'win32' ? '.exe' : ''}`;
    const downloadUrl = `https://github.com/qiniu/qshell/releases/download/v${version}/${fileName}`;
    const downloadPath = await tc.downloadTool(downloadUrl);
    // console.log(`downloadPath: ${downloadPath}`);
    //
    // Extract
    //
    // let zipPath = path.join(downloadPath, urlFileName);
    // console.log(`zipPath: ${zipPath}`);
    // const items = await fse.readdir(downloadPath);
    // console.log(`downloadPath files: ${items.join('\n')}`);
    const extPath = await tc.extractTar(downloadPath, undefined, 'zxvf');
    // console.log(`extPath: ${extPath}`);
    //
    // cache qshell
    //
    const oldPath = path.join(extPath, extFileName);
    // console.log(`oldPath: ${oldPath}`);
    // let newPath = path.join(extPath, `qshell${osPlat == 'win32' ? '.exe' : ''}`);
    // await fse.rename(oldPath, newPath);
    // const unzipFiles = await fse.readdir(extPath);
    // console.log(`unzipFiles: ${unzipFiles.join('\n')}`);
    const cacheRst = await tc.cacheFile(oldPath, `qshell${arch === 'win32' ? '.exe' : ''}`, 'qshell', version);
    // console.log(`cacheRst: ${cacheRst}`);
    return cacheRst;
}
