const { Router } = require('express')

const TagsController = require('../controllers/TagsController')

const tagsRoutes = Router()

function myMiddleware(request, response, next) {
  console.log('você passou pelo Middleware')
  next()
}

const tagsController = new TagsController()

tagsRoutes.get('/:user_id', myMiddleware, tagsController.index)

module.exports = tagsRoutes
