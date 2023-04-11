'use strict';

const { Controller } = require('egg');
const fs = require('fs/promises');

class ChunksController extends Controller {

  async upload() {
    const { ctx } = this;
    console.log(ctx.request.body)
    console.log(ctx.request.files)
    
    ctx.status = 200
    ctx.body = 'hi, egg';
  }
}

module.exports = ChunksController;
