'use strict'

import config from '~/config/config'
import logger from '~/config/logger'
import mkdirp from 'mkdirp'
import moment from 'moment'
import multer from 'multer'
import path from 'path'
import uuid from 'uuid'
import pify from 'pify'
import { exec } from 'child-process-promise'

const UPLOAD_FOLDER = config.upload.path
const MAX_FILE_SIZE = 150 * 1000 * 1000

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    logger.debug('on destination')
    let folder = UPLOAD_FOLDER
    if (supportImageFormat(file)) {
      folder = folder.concat(config.upload.imagePath)
    } else {
      folder = folder.concat(config.upload.otherPath)
    }
    folder = folder.concat('/').concat(moment().format('YYYY/MM/DD'))
    mkdirp(folder, (err) => {
      cb(err, folder)
    })
  },
  filename: function (req, file, cb) {
    logger.debug('on filename')
    cb(null, uuid.v4() + path.extname(file.originalname))
  }
})

let fileFilter = function (req, file, cb) {
  return cb(null, true) //supportAllFileFormat()
}

export const upload = pify(multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE
  }
}).single('fileUpload'))

export const centerCropImage = async (file, size) => {
  let extname = path.extname(file.path)
  let filename = path.basename(file.path, extname)
  let directory = path.dirname(file.path)
  if (size) {
    let width = parseInt(size.split(/[x|X]/)[0])
    let height = parseInt(size.split(/[x|X]/)[1])
    let command = `convert ${directory}/${filename}${extname} -resize ${width}x${height}^ -gravity Center -crop ${width}x${height}+0+0 +repage ${directory}/${filename}.${width}x${height}${extname}`
    const result = await exec(command)
    let fullPath = `${directory}/${filename}.${width}x${height}${extname}`
    return fullPath.replace(config.upload.path, '/')
  } else {
    let fullPath = `${directory}/${filename}${extname}`
    return fullPath.replace(config.upload.path, '/')
  }
}

export const supportImageFormat = (file) => {
  let isSupport = false
  if(file.mimetype.match('image\/(png|jpeg)')){
    isSupport = true
  }
  return isSupport
}
