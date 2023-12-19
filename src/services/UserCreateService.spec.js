const UserRepositoryMemory = require('../repositories/UserRepositoryMemory')
const UserCreateService = require('./UserCreateService')
it('user should be create', async () => {
  const user = {
    name: 'User Test',
    email: 'user@test.com',
    password: '123'
  }
  const userRepositoryMemory = new UserRepositoryMemory()
  const userCreateService = new UserCreateService(userRepositoryMemory)
  const userCreated = await userCreateService.execute(user)

  expect(userCreated).toHaveProperty('id')
})
