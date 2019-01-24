// module.exports = {
//   extends: '../../babel.config.js'
// }

module.exports = function (api) {
  const babelEnv = api.env()
  // api.cache.using(() => process.env.NODE_ENV)
  api.cache(true)

  console.log('babelEnv=', babelEnv)

  const presets = setupPresets(babelEnv)
  const plugins = setupPlugins(babelEnv)
  const ignore = setupIgnoredFiles(babelEnv)

  return {
    presets,
    plugins,
    ignore
  }
}

function setupPresets (babelEnv) {
  return [
    'next/babel'
  ]
}

function setupPlugins (babelEnv) {
  if (babelEnv === 'production') {
    return [
      ['emotion', { 'hoist': true }]
    ]
  } else {
    return [
      ['emotion', { sourceMap: true, autoLabel: true }]
    ]
  }
}

function setupIgnoredFiles (babelEnv) {
  return [
    '**/*.test.js',
    '**/__mocks__/**'
  ]
}
