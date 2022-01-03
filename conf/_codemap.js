module.exports = {
  // meta
  _ns: 'motley',
  _folder: 'conf',

  // site overrides
  '@site.port': process.env.WHTF_PORT,
  '@site.title': 'Who has the fish?',

  'middleware.buffet{}': {
    watch: true
  },
  'middleware.buffet.root{}': {
    globs: 'app/dist/**/*'
  },

  // Microsoft Azure stuff
  'azure_key': process.env.WHTF_AZURE_KEY,
  'azure_location': process.env.WHTF_AZURE_LOCATION,
  'azure_endpoint': process.env.WHTF_AZURE_ENDPOINT
}