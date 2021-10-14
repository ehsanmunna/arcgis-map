const express = require('express')
const app = express()
const port = 3000

const cors = require('cors');
app.use(cors());
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/src/index.html')
})
app.get('/graphic', (req, res) => {
  res.sendFile(__dirname + '/src/graphic.html')
})
app.get('/graphicv3', (req, res) => {
  res.sendFile(__dirname + '/src/graphicv3.html')
})

app.get('/graphicjsv2', (req, res) => {
  res.sendFile(__dirname + '/src/js/graphicv2.js')
})
app.get('/basicjs', (req, res) => {
    res.sendFile(__dirname + '/src/js/basicscript.js')
  })
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
//   })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})