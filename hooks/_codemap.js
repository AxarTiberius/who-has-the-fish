module.exports = {
  // meta
  _ns: 'motley',
  _folder: 'hooks',

  // core hook registration
  'boot[]': function container (get, set) {
    return function task (cb) {
      // respond to the boot hook
      setImmediate(cb)
    }
  },
  'mount[]': require('./socket'),
  'listen[]': function container (get, set) {
    return function task (cb) {
      if (get('site.server').listening) {
        get('console').log('listening on http://' + process.env.WHTF_HOST + ':' + process.env.WHTF_PORT + '/')
      }
      setImmediate(cb)
    }
  },
  'close[1]': function container (get, set) {
    return function task (cb) {
      get('console').log('\n\nWHTF says goodbye :)\n')
      setImmediate(cb)
    }
  }
}