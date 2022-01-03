const dotenv = require('dotenv')
dotenv.config()

// Map necessary WHTF's env vars as Vite only expose VITE_*
process.env.VITE_WHTF_NODE_ENV = process.env.WHTF_NODE_ENV
process.env.VITE_WHTF_HOST = process.env.WHTF_HOST
process.env.VITE_WHTF_PORT = process.env.WHTF_PORT

module.exports = {
  root: 'app/src',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
}
