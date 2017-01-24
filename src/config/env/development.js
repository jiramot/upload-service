'use strict'

import fs from 'fs'
import path from 'path'

const envFile = path.join(__dirname, 'env.json')

let env = {}

if (fs.existsSync(envFile)) {
  env = fs.readFileSync(envFile, 'utf-8')
  env = JSON.parse(env)
  Object.keys(env).forEach(key => process.env[key] = env[key])
}

module.exports = {
  logger: {
    level: 'debug'
  },
  upload: {
    path: `${process.cwd()}/upload/`,
    imagePath: 'images',
    otherPath: 'others'
  }
}
