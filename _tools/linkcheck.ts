import { platform, exit } from 'process';
import { spawn } from 'child_process';

const server = spawn('yarn', ['serve'], {
  stdio: ['ignore', 'pipe', 'ignore'],
});

let output = '';
server.stdout.on('data', (data) => {
  console.log(data.toString());
  output = output + data.toString();
  if (output.indexOf('Serving files from') !== -1) {
    let program;
    if (platform === 'linux') {
      program = 'linkcheck-linux';
    } else if (platform === 'darwin') {
      program = 'linkcheck';
    } else {
      program = 'linkcheck-win';
    }
    const checker = spawn(program, [':4200'], {
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    checker.stdout.on('data', (checkerData) => {
      console.log(checkerData.toString());
    });
    checker.on('exit', (code, other) => {
      console.log('linkcheck finished');
      server.stdout.destroy();
      server.kill();
      checker.stdout.destroy();
      checker.kill();
      exit(code);
    });
  }
});