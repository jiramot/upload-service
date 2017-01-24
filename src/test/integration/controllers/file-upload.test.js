/* eslint-env mocha */

'use strict'

import fs from 'fs'
import request from 'supertest'
import { expect } from 'chai'
import config from '~/config/config'
import app from '~/app'
import rimraf from 'rimraf'
const gm = require('gm').subClass({imageMagick: true})

const expectHttpOk = 200

describe('Upload API', function () {
  before(function (done) {
    fs.mkdir(config.upload.path, function () {
      done()
    })
  })

  after(function (done) {
    rimraf(config.upload.path, done)
  })

  it('should upload mp3 file success', function (done) {
    const expectFilePathMatcher = new RegExp(`^/${config.upload.otherPath}.*.mp3$`)

    request(app)
      .post('/')
      .attach('fileUpload', 'test/fixtures/sample.mp3')
      .expect(expectHttpOk)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body.success).to.be.true
        expect(res.body.path).to.match(expectFilePathMatcher)
        done()
      })
  }).timeout(10000)

  it('should upload jpeg file success with out crop', function (done) {
    let expectFilePathMatcher = new RegExp(`^/${config.upload.imagePath}.*.jpg$`)

    request(app)
      .post('/')
      .attach('fileUpload', 'test/fixtures/sample.jpg')
      .expect(expectHttpOk)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body.success).to.be.true
        expect(res.body.path).to.match(expectFilePathMatcher)
        expectImageSize(res.body.path, 1000, 672, done)
      })
  })

  it('should upload png file success with crop 1440x300', function (done) {
    let expectFilePathMatcher = new RegExp(`^/${config.upload.imagePath}.*.png`)

    request(app)
      .post('/')
      .field('size', '1440x300')
      .attach('fileUpload', 'test/fixtures/pnggrad16rgb.png')
      .expect(expectHttpOk)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body.success).to.be.true
        expect(res.body.path).to.match(expectFilePathMatcher)
        expectImageSize(res.body.path, 1440, 300, done)
      })
  })

  it('should upload jpeg file success with crop 1440x300', function (done) {
    request(app)
      .post('/')
      .field('size', '1440x300')
      .attach('fileUpload', 'test/fixtures/sample.jpg')
      .expect(expectHttpOk)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body.success).to.be.true
        expect(res.body.path).to.match(/.*.jpg/)
        expectImageSize(res.body.path, 1440, 300, done)
      })
  })

  it('should upload other file success', function (done) {
    let expectFilePathMatcher = new RegExp(`^/${config.upload.otherPath}.*.txt`)

    request(app)
      .post('/')
      .attach('fileUpload', 'test/fixtures/sample.txt')
      .expect(expectHttpOk)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body.success).to.be.true
        expect(res.body.path).to.match(expectFilePathMatcher)
        done()
      })
  })

  it('should fail upload with out file', function (done) {
    request(app)
      .post('/')
      .expect(300)
      .end((err, res) => {
        if (err) done(err)
        expect(res.body.success).to.be.false
        expect(res.body.error).to.not.equal(null)
        done()
      })
  })

  it('should return 404 on get', function (done) {
    request(app)
      .get('/')
      .expect(404)
      .end((err, res) => {
        if (err) done(err)
        done()
      })
  })
})

let expectImageSize = function (imagePath, width, height, done) {
  gm(`${config.upload.path}/${imagePath}`)
  .size((err, size) => {
    if (err) done(err)
    expect(size.width).to.equal(width)
    expect(size.height).to.equal(height)
    done()
  })
}
