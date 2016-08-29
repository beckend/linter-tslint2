linter-tslint
==============

This linter plugin for AtomLinter provides an interface to [tslint](https://github.com/palantir/tslint). It will be used with files that have the "TypeScript" or "TypeScriptReact" syntax.

### Plugin installation
```
$ Right now it's unofficial
```

## Settings
You can configure linter-tslint by editing `~/.atom/config.cson` (choose Config... in Atom menu):
```coffee
'linter-tslint':
  # Custom rules directory (absolute path)
  rulesDirectory: "/path/to/rules"
  # Try using the local tslint package (if exist)
  useLocalTslint: true
```

##
  @TODO - fix lint on the fly(not just on save), have no idea how to fix.

## Development
  `npm -g i babel`
  Modify `src`, compile with `npm run compile-dev`.
  `npm run compile` which is the minified build using "babili" preset, does not seem to work yet.

## Contributing
If you would like to contribute enhancements or fixes, please do the following:

1. Fork the plugin repository.
1. Hack on a separate topic branch created from the latest `master`.
1. Commit and push the topic branch.
1. Make a pull request.
1. welcome to the club

Thank you for helping out!
