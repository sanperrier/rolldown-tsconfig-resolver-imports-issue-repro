# Rolldown `tsconfig` resolver cannot resolve package.json `imports` in `extends`

## Summary

Rolldown fails to resolve a `tsconfig.json` whose `extends` field uses a package import specifier, e.g. `"#root/tsconfig.json"`.

The same config resolves correctly with:

- TypeScript: `tsc -p ... --showConfig`
- Node ESM resolution: `import.meta.resolve("#root/tsconfig.json")`

But Rolldown fails during its tsconfig resolution step.

## Prepare

```sh
npm ci
```

## The issue

```sh
cd packages/pkg
```
```sh
npx rolldown --input src/index.ts --tsconfig tsconfig.json --format es --dir dist
```
fails (exit code 1):
>```sh
> ERROR  [UNHANDLEABLE_ERROR] Something went wrong inside rolldown, please report this problem at https://github.com/rolldown/rolldown/issues.
>Tsconfig not found #root/tsconfig.json
>
>Caused by:
>    Failed to resolve tsconfig option: /workspaces/rolldown-tsconfig-resolver-imports-issue-repro/packages/pkg/tsconfig.json
>```

But node and Typescript resolve `#root/tsconfig.json` without problems:
```sh
npx tsc --showConfig
```
>```
>{
>    "compilerOptions": {
>        "target": "es2022",
>        "module": "esnext",
>        "diagnostics": true,
>        "outDir": "./dist",
>        "declaration": true,
>        "noEmit": true
>    },
>    "files": [
>        "./src/index.ts"
>    ],
>    "exclude": [
>        "/workspaces/rolldown-tsconfig-resolver-imports-issue-repro/packages/pkg/dist"
>    ]
>}
>```

```sh
node -e "console.log(import.meta.resolve('#root/tsconfig.json'))"
```
>```
>file:///workspaces/rolldown-tsconfig-resolver-imports-issue-repro/tsconfig.json
>```

```sh
npx tsc -p ./tsconfig.json
```
>```
>Files:               65
>Lines:            56141
>Identifiers:      48097
>Symbols:          53080
>Types:            27957
>Instantiations:   27046
>Memory used:    123840K
>I/O read:         0.01s
>I/O write:        0.00s
>Parse time:       0.44s
>Bind time:        0.14s
>Check time:       1.27s
>Emit time:        0.00s
>Total time:       1.85s
>```

I can make it work with manually copying contents of `#root/tsconfig.json` into `pkg/tsconfig.flat.json`:

```sh
npx rolldown --input src/index.ts --tsconfig tsconfig.flat.json --format es --dir dist
```
>```
><DIR>/index.js  chunk │ size: 0.20 kB
>
>✔ rolldown v1.0.3 Finished in 20.78 ms 
>```

But it is cumbersome and fragile in monorepo setups.