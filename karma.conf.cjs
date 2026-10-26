// Se usa la extensión .cjs (CommonJS) porque el package.json de Stog
// tiene "type": "module". Con .js, "module.exports" daría error.
const path = require('path')
const puppeteer = require('puppeteer')

// Asigna la ruta del ejecutable de Chromium descargado por Puppeteer
process.env.CHROME_BIN = puppeteer.executablePath()

module.exports = async function (config) {
  process.env.CHROME_BIN = await puppeteer.executablePath()
  config.set({
    basePath: '',

    // jasmine: define cómo se escriben las pruebas (describe, it, expect)
    // webpack: empaqueta los specs antes de correrlos
    frameworks: ['jasmine', 'webpack'],

    // Dónde están los tests. "**" significa "cualquier subcarpeta".
    files: [
      { pattern: 'tests/**/*.spec.js', watched: false },
      { pattern: 'tests/**/*.spec.jsx', watched: false }
    ],

    // Antes de ejecutar cada spec, pasa por webpack.
    preprocessors: {
      'tests/**/*.spec.js': ['webpack'],
      'tests/**/*.spec.jsx': ['webpack']
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
              loader: 'babel-loader',
              options: {
                presets: [
                  '@babel/preset-env',
                  ['@babel/preset-react', { runtime: 'automatic' }]
                ]
              }
            }
          },
          {
            test: /\.jsx?$/,
            include: path.resolve(__dirname, 'src'),
            enforce: 'post',
            use: {
              loader: '@jsdevtools/coverage-istanbul-loader',
              options: { esModules: true }
            }
          }
        ]
      },
      resolve: { extensions: ['.js', '.jsx'] }
    },

    // Define ChromeHeadless para usar la variable de entorno CHROME_BIN
    browsers: ['ChromeHeadlessNoSandbox'],

    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
      }
    },

    singleRun: true,
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      dir: 'coverage',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'text', subdir: '.', file: 'cobertura.txt' },
        { type: 'text-summary' }
      ]
    }
  })
}