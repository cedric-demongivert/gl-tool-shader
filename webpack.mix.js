const mix = require('laravel-mix')
const package = require('./package.json')

const externals = []

for (const name in package.dependencies) {
  externals.push(new RegExp(`^${name}(\\/.+)?$`))
}

mix.disableNotifications()
   .webpackConfig({
     'externals': externals,
     'output': {
       'library': package.name,
       'libraryTarget': 'umd'
     }
   })
   .ts('sources/index.ts', 'distribution')
   .copy('LICENSE.md', 'distribution')
   .copy('package.json', 'distribution')
   .copy('README.md', 'distribution')
   .setPublicPath('distribution')
