import fs from 'fs'
import path from 'path'
import { AddressInfo } from 'net'
import WebSocket from 'ws'
import express, { Express, Request, Response } from 'express'
import ChildProcess from 'child_process'
import morgan from 'morgan'
import { Logger } from './logger'
import { Network } from './network'

const generateHost = (protoc: string, host: string, port: number) => `${protoc}://${host}:${port}`
const wsockets = new Map<string, WebSocket>()

const app: Express = express()
const wsServer = new WebSocket.Server({
  noServer: true
})
const network: Network = Network.getInstance()
const logger: Logger = Logger.getInstance({
  timestamp: true,
  color: true,
  multiline: true,
  showHidden: false,
  depth: true
})

const publicDir: { dir: string, watch: boolean }[] = [
  {
    dir: 'public',
    watch: true
  },
  {
    dir: 'assets',
    watch: false
  }
]

publicDir.forEach(dirOpts => {
  const {
    dir,
    watch
  } = dirOpts
  if (watch) {
    fs.readdir(path.resolve(dir), (err, files: string[]) => {
      if (err) {
        logger.error(err.message, err, 'fs.readdir')
      } else {
        files.forEach(file => {
          fs.watchFile(path.resolve(dir + '/' + file), { interval: 100 }, () => {
            wsockets.forEach((socket, wsKey) => {
              const readyState: number = socket.readyState
              if (readyState === WebSocket.OPEN) {
                socket?.send(wsKey, (err?: Error) =>
                  err ? logger.error(err?.message ?? '', err as Error, 'socket.send') : undefined)
              } else if (readyState === WebSocket.CLOSED) {
                wsockets.delete(wsKey)
              }
            })
          })
        })
      }
    })
  }
  app.use(express.static(dir))
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan(
  (tokens, req, res) => {
    const statusCode = tokens.status(req, res) ? `${tokens.status(req, res)} ${res.statusMessage}` : '--'
    const contentLength = tokens.res(req, res, 'content-length') ? `${tokens.res(req, res, 'content-length')} B` : '--'
    const responseTime = tokens['response-time'](req, res) ? `${tokens['response-time'](req, res)} ms` : '--'
    logger.info(
      `Status: ${statusCode} - Time: ${responseTime} - Size: ${contentLength}`,
      `${tokens.method(req, res)} ${tokens.url(req, res)}`
    )
    return null
  },
  {
    skip: req => req.path === '/favicon.ico'
  }
))
app.all('/submit', (req: Request, res: Response) => {
  res.status(201).json({
    message: 'Received',
    body: req.body,
    query: req.query
  })
})

app.get('/get_links', (req, res) => {
  setTimeout(() => {
    res.send('./assets/db.txt')
  }, 3000)
})

const server = app.listen(parseInt(process?.env?.SERVER_PORT ?? '80'))

server.on('listening', () => {
  const addr = server.address() as AddressInfo
  const localhost: string = generateHost('http', addr.address, addr.port)
  logger.info(localhost, 'Localhost')
  logger.info(generateHost('http', network.lan, addr.port), 'LAN')
  const start = (process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open')
  ChildProcess.exec(start + ' ' + localhost)
})
server.on('error', (err: Error) => logger.error(err.message, err, 'Server error'))
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket, req) => {
    const wsKey: string = req.headers['sec-websocket-key'] ?? ''
    wsockets.set(wsKey, socket)
  })
})
wsServer.on('error', (err: Error) => logger.error(err.message, err, 'Websocket error'))
logger.warn('Press CTRL+C to stop')