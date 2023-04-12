'use strict'

const { Controller } = require('egg')
const fs = require('fs')
const path = require('path')
const fsTools = require('../utils/fs')

const resumePath = path.resolve(__dirname, '../public/resume')
const getHashPath = hash => path.resolve(__dirname, `../public/resume/${hash}`)
class ChunksController extends Controller {
  async upload() {
    const { ctx } = this

    try {
      const { hash, type, index, fileName, id, chunkSize } = ctx.request.body

      const hashPath = getHashPath(hash)
      const chunkPath = path.resolve(__dirname, `../public/resume/${hash}/${id}`)

      const file = ctx.request.files[0]

      // 判断是否存在resume目录，如果没有则创建
      const exist = await fsTools.isExist(resumePath)
      if (!exist) {
        await fsTools.createDirectory(resumePath)
      }

      // 判断是否存在chunk的hash目录，如果没有则创建
      const hashExist = await fsTools.isExist(hashPath)
      if (!hashExist) {
        await fsTools.createDirectory(hashPath)
      }

      // 判断是否存在chunk文件
      const chunkExist = await fsTools.isExist(chunkPath)
      if (!chunkExist) {
        const reader = fs.createReadStream(file.filepath)
        const writer = fs.createWriteStream(chunkPath)
        reader.pipe(writer)

        ctx.status = 200
        ctx.body = 'hi, egg'
      } else {
        ctx.status = 200
        ctx.body = '已有切片'
      }

    } catch (error) {
      ctx.logger.error(error)
      ctx.status = 500
      ctx.body = error
    }
  }

  async validate() {
    try {
      const { hash, chunkSize } = ctx.request.body
    } catch (error) {
      ctx.logger.error(error)
      ctx.status = 500
      ctx.body = error
    }
  }

  async merge() {
    const { ctx } = this
    const { hash, fileName } = ctx.request.body
    const files = await fsTools.getFiles(hash, fileName)

    if(files.length) {
      await fsTools.merge(files, hash, fileName)
      ctx.status = 200
      ctx.body = 'success'
    } else {
      ctx.logger.error('合成失败')
      ctx.status = 500
      ctx.body = '合成失败'
    }
  }
}

module.exports = ChunksController
