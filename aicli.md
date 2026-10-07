# x4js command line

`x4js` creates, serves and builds x4js applications. It bundles TypeScript and styles with esbuild; there is nothing else to configure.

```
x4js create <project> [--template <name>] [--no-install]
x4js templates
x4js dev   [--config <file>] [--env <file>] [--host <host>] [--port <port>] [--http|--https] [--open]
x4js build [--config <file>] [--env <file>] [--debug]
x4js --help | --version
```

## Install

The command ships with the `x4js` package. In a project created by `x4js create` it is already a dependency, and the npm scripts use it:

```json
{
	"scripts": {
		"dev": "x4js dev",
		"build": "x4js build"
	}
}
```

```
npm run dev
npm run build
```

Without a project yet, run it through npx: `npx x4js create my-app`.

### Which x4js runs

There can be two copies on a machine: the one in the project's `node_modules` and a global one (`npm install -g x4js`).

| You type | Copy used |
|---|---|
| `npm run dev`, `npx x4js dev` | the project's own copy |
| `x4js dev` | the global copy |

A global copy older than the project's can behave differently. `dev` and `build` print their version on the first line; check it when something looks wrong.

```
x4js       2.3.11
mode       dev
config     C:\work\my-app\x4.config.json
outdir     C:\work\my-app\bin
server     http://127.0.0.1:8000
```

## Commands

### `x4js create <project>`

Creates a new project in the folder `<project>` from a template.

| Option | Effect |
|---|---|
| `--template <name>`, `-t <name>` | Template to use. Default: `app`. |
| `--no-install` | Do not run `npm install` after creating the files. |

- The project name becomes the package name: lowercase letters, digits, `.`, `_` and `-` only.
- The target folder must be empty or not exist.
- Templates are downloaded from the `rlibre/x4-templates` repository on GitHub, so the command needs network access.
- The `x4js` dependency of the new project is set to the version line of the command that created it (for example `2.3`).

### `x4js templates`

Lists the available templates with a one-line description of each.

### `x4js dev`

Builds the application, serves the output folder and rebuilds on every change.

| Option | Effect |
|---|---|
| `--config <file>` | Config file to use. Default: `x4.config.json`. |
| `--env <file>` | File of variables for `$NAME` in the config (see below). |
| `--host <host>` | Address to listen on. Default: `127.0.0.1`. |
| `--port <port>` | Port to listen on. Default: the first free port from 8000. |
| `--http`, `--https` | Force the protocol, whatever the config says. |
| `--open` | Open the browser once the server is ready. |

- The page reloads when a source or a copied file changes. A change that only touches CSS is applied without reloading.
- Build errors and warnings are printed in the terminal.
- Editing the config file restarts the build. The file given to `--env` is read again at that moment; editing it alone restarts nothing.
- HTTPS needs a certificate and a key, declared in `dev.tls` (see below).

### `x4js build`

Writes the application to the output folder.

| Option | Effect |
|---|---|
| `--config <file>` | Config file to use. Default: `x4.config.json`. |
| `--env <file>` | File of variables for `$NAME` in the config (see below). |
| `--debug` | Debug build: not minified, with source maps. |

The output folder is **emptied before each build**. Do not keep hand-written files in it: put them in the sources and list them in `copy`.

| | `dev` | `build --debug` | `build` |
|---|---|---|---|
| Minified | no | no | yes |
| Source maps | separate `.map` files | separate `.map` files | none |
| `DEBUG_MODE` | `true` | `true` | `false` |
| Live reload | yes | no | no |

## `x4.config.json`

The file sits at the root of the project. Every key is optional; without the file, the defaults below apply.

```json
{
	"entryPoints": ["src/main.ts"],
	"outdir": "./bin",
	"copy": [
		{ "from": "./src/assets", "to": "assets" },
		{ "from": "./src/index.html", "to": "index.html" }
	]
}
```

