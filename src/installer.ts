// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env['RUNNER_TEMPDIRECTORY'] || '';
import * as core from '@actions/core';
import * as io from '@actions/io';
import * as tc from '@actions/tool-cache';
import * as os from 'os';
import * as path from 'path';

let osPlat: string = os.platform();
let osArch: string = os.arch();

if (!tempDirectory) {
  let baseLocation;
  if (process.platform === 'win32') {
    // On windows use the USERPROFILE env variable
    baseLocation = process.env['USERPROFILE'] || 'C:\\';
  } else {
    if (process.platform === 'darwin') {
      baseLocation = '/Users';
    } else {
      baseLocation = '/home';
    }
  }
  tempDirectory = path.join(baseLocation, 'actions', 'temp');
}

export async function getQshell(version: string) {
  // check cache
  let toolPath: string = tc.find('qshell', version);

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

async function acquireQshell(version: string): Promise<string> {
  //
  // Download - a tool installer intimately knows how to get the tool (and construct urls)
  //  http://devtools.qiniu.com/qshell-linux-x86-v2.4.0.zip
  //  https://devtools.qiniu.com/qshell-windows-x64-v2.4.0.exe.zip
  let urlFileName: string = `qshell-${
    osPlat == 'win32' ? 'windows' : osPlat
  }-${osArch}-v${version}${osPlat == 'win32' ? '.exe' : ''}.zip`;

  let fileName: string = `qshell_${
    osPlat == 'win32' ? 'windows' : osPlat
  }${osArch}${osPlat == 'win32' ? '.exe' : ''}`;

  let downloadUrl = `http://devtools.qiniu.com/${urlFileName}`;
  console.log(`downloadUrl: ${downloadUrl}`);

  let downloadPath: string;

  downloadPath = await tc.downloadTool(downloadUrl);

  console.log(`downloadPath: ${downloadPath}`);

  //
  // Extract
  //
  let zipPath = path.join(downloadPath, urlFileName);

  console.log(`zipPath: ${zipPath}`);
  let extPath: string = await tc.extractZip(zipPath);

  console.log(`extPath: ${extPath}`);
  //
  // cache qshell
  //
  let oldPath = path.join(extPath, fileName);
  let newPath = path.join(extPath, `qshell${osPlat == 'win32' ? '.exe' : ''}`);
  // await fse.rename(oldPath, newPath);
  const cacheRst = await tc.cacheFile(oldPath, newPath, 'qshell', version);
  console.log(`cacheRst: ${cacheRst}`);
  return cacheRst;
}
