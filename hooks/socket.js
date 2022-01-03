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

        function sayAnswer (answer, noSpeak) {
          var synthesizer = new speech.SpeechSynthesizer(speechConfig);
          socket.emit('answer', answer)
          if (noSpeak) return;
          socket.emit('is-typing', true)
          synthesizer.speakTextAsync(
            answer,
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
        }

        ;(async () => {
          const response = await nlp.process('en', 'riddle');
          sayAnswer(response.answer, true)
        })();

        // Listen for new query
        socket.on('query', function (data) {
          ;(async () => {
            const response = await nlp.process('en', data.value);
            if (response.intent === 'None') {
              response.answer = 'Sorry, I could not understand that. Try asking about the riddle.'
            }
            sayAnswer(response.answer)
          })();
        })

        socket.on('recognize', function (data) {
          var recognizer = new speech.SpeechRecognizer(speechConfig);
          var pushStream = sdk.AudioInputStream.createPushStream();
          recognizer.recognizeOnceAsync(result => {
            //
          });
        })
      })
    })
    setImmediate(cb)
  }
}