| Key | Default | Meaning |
|---|---|---|
| `entryPoints` | `["src/main.ts"]` | Files to bundle. `src/main.ts` produces `main.js` and `main.css`. |
| `outdir` | `"./bin"` | Output folder. It cannot be the project root. |
| `copy` | `[]` | Files or folders copied to the output after each successful build. `to` is relative to `outdir`. |
| `external` | `[]` | Module names left out of the bundle. |
| `define` | `{}` | Constants replaced at build time. Values are JavaScript expressions written as strings, for example `"\"prod\""`. |
| `dev` | | Dev server settings: `host`, `port`, `https`, `tls`. |
| `esbuild` | `{}` | Native esbuild options, applied last. They override everything above. |

Relative paths are resolved from the project root. Paths and `define` values accept environment variables, written `$NAME` or `${NAME}`; an undefined variable is an error.

### Environment variables in `define`

A `define` value is a JavaScript expression, so a text is written between escaped double quotes. The variable is read when the command runs: its value ends up in the bundle.

```json
{
	"define": {
		"API_URL": "\"$API_URL\"",
		"API_PORT": "$API_PORT"
	}
}
```

```ts
declare const API_URL: string;
declare const API_PORT: number;
```

With `API_URL=https://example.com` and `API_PORT=8080`, the code sees the text `"https://example.com"` and the number `8080`. A quote or a backslash in the value of a variable is escaped: use double quotes around `$NAME`, not single ones.

Everything in the bundle is public: do not put a secret in `define`.

### Variables from a file

`--env <file>` reads variables from a file of `NAME=value` lines, for `dev` and `build`:

```
# .env
API_URL=https://example.com
API_PORT=8080
```

```
x4js dev --env .env
```

- The file only serves `$NAME` in the config. Its variables are not given to the application: pass the ones it needs through `define`.
- A variable already defined in the environment keeps its value: the file only adds the missing ones.
- A file that does not exist is an error.

This lets the same config work on a machine and on a host that defines the variables itself:

```json
{
	"scripts": {
		"dev": "x4js dev --env .env",
		"build": "x4js build"
	}
}
```

Keep the file out of Git when it holds values that are not public.

### The HTML page

The command does not generate an HTML page. Write `src/index.html` and copy it with `copy`, as in the example above. It loads the bundle by its output name:

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf8">
		<link rel="stylesheet" href="main.css">
		<script src="main.js"></script>
	</head>
</html>
```

### HTTPS in dev

```json
{
	"dev": {
		"https": true,
		"tls": { "cert": "./certs/dev.crt", "key": "./certs/dev.key" }
	}
}
```

## What the build handles

| Import | Result |
|---|---|
| `.ts`, `.js` | Bundled into one script per entry point (browser, ES2020). |
| `.scss`, `.sass`, `.css` | Compiled and bundled into one stylesheet per entry point. |
| `.less` | Same, if the `less` package is installed in the project (`npm install -D less`). |
| `.svg` imported from a script | A `data:` URL string, usable as an icon. |
| `.png`, `.jpg`, `.jpeg`, `.ttf`, `.woff`, `.woff2` | Copied to `assets/` with a hashed name. |

Two constants are always defined:

| Constant | Value |
|---|---|
| `DEBUG_MODE` | `true` in `dev` and `build --debug`, `false` in `build`. |
| `VERSION_ID` | Build date as a number, `YYMMDD`. |

Declare them once in your project to use them from TypeScript:

```ts
declare const DEBUG_MODE: boolean;
declare const VERSION_ID: number;
```

## Troubleshooting

| Symptom | Cause |
|---|---|
| `index.html` is missing from the output folder | It is not listed in `copy`, or the command that ran is an older global copy. Compare the version on the first line with the project's. |
| A file placed in the output folder disappeared | `x4js build` empties the folder. Move the file to the sources and add it to `copy`. |
| `Cannot find package 'esbuild'` | The dependencies of the `x4js` copy being run are not installed. Run `npm install` in the project. |
| `Config file not found` | The file given to `--config` does not exist. Without `--config`, a missing `x4.config.json` is not an error. |
| `Environment variable '…' is not defined` | A path or a `define` value in the config uses `$NAME` and the variable is not set, in the environment or in the file given to `--env`. |
| `Env file not found` | The file given to `--env` does not exist. |
| `LESS support requires the "less" package` | A `.less` file is imported and `less` is not installed in the project. |
| No colors in the terminal, or unwanted ones | Set `FORCE_COLOR=1` to force them, `NO_COLOR=1` to remove them. |
