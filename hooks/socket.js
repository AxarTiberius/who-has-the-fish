const socketio = require('socket.io')
const ss = require('socket.io-stream')
const speech = require('microsoft-cognitiveservices-speech-sdk');
const containerBootstrap = require('@nlpjs/core-loader').containerBootstrap
const Nlp = require('@nlpjs/nlp').Nlp

module.exports = function container (get, set) {
  var speechConfig = speech.SpeechConfig.fromSubscription(get('conf.azure_key'), get('conf.azure_location'));
  speechConfig.speechSynthesisLanguage = "en-US";
  speechConfig.speechSynthesisVoiceName = "en-AU-NatashaNeural";
  // Default: Riff16Khz16BitMonoPcm
  speechConfig.speechSynthesisOutputFormat = speech.SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3

  return function task (cb) {
    var nlp;
    ;(new Promise(async (resolve, reject) => {
      try {
        const container = await containerBootstrap()
        nlp = new Nlp({ container })
        await nlp.load('data/model.nlp')
        resolve()
      } catch (err) {
        //reject({ type: 'error', obj: err })
        throw err
      }
    }));

    var srv = get('site.server')
    var io = process.env.WHTF_NODE_ENV === 'development'
      ? socketio(srv, { cors: { origin: `${process.env.WHTF_HOST}:3000` } })
      : socketio(srv)
    io.on('connection', function (socket) {
      socket.on('init', function (data) {
        //log.info(`Type: ${data}`)
        //log.info(`Socket id: ${socket.id}`)

        // Listen for new query
        socket.on('query', function (data) {
          //log.title('Socket')
          //log.info(`${data.client} emitted: ${data.value}`)
          var synthesizer = new speech.SpeechSynthesizer(speechConfig);
          socket.emit('is-typing', true)

          ;(async () => {
            const response = await nlp.process('en', data.value);
            socket.emit('answer', response.answer)
            synthesizer.speakTextAsync(
              response.answer,
              function (result) {
                if (result) {
                  synthesizer.close()
                  var audioData = result.audioData
                  socket.emit('audio-forwarded', {buffer: Buffer.from(audioData)})
                }
                socket.emit('is-typing', false)
              },
              function (error) {
                console.log(error);
                socket.emit('is-typing', false)
                synthesizer.close();
              }
            );
          })();

          

          //log.info(`value: ${data.value}`)
        })
      })
    })
    setImmediate(cb)
  }
}