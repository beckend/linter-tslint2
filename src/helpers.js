/* eslint no-console: 0 */
// eslint-disable-next-line
import { Disposable } from 'atom';
import ChildProcess from 'child_process';
import { createFromProcess } from 'process-communication';
import { join } from 'path';
import { CONSOLE_PLUGIN_NAME } from './constants';

export function spawnWorker() {
  const env = Object.create(process.env);

  delete env.NODE_PATH;
  delete env.NODE_ENV;
  delete env.OS;

  const child = ChildProcess.fork(join(__dirname, 'worker.js'), [], { env, silent: true });
  const worker = createFromProcess(child);

  child.stdout.on('data', (chunk) => {
    console.log(`[${CONSOLE_PLUGIN_NAME}] STDOUT`, chunk.toString());
  });
  child.stderr.on('data', (chunk) => {
    console.log(`[${CONSOLE_PLUGIN_NAME}] STDERR`, chunk.toString());
  });

  return {
    worker,
    subscription: new Disposable(() => {
      worker.kill();
    })
  };
}

export function showError(givenMessage, givenDetail = null) {
  let detail;
  let message;
  if (message instanceof Error) {
    detail = message.stack;
    message = message.message;
  } else {
    detail = givenDetail;
    message = givenMessage;
  }
  atom.notifications.addError(`[${CONSOLE_PLUGIN_NAME}] ${message}`, {
    detail,
    dismissable: true
  });
}
