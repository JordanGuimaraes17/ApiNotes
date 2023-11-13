require('express-async-errors')
const migrationsRun = require('./database/sqlite/migrations')
const express = require('express')
const AppError = require('./utils/AppError')

const routes = require('./routes')
migrationsRun()

// Criando uma instância do aplicativo Express
const app = express()
app.use(express.json())

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
const PORT = 3333

// Iniciando o servidor para escutar a porta especificada
app.listen(PORT, () => console.log(`Server is running on Port Jordan ${PORT}`))

//
/*
// Configurando uma rota para o método GET com parâmetros na URL
app.get('/message/:id/:users', (request, response) => {
  // Extraindo os parâmetros da URL usando desestruturação
  const { id, users } = request.params

  // Enviando uma resposta ao cliente com uma mensagem interpolada
  response.send(`
      Mensagem ID ${id}.
      Para o usuário ${users}. 
     `)
})
// Configurando uma rota para o método GET com a rota '/users'
app.get('/users', (request, response) => {
  // Extraindo os parâmetros de consulta (query parameters) da solicitação
  const { Page, limit } = request.query

  // Enviando uma resposta ao cliente com uma mensagem interpolada
  response.send(`
      Página ${Page}. Mostrar : ${limit}. 
     `)
})
/*request.params: Use request.params quando desejar capturar parâmetros de rota (partes variáveis na URL) em rotas definidas, como IDs em URLs amigáveis para o usuário. Por exemplo, /users/:id capturaria um ID específico da URL.

request.query: Use request.query quando desejar acessar os parâmetros de consulta (query parameters) de uma URL. Isso é útil para opções flexíveis em consultas GET, como ordenação, filtragem ou paginação. Por exemplo, ?page=2&limit=10 capturaria os valores de page e limit da URL.

Lembre-se de que ambos os métodos são formas de passar dados para o servidor em uma solicitação HTTP, mas são usados em contextos diferentes dependendo das necessidades da sua aplicação.*/
