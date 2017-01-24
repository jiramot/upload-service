'use strict'

import config from '~/config/config'
import logger from '~/config/logger'
import fs from 'fs-promise'

module.exports = function (app) {
  createUploadFolder()
}

let createUploadFolder = async function () {
  logger.info('init upload folder')
  let baseUploadPath = config.upload.path
  let imagePath = baseUploadPath.concat(config.upload.imagePath)
  let otherPath = baseUploadPath.concat(config.upload.otherPath)

  try {
    await fs.mkdir(baseUploadPath)
    await Promise.all([fs.mkdir(imagePath), fs.mkdir(otherPath)])
  } catch (err) {
    logger.debug(err)
  }
}
