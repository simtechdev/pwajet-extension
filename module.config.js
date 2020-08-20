const npmConfig = require('./package.json')

module.exports = {
  /**
   * Version
   */
  version: npmConfig.version,
  /**
   * Company name - without special chars,
   * one or several words splitted by dash
   */
  vendor: 'simtechdev',
  /**
   * Module name - without special chars,
   * one or several words splitted by dash
   */
  name: 'module-name',
}
