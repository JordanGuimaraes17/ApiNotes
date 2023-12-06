const { hash, compare } = require('bcryptjs')
const AppError = require('../utils/AppError')
const sqliteConnection = require('../database/sqlite')
class UserController {
  async create(request, response) {
    const { name, email, password } = request.body
    const dataBase = await sqliteConnection()
    const checkUsersExist = await dataBase.get(
      'SELECT * FROM users WHERE email =(?)',
      [email]
    )
    if (checkUsersExist) {
      throw new AppError('Este e-email já está em uso.')
    }
    const hashedPassword = await hash(password, 8)

    await dataBase.run(
      'INSERT INTO users (name, email,password) VALUES (?,?,?)',
      [name, email, hashedPassword]
    )
    return response.status(201).json()
  }
  async update(request, response) {
    const { name, email, password, old_password } = request.body
    const user_id = request.user.id
    const database = await sqliteConnection()
    const user = await database.get('SELECT * FROM users WHERE id =(?)', [
      user_id
    ])
    if (!user) {
      throw new AppError('Usuário não econtrado')
    }
    const userWithUpdatedEmail = await database.get(
      'SELECT * FROM users WHERE email = (?)',
      [email]
    )
    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
      throw new AppError('Este e-mail já está em uso.')
    }
    user.name = name ?? user.name
    user.email = email ?? user.email

    if (!old_password || !password) {
      throw new AppError(
        'Você precisa informar tanto a senha antiga quanto a nova senha para atualizar.'
      )
    }
    if (password && old_password) {
      const checkOldPassword = await compare(old_password, user.password)
      if (!checkOldPassword) {
        throw new AppError('A senha não confere.')
      }
      user.password = await hash(password, 8)
    }
    await database.run(
      `UPDATE users SET
      name = ?,
      email = ?,
      password = ?,
      updated_at = DATETIME('now')
      WHERE id = ?`,
      [user.name, user.email, user.password, user_id]
    )
    return response.json()
  }
}

module.exports = UserController
