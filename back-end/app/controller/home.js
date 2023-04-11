'use strict';

const { Controller } = require('egg');

class HomeController extends Controller {

  async index() {
    const { ctx } = this;
      
    ctx.status = 200
    ctx.body = 'hi, egg';
  }
}

module.exports = HomeController;
