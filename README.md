Extension example for PWAjet

# Start your extension with this scaffold

## Features

* Eslint configured the same way as a PWAjet
* Typescript
* Jest
* React testing library
* rollup
* postcss
* babel
* and much more to best coding experience

## Getting started

1. Once you have a PWAjet installed, get all it`s content from root directory (yes - just compiled statics)
2. Create `public` folder at the root of your extension project
3. Copy all files from 1. to `public`
5. `yarn`
6. `yarn start`
7. Done!

## Start your development

1. Remove unnecessary or install extra dependencies. You may see current ones at `package.json`
2. Subscribe to a render event, or register your screen/block/payment

### pwajet.d.ts

PWAjet has shared API which described by `pwajet.d.ts`. Make sure you`re using actual version, that meets the version of a PWAjet.

### development vs production

Development mode allows you to test your extension right at PWAjet like extension already installed:
html-webpack-plugin inserts extension`s script to index.html (PWAjet entry point)

But extension builds as a pure js and css assets for production.

### production file structure

After `yarn build` complete, extension under the `build` directory can be described as:

All emitted assets will be placed to `/assets/extensions/extension-developer-name/extension-name/`

### What next?

After build you can find `INSTRUCTION.md` at your build path `/assets/extensions/extension-developer-name/extension-name/`
