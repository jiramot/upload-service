'use strict'

import * as upload from '~/app/controllers/file-upload'
import healthCheck from 'api-health-check'

module.exports = function (app) {
  app.post('/', upload.upload)
  app.use('/healthcheck', healthCheck())
}
