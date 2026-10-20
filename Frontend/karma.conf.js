const webpack = require('webpack');
const fs = require('fs');
const path = require('path');

if (process.platform === 'win32' && !process.env.CHROME_BIN) {
  const edgePath = [process.env['ProgramFiles(x86)'], process.env.ProgramFiles, process.env.LOCALAPPDATA]
    .filter(Boolean)
    .map((directory) => path.join(directory, 'Microsoft', 'Edge', 'Application', 'msedge.exe'))
    .find((candidate) => fs.existsSync(candidate));

  if (edgePath) process.env.CHROME_BIN = edgePath;
}

module.exports = function configureKarma(config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      { pattern: 'src/**/*.test.js', watched: false },
      { pattern: 'public/imagenes/**/*', watched: false, included: false },
    ],
    proxies: {
      '/imagenes/': '/base/public/imagenes/',
    },
    preprocessors: {
      'src/**/*.test.js': ['webpack'],
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  require.resolve('@babel/preset-env'),
                  [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
                ],
              },
            },
          },
          {
            test: /\.css$/i,
            use: [require.resolve('style-loader'), require.resolve('css-loader')],
          },
        ],
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.PUBLIC_URL': JSON.stringify(''),
        }),
      ],
      resolve: { extensions: ['.js', '.jsx'] },
    },
    webpackMiddleware: { stats: 'errors-warnings' },
    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    restartOnFileChange: true,
    plugins: ['karma-jasmine', 'karma-chrome-launcher', 'karma-webpack'],
  });
};
