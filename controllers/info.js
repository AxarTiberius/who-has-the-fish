module.exports = function container (get, set) {
  var version = require('../package.json').version
  return get('controller')()
    .get('/info', function (req, res, next) {
      res.json({
        success: true,
        status: 200,
        code: 'info_pulled',
        message: 'Info pulled',
        after_speech: process.env.WHTF_AFTER_SPEECH === 'true',
        logger: process.env.WHTF_LOGGER === 'true',
        stt: {
          enabled: process.env.WHTF_STT === 'true',
          provider: process.env.WHTF_STT_PROVIDER
        },
        tts: {
          enabled: process.env.WHTF_TTS === 'true',
          provider: process.env.WHTF_TTS_PROVIDER
        },
        lang: {
          "short": "en",
          "min_confidence": 0.5,
          "fallbacks": [
          ]
        },
        version: version,
        phrases: require('../data/phrases.json')
      })
    })
}