const mix = require('laravel-mix')
const pckg = require('./package.json')

const externals = []

for (let name in pckg.dependencies) {
  externals.push(new RegExp(`^${name}(\\/.+)?$`))
}

mix.js('src/index.js', 'dist')
   .copy('LICENSE.md', 'dist')
   .copy('package.json', 'dist')
   .copy('README.md', 'dist')
   .setPublicPath('dist')
   .disableNotifications()
   .webpackConfig({
     'externals': externals,
     'output': {
       'library': pckg.name,
       'libraryTarget': 'umd'
     }
   })
