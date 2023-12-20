require('express-async-errors')
require('dotenv/config')
const migrationsRun = require('./database/sqlite/migrations')
const express = require('express')
const AppError = require('./utils/AppError')
const uploadConfig = require('./configs/upload')
const cors = require('cors')

const routes = require('./routes')
migrationsRun()

// Criando uma instância do aplicativo Express
const app = express()
app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.UPLOAD_FOLDER))

app.use(routes)

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }
  console.error(error)
  return response.status(500).json({
    status: 'error',
    message: 'internal server error'
  })
})
// Definindo a porta em que o servidor irá escutar
const PORT = process.env.PORT || 3333

// Iniciando o servidor para escutar a porta especificada
app.listen(PORT, () => console.log(`Server is running on Port Jordan ${PORT}`))
// jordan
