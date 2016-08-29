import path from 'path';
import workerHelper from '../worker-helper';

class LintJob {

  // No need to create same program over and over
  tslintProgram = null
  lastConfigurationPath = null
  lastProjectPath = null;

  getTslintProgram({ Linter, configurationPath, projectPath }) {
    if (
      configurationPath === this.lastConfigurationPath
      && projectPath === this.lastProjectPath
      && this.tslintProgram !== null
    ) {
      return this.tslintProgram;
    }

    this.tslintProgram = Linter.createProgram(configurationPath, projectPath);
    return this.tslintProgram;
  }

  lint = async ({ contents, config, filePath, projectPaths }) => {
    const Linter = await workerHelper.getLinter({ config, filePath });
    const configurationPath = Linter.findConfigurationPath(null, filePath);
    const configuration = Linter.loadConfigurationFromPath(configurationPath);
    const program = this.getTslintProgram({
      Linter,
      configurationPath,
      projectPath: projectPaths[0]
    });

    // Apply user rulesDirectory
    let { rulesDirectory } = configuration;
    if (rulesDirectory) {
      const configurationDir = path.dirname(configurationPath);
      if (!Array.isArray(rulesDirectory)) {
        rulesDirectory = [ rulesDirectory ];
      }
      rulesDirectory = rulesDirectory.map(dir => {
        if (path.isAbsolute(dir)) {
          return dir;
        }
        return path.join(configurationDir, dir);
      });

      if (config.rulesDirectory) {
        rulesDirectory.push(config.rulesDirectory);
      }
    }

    // Create and lint
    const linter = new Linter(filePath, contents, {
      formatter: 'json',
      configuration,
      rulesDirectory
    }, program);

    const lintResult = linter.lint();
    if (!lintResult.failureCount) {
      return [];
    }

    return lintResult
      .failures
      .map(failure => {
        const startPosition = failure
          .getStartPosition()
          .getLineAndCharacter();
        const endPosition = failure
          .getEndPosition()
          .getLineAndCharacter();
        return {
          type: 'Warning',
          text: `${failure.getRuleName()} - ${failure.getFailure()}`,
          filePath: path.normalize(failure.getFileName()),
          range: [
            [
              startPosition.line, startPosition.character
            ],
            [ endPosition.line, endPosition.character ]
          ]
        };
      });
  }

}

export default new LintJob();
