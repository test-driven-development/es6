module.exports = function(api) {
  api.cache(true)

  const presets = ['@babel/env']
  const plugins = [
    '@babel/transform-runtime',
    '@babel/plugin-proposal-throw-expressions',
  ]
  return {
    presets,
    plugins,
  }
}
