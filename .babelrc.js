const packageJson = require('./package.json')

module.exports = {
    "presets": [
      "@babel/preset-env",
      "@babel/preset-typescript",
      "@babel/preset-react"
    ],
    "plugins": [
      "@babel/proposal-class-properties",
      "@babel/proposal-object-rest-spread",
      "@babel/plugin-transform-runtime",
      [
        "babel-plugin-jsx-owner",
        {
          "traceId": "__owner_data",
          "paths": [
            "src/components"
          ],
          "prefix": packageJson.name
        }
      ]
    ]
  }
