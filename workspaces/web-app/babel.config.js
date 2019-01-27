module.exports = function (api) {
  const babelEnv = api.env()
  api.cache(true)

  console.log('babelEnv=', babelEnv)

  const presets = setupPresets(babelEnv)

  return {
    presets
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
