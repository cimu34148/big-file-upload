/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.security = {
    csrf: {
      enable: false
    },
    domainWhiteList: ['*']
  }

  config.multipart = {
    mode: 'file',
    whitelist() {
      return true
    } 
  }

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1680940858199_1391';

  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
