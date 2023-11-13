const { Router } = require('express')

const UserController = require('../controllers/UsersController')

const usersRoutes = Router()

function myMiddleware(request, response, next) {
  console.log('você passou pelo Middleware')
  next()
}

const userController = new UserController()

usersRoutes.post('/', myMiddleware, userController.create)
usersRoutes.put('/:id', myMiddleware, userController.update)

module.exports = usersRoutes
