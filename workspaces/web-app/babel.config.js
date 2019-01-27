module.exports = function (api) {
  const babelEnv = api.env()
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
  const emotion = babelEnv === 'production'
    ? { 'hoist': true }
    : { sourceMap: true, autoLabel: true }
  return [
    [
      'next/babel', {
        'preset-env': { modules: false }
      }
    ],
    [
      '@emotion/babel-preset-css-prop',
      emotion
    ]
  ]
}

function setupPlugins (babelEnv) {
  // if (babelEnv === 'production') {
  //   return [
  //     ['emotion', { 'hoist': true }]
  //   ]
  // } else {
  //   return [
  //     ['emotion', { sourceMap: true, autoLabel: true }]
  //   ]
  // }
}

function setupIgnoredFiles (babelEnv) {
  return [
    '**/*.test.js',
    '**/__mocks__/**'
  ]
}
