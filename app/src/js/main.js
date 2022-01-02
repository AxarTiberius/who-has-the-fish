import request from 'superagent'

import Loader from './loader'
import Client from './client'
import Recorder from './recorder'
import listener from './listener'
import { onkeydowndocument, onkeydowninput } from './onkeydown'

const config = {
  app: 'webapp',
  server_host: import.meta.env.VITE_WHTF_HOST,
  server_port: import.meta.env.VITE_WHTF_PORT,
  min_decibels: -40, // Noise detection sensitivity
  max_blank_time: 1000 // Maximum time to consider a blank (ms)
}
const serverUrl = import.meta.env.VITE_WHTF_NODE_ENV === 'production' ? '' : `${config.server_host}:${config.server_port}`

document.body.classList.add('settingup')

document.addEventListener('DOMContentLoaded', () => {
  const loader = new Loader()

  loader.start()

  request.get(`${serverUrl}/info`)
    .end((err, res) => {
      if (err || !res.ok) {
        console.error(err)
      } else {
        const input = document.querySelector('#query')
        const mic = document.querySelector('button')
        
        const client = new Client(config.app, serverUrl, input, res.body)
        let rec = { enabled: false }

        client.init()

        annyang.addCallback('resultNoMatch', function (phrases) {
          client.socket.emit('query', { client: config.app, value: phrases[0]})
          client.chatbot.sendTo('WHTF', phrases[0])
        })
        annyang.start()

        loader.stop()

        document.addEventListener('keydown', (e) => {
          onkeydowndocument(e, () => {
            if (rec.enabled === false) {
              input.value = ''
              //rec.start()
              rec.enabled = true
            } else {
              //rec.stop()
              rec.enabled = false
            }
          })
        })

        input.addEventListener('keydown', (e) => {
          onkeydowninput(e, client)
        })

        mic.addEventListener('click', (e) => {
          e.preventDefault()

          if (rec.enabled === false) {
            //rec.start()
            rec.enabled = true
          } else {
            //rec.stop()
            rec.enabled = false
          }
        })
      }
    })
})
