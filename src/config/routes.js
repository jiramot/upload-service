'use strict'

import * as upload from '~/app/controllers/file-upload'
import healthCheck from 'api-health-check'
import cors from 'cors'

module.exports = function (app) {
  app.use(cors())

  app.post('/', upload.upload)
  app.use('/healthcheck', healthCheck())
}
