'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app
  router.post('/', controller.home.index)
  router.post('/chunks/upload', controller.chunks.upload)
  router.post('/chunks/validate', controller.chunks.validate)
  router.post('/chunks/merge', controller.chunks.merge)
}
