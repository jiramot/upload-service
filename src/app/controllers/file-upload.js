'use strict'

import logger from '~/config/logger'
import config from '~/config/config'
import * as util from '~/app/utils/util'

export const upload = async (req, res, next) => {

  try {
    let file = await uploadPromise(req, res)
    let filePath
    if (util.supportImageFormat(file)) {
      let size = req.body.size
      filePath = await util.centerCropImage(file, size)
    } else {
      filePath = file.path.replace(config.upload.path, '/')
    }

    let result = {success: true, path: filePath}
    logger.debug('result: ' + JSON.stringify(result))
    res.json(result)
  } catch (err) {
    let result = {success: false, error: err}
    logger.debug('result: ' + JSON.stringify(result))
    res.status(300).send(result)
  }
}

let uploadPromise = async (req, res) => {
  await util.upload(req, res)
  if (req.file) {
    return req.file
  } else {
    throw new Error('File upload not found')
  }
}
