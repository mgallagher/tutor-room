const express = require('express')
const { postgraphql } = require('postgraphql')

const app = express()

app.use(
  postgraphql('postgres://postgres:@localhost:5432/postgres', 'tutor_room', {
    graphiql: true,
    watchPg: true,
    disableDefaultMutations: true
  })
)

app.listen(3000)