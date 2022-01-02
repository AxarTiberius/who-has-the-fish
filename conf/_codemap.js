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
  'azure_key': 'c6053025afc948b79013321570e8ada4',
  'azure_location': 'westus',
  'azure_endpoint': 'https://westus.api.cognitive.microsoft.com/sts/v1.0/issuetoken'
}