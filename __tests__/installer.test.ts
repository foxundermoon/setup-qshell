import io = require('@actions/io');
import fs = require('fs');
import os = require('os');
import path = require('path');
import * as installer from '../src/installer';

const toolDir = path.join(
  __dirname,
  'runner',
  path.join(
    Math.random()
      .toString(36)
      .substring(7)
  ),
  'tools'
);
const tempDir = path.join(
  __dirname,
  'runner',
  path.join(
    Math.random()
      .toString(36)
      .substring(7)
  ),
  'temp'
);

process.env['RUNNER_TOOL_CACHE'] = toolDir;
process.env['RUNNER_TEMP'] = tempDir;

const IS_WINDOWS = process.platform === 'win32';

describe('installer tests', () => {
  beforeAll(async () => {
    await io.rmRF(toolDir);
    await io.rmRF(tempDir);
  }, 100000);

  it('Acquires version of qshell if no matching version is installed', async () => {
    await installer.getQshell('2.6.2');
    const qshellDir = path.join(toolDir, 'qshell', '2.6.2', os.arch());

    expect(fs.existsSync(`${qshellDir}.complete`)).toBe(true);
    if (IS_WINDOWS) {
      expect(fs.existsSync(path.join(qshellDir, 'qshell.exe'))).toBe(true);
    } else {
      expect(fs.existsSync(path.join(qshellDir, 'bin', 'qshell'))).toBe(true);
    }
  }, 100000);

  if (IS_WINDOWS) {
    it('Falls back to backup location if first one doesnt contain correct version', async () => {
      await installer.getQshell('2.6.2');
      const nodeDir = path.join(toolDir, 'qshell', '2.6.2', os.arch());

      expect(fs.existsSync(`${nodeDir}.complete`)).toBe(true);
      expect(fs.existsSync(path.join(nodeDir, 'qshell.exe'))).toBe(true);
    }, 100000);

    it('Falls back to third location if second one doesnt contain correct version', async () => {
      await installer.getQshell('2.6.2');
      const qshellDir = path.join(toolDir, 'qshell', '2.6.2', os.arch());

      expect(fs.existsSync(`${qshellDir}.complete`)).toBe(true);
      expect(fs.existsSync(path.join(qshellDir, 'qshell.exe'))).toBe(true);
    }, 100000);
  }

  it('Throws if no location contains correct qshell version', async () => {
    let thrown = false;
    try {
      await installer.getQshell('1000');
    } catch {
      thrown = true;
    }
    expect(thrown).toBe(true);
  });

  it('Uses version of qshell installed in cache', async () => {
    const nodeDir: string = path.join(toolDir, 'qshell', '2.6.2', os.arch());
    await io.mkdirP(nodeDir);
    fs.writeFileSync(`${nodeDir}.complete`, 'hello');
    // This will throw if it doesn't find it in the cache (because no such version exists)
    await installer.getQshell('2.6.2');
    return;
  });
});
