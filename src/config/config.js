'use strict'

import path from 'path'
import { _extend as extend } from 'util'

import development from '~/config/env/development'
import test from '~/config/env/test'
import production from '~/config/env/production'
import staging from '~/config/env/staging'
import docker from '~/config/env/docker'

const defaults = {
  root: path.join(__dirname, '..')
}

module.exports = {
  development: extend(development, defaults),
  test: extend(test, defaults),
  production: extend(production, defaults),
  staging: extend(staging, defaults),
  docker: extend(docker, defaults)
}[process.env.NODE_ENV || 'development']
