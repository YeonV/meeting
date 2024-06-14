require('dotenv').config()

const { ExpressPeerServer } = require('peer')
const express = require('express')
const cors = require('cors')

const http = require('http')

const app = express()

const server = http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello world!')
})

app.use(express.static('public'))

const peerServer = ExpressPeerServer(server, {
  debug: true,
  allow_discovery: true
})

app.use('/myapp', peerServer)

server.listen(process.env.PEERJS_PORT, () => {
  console.log(`PeerJS server running on port ${process.env.PEERJS_PORT}`)
})
