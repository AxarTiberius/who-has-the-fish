module.exports = function container (get, set) {
  return function handler (req, res, next) {
    //console.log('handler', req.url)
    // Allow only a specific client to request to the API (depending of the env)
    if (process.env.WHTF_NODE_ENV !== 'production') {
      res.header(
        'Access-Control-Allow-Origin',
        `${process.env.WHTF_HOST}:3000`
      )
    }
    // Allow several headers for our requests
    /*
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    */

    //res.header('Access-Control-Allow-Credentials', true)
    next()
  }
}
