'use strict'

const { Controller } = require('egg')
const fs = require('fs')
const path = require('path')
const fsTools = require('../utils/fs')

class ChunksController extends Controller {
  async upload() {
    const { ctx } = this

    try {
      const { hash, type, index, fileName, id, chunkSize } = ctx.request.body
      const file = ctx.request.files[0]
      

      // 判断是否存在chunk文件
      const chunkExist = await fsTools.isExist(fsTools.getChunkPath(hash, id))
      if (!chunkExist) {
        const reader = fs.createReadStream(file.filepath)
        const writer = fs.createWriteStream(fsTools.getChunkPath(hash, id))
        reader.pipe(writer)

        ctx.status = 200
        ctx.body = {
          msg: '上传成功'
        }
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
    const { ctx } = this

    try {
      const { hash } = ctx.request.body
      const hashPath = fsTools.getHashPath(hash)
      const chunksPath = fsTools.getChunksPath(hash)

      // 判断是否存在hash目录，如果没有则创建
      const hashExist = await fsTools.isExist(hashPath)
      if (!hashExist) {
        await fsTools.createDirectory(hashPath)
      }

      // 判断是否存在chunks目录，没有则创建
      const chunksExist = await fsTools.isExist(chunksPath)
      if (!chunksExist) {
        await fsTools.createDirectory(chunksPath)
      }
      
      // 判断是否存在合并后的文件
      const fileExist = await fsTools.isExistMergeFile(path.resolve(__dirname, `../public/${hash}`))
      
      if(!fileExist) {
        const files = fs.readdirSync(chunksPath)
        if(files && files.length) {
          ctx.body = {
            data: {
              status: '2',
              files
            },
            msg: `已存在切片，但不存在文件`,
            code: 200
          }
        } else {
          ctx.body = {
            data: {
              status: '0'
            },
            msg: `不存在文件,也没有切片`,
            code: 200
          }
        }
      } else {
        ctx.body = {
          data: {
            status: '1'
          },
          msg: `已存在文件`,
          code: 200
        }
      }
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
      ctx.body = {
        code: 200,
        msg: '合并成功',
        data: 'success'
      }
    } else {
      ctx.body = {
        code: 400,
        msg: '合成失败',
        data: 'fail'
      }
    }
  }
}

module.exports = ChunksController
