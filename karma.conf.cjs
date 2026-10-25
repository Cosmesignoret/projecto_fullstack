module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],

    files: [
  {
    pattern: 'src/data/**/*.js', // db.js y los datos iniciales (db.js importa productos.js)
    type: 'module',
    included: false,
    served: true,
    watched: true,
  },
  {
    pattern: 'src/js/**/*.js',   // las funciones que se van a probar
    type: 'module',
    included: false,
    served: true,
    watched: true,
  },
  {
    pattern: 'tests/**/*.spec.js', // las pruebas
    type: 'module',
    included: true,
    served: true,
    watched: true,
  },
  ],

    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
    autoWatch: false,
  })
}