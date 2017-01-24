'use strict'

import fs from 'fs'
import { path, join } from 'path'
import express from 'express'
import config from '~/config/config'
import logger from '~/config/logger'
import routes from '~/config/routes'
import expressCofig from '~/config/express'
import bootstrap from '~/config/bootstrap'

const models = join(__dirname, 'app/models')
const port = process.env.PORT || 3000
const app = express()

logger.level = config.logger.level || 'debug'

module.exports = app

// Bootstrap models
fs.readdirSync(models)
  .filter(file => ~file.indexOf('.js'))
  .forEach(file => require(join(models, file)))

// Bootstrap configs
routes(app)
expressCofig(app)
bootstrap(app)

app.listen(port)
logger.info('Express app started on port ' + port)
