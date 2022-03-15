import webpack from '@cypress/webpack-preprocessor';

// eslint-disable-next-line no-restricted-imports
import webpackConfigs from '../../../../webpack.config';

module.exports = (on) => {
  const options = {
    webpackOptions: webpackConfigs({ isCypress: true }),
    watchOptions: {},
  };

  on('file:preprocessor', webpack(options));
};
