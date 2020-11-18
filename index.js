const mainConfig = require('./mainConfig')
const express = require('express')
const app = express()
const port = mainConfig.port

app.get('/health', (req, res) => {
  res.send({
    result : true,
    data : 'Healthy Server!'
  })
})

app.get('/listEmployees', (req, res) => {
  let output = []
  res.send({
    result : true,
    data : output
  })
})

app.listen(port, () => {
  console.log(`Employees app listening at http://localhost:${port}`)
})
