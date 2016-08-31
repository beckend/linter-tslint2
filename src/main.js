/* eslint no-console: 0 */
// eslint-disable-next-line
import { CompositeDisposable } from 'atom';
import path from 'path';
import fs from 'fs';
import { spawnWorker, showError } from './helpers';
import {
  PACKAGE_NAME,
  CONSOLE_PLUGIN_NAME
} from './constants';

class LinterTslint {

  static __TEST__ = false

  config = {
    rulesDirectory: {
      type: 'string',
      title: 'Custom rules directory (absolute path)',
      default: ''
    },
    useLocalTslint: {
      type: 'boolean',
      title: 'Try using the local tslint package (if exist)',
      default: true
    }
  }

  // Worker
  workerActive = true
  worker = null

  // User settings, observed and updated
  userConfig = {
    rulesDirectory: '',
    useLocalTslint: true
  }

  activate() {
    require('atom-package-deps').install(PACKAGE_NAME);

    this.subscriptions = new CompositeDisposable();
    this.scopes = [ 'source.ts', 'source.tsx' ];
    this
      .subscriptions
      .add(atom.config.observe(`${PACKAGE_NAME}.rulesDirectory`, dir => {
        if (dir && path.isAbsolute(dir)) {
          if (this.__TEST__) {
            try {
              fs.statSync(dir);
              this.userConfig.rulesDirectory = dir;
            } catch (er) {
              console.log(`[${CONSOLE_PLUGIN_NAME}] -`, er);
            }
          } else {
            fs.stat(dir, (err, stats) => {
              if (stats && stats.isDirectory()) {
                this.userConfig.rulesDirectory = dir;
              }
            });
          }
        }
      }));

    this
      .subscriptions
      .add(atom.config.observe(`${PACKAGE_NAME}.useLocalTslint`, use => {
        this.userConfig.useLocalTslint = use;
      }));

    const initializeWorker = () => {
      const { worker, subscription } = spawnWorker();
      this.worker = worker;
      this.subscriptions.add(subscription);
      worker.onDidExit(() => {
        if (this.workerActive) {
          showError('Worker died unexpectedly', 'Check your console for more ' +
            'info. A new worker will be spawned.');
          setTimeout(initializeWorker, 1000);
        }
      });
    };
    initializeWorker();
  }

  deactivate() {
    this.workerActive = false;
    this
      .subscriptions
      .dispose();
  }

  provideLinter() {
    return {
      name: PACKAGE_NAME,
      grammarScopes: this.scopes,
      scope: 'file',
      lintOnFly: true,
      lint: async (textEditor) => {
        const text = textEditor.getText();
        if (text.length === 0) {
          return [];
        }
        const filePath = textEditor.getPath();
        const projectPaths = atom.project.getPaths();

        return await this.worker.request('job', {
          contents: text,
          type: 'lint',
          config: this.userConfig,
          filePath,
          projectPaths
        });
      }
    };
  }

}

export default new LinterTslint();
