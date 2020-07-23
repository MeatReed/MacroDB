import express from 'express'
import mysql from 'mysql2/promise'
import rateLimit from 'express-rate-limit'
require('dotenv').config()

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
})

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})

const router = express.Router()
const app = express()
router.use((req, res, next) => {
  Object.setPrototypeOf(req, app.request)
  Object.setPrototypeOf(res, app.response)
  req.res = res
  res.req = req
  req.mysql = connection
  next()
})

const api = require('./controllers/api')
const apps = require('./controllers/apps')
const auth = require('./controllers/auth')

router.use(apps, api, auth)
router.use(apiLimiter)

export default {
  path: '/api',
  handler: router,
}
