'use strict';

const { Controller } = require('egg');
const fs = require('fs/promises');
const path = require('path');
const fsTools = require('../utils/fs')

class ChunksController extends Controller {

  async upload() {
    const { ctx } = this;
    try {
      const { hash, type, index, fileName, id, chunkSize } = ctx.request.body

      const resumePath = path.resolve(__dirname, '../../resume')
      const hashPath = path.resolve(__dirname, `../../resume/${hash}`)
      const chunkPath = path.resolve(__dirname, `../../resume/${hash}/${id}`)

      // console.log(ctx.request.body)
      const file = ctx.request.files[0]
  
      // 判断是否存在resume目录，如果没有则创建
      const exist = await fsTools.isExist(resumePath)
      if(!exist) {
        await fsTools.createDirectory(resumePath)
      }
  
      // 判断是否存在chunk的hash目录，如果没有则创建
      const hashExist = await fsTools.isExist(hashPath)
      if(!hashExist) {
        await fsTools.createDirectory(hashPath)
      }
      
      // 判断是否存在chunk文件
      const chunkExist = await fsTools.isExist(chunkPath)
      if(!chunkExist) {
        // await fsTools.createFile(chunkPath, Buffer.from(file))
      }
      
      ctx.status = 200
      ctx.body = 'hi, egg';
    } catch (error) {
      ctx.logger.error(error)
      ctx.status = 500
      ctx.body = error
    }
  }
}

module.exports = ChunksController;
