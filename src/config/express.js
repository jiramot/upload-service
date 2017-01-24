'use strict'

import bodyParser from 'body-parser'
import logger from '~/config/logger'
import timeout from 'connect-timeout'

module.exports = function (app) {
  logger.info('load express config')
  app.use(timeout('36000s'))
  app.disable('x-powered-by')
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  app.use(haltOnTimedout)
}

let haltOnTimedout = (req, res, next) => {
  if (!req.timedout) {
    next()
  }
}
