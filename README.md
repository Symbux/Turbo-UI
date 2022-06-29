<p align="center">
	<a href="#">
		<img width="300" src="https://raw.githubusercontent.com/Symbux/Turbo-Vite/master/logo.svg">
	</a>
</p>

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/Symbux/Turbo-Vite/Build)
![GitHub issues](https://img.shields.io/github/issues/Symbux/Turbo-Vite)
![NPM](https://img.shields.io/npm/l/@symbux/turbo-vite)
![npm (scoped)](https://img.shields.io/npm/v/@symbux/turbo-vite)
![npm](https://img.shields.io/npm/dw/@symbux/turbo-vite)


The Vite plugin offers the ability to take a static or JS framework web application and server-side render it alongside offer the Vite dev server with HMR for development.

<br>
<br>

<p align="center">
	<a href="https://discord.gg/3YuNTEMJey" target="_blank">
		<img width="200" src="https://discord.com/assets/cb48d2a8d4991281d7a6a95d2f58195e.svg">
		<p align="center">We are on Discord!</p>
	</a>
</p>

<br>

---

<br>

## Notes

> This plugin has packages linked to Vue, this is only set as dev dependencies, and shouldn't be installed when installing the project, and the demo app that we use to test is a Vue application, hence the packages being there.

## Installation

With Yarn:
```bash
yarn add @symbux/turbo @symbux/turbo-vite
```

With NPM:
```bash
npm install --save @symbux/turbo @symbux/turbo-vite
```

<br>

---

<br>

## Getting Started

[You can find the documentation here](https://github.com/Symbux/Turbo-Vite/wiki).

```typescript
import { Engine, HttpPlugin, Registry } from '@symbux/turbo';
import VitePlugin from '@symbux/turbo-vite';
import { resolve } from 'path';
import { config as configureDotenv } from 'dotenv';
import VueVitePlugin from '@vitejs/plugin-vue';

// Prepare dotenv.
configureDotenv();

// Initialise engine.
const engine = new Engine({
	autowire: true,
	logLevels: ['info', 'warn', 'error', 'verbose', 'debug'],
	errors: { continue: true },
});

// Register the http plugin.
engine.use(new HttpPlugin({
	port: 80,
	static: String(process.env.VITE_ENV) === 'production' || Registry.get('turbo.mode') === 'production' ? [
		{ folder: resolve(process.cwd(), './web/dist/client/assets'), pathname: '/assets' },
		{ folder: resolve(process.cwd(), './web/dist/client/'), pathname: '/' },
	] : undefined,
	security: {
		disablePoweredBy: true,
		enableHelmet: true,
		helmetOptions: {
			contentSecurityPolicy: false,
			nocache: false,
		},
	},
}));

// Register the Vite plugin.
engine.use(new VitePlugin({
	environment: Registry.get('turbo.mode') === 'production' ? 'production' : 'development',
	root: resolve(process.cwd(), './web'),
	plugins: [ VueVitePlugin() ],
	basePath: '/',
	buildOutput: resolve(process.cwd(), './web/dist'),
}));

// Start engine.
engine.start().catch(err => {
	console.error(err);
});
```

<br>

---

<br>

## Features

A list of available features.

| Feature | Description |
| - | - |
| SSR | Server-side rendering is part of the core of this plugin and allows users to provide pre-rendered HTML for the client while using JS frameworks. |
| Vite | The Vite plugin is used for compiling and bundling JS frameworks, including support for Vue, React, Svelte, Angular, static and more. |
| Auto Routing | Due to the nature of SSR and the framework, we have built in support for auto routing which reads your router file to generate routes. |
| Auto Compilation | The plugin listens to hooks so that it can either start the vite dev server, or compile the application depending on the turbo mode. |
| HMR Dev Server | Vite comes with a blazing fast dev server with HMR (hot module reload) support, which we utilise and register inside of the plugin. |

<br>

---

<br>

## Future development

Here are some things we want to achieve in the future.

| Feature | Description |
| - | - |
| Better Auto Routing | At the moment the auto-router is reading files using Regex, this is of course inefficent, so to find a solution to actually read the router better. |
| Multiple Applications | Allow for multiple applications to be served on the same server, this is a push but the idea is to allow to have separate frontend and admin systems, this can be configured without this using the vite config. |
