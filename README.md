# Example [PWAjet](https://pwajet.simtechdev.com/) extension for CS-Cart and Multi-Vendor

Start your extension with this scaffold.

## Features

* Eslint configured the same way as a PWAjet
* Typescript
* Jest
* React testing library
* webpack
* css autoprefixer
* babel
* and much more to best coding experience

## Getting started

1. Once you have a PWAjet installed, get all its content from the root directory (yes - just compiled statics)
2. Create `public` folder at the root of your extension project
3. Copy all files from 1. to `public`
4. Copy `pwajet.d.ts` from `public` to `src`
5. Run `yarn` and `yarn start`
6. Done!

## Start your development

1. Remove unnecessary or install extra dependencies. You may see current ones at `package.json`
2. Subscribe to a render event or register your screen/block/payment

### `pwajet.d.ts`

PWAjet has shared API, which is described by `pwajet.d.ts`. Make sure you're using actual version that meets the version of a PWAjet.

### Development vs Production

Development mode allows you to test your extension right at PWAjet like extension already installed:
html-webpack-plugin inserts extension's script to index.html (PWAjet entry point)

But extension builds as a pure js and css assets for production.

### Production file structure

After `yarn build` complete, extension under the `build` directory can be described as:

1. All emitted assets will be placed to `assets/extensions/extension-developer-name/extension-name/`
2. `.../css` - emitted styles for your components
3. `.../js` - emitted scripts of your extension

### What files is entry point?

Or what files should be included to `pwajet.extensions` array?
Usually, entry point and runtime chunk: look for files like `module-name.....chunk.js` and `runtime~module-name.....chunk.js`. Other scripts can be loaded on demand by webpack itself.

### `src/index.ts`

It's your main entry point. Make sure it doesn't contain heavy imports and much logic. This file will be included in the PWAjet app on bootstrap. So it may make the app work slow.
The best way to optimize it - is to take all imports as dynamic (lazy). Use shared API to register your promises. In this way, your chunks and dependencies will load on demand.
