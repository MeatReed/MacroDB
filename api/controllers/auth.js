import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import bcrypt from 'bcrypt'

const router = Router()

router.post('/register', async function (req, res, next) {
  if (req.body) {
    const email = req.body.email
    const password = req.body.password

    if (email && password) {
      const dbUser = await req.mysql.query(
        'SELECT * FROM users WHERE email = ?',
        [email]
      )
      if (!dbUser[0][0]) {
        bcrypt.hash(password, 10, async function (err, encryptPassword) {
          if (err)
            return res.status(400).json({
              error: 'An error has occurred',
            })
          const newUser = {
            token: uuidv4(),
            role: 1,
            email,
            password_encrypt: encryptPassword,
          }
          const tokenJwt = jwt.sign(
            {
              token: newUser.token,
              role: newUser.role,
              email,
              password_encrypt: newUser.password_encrypt,
            },
            process.env.SECRET
          )
          const newUserDb = await req.mysql.query('INSERT INTO users SET ?', {
            token: newUser.token,
            role: newUser.role,
            email,
            password_encrypt: newUser.password_encrypt,
          })
          const token = {
            tokenSession: tokenJwt,
            tokenAccount: newUser.token,
          }
          req.session.user = {
            token,
            id: newUserDb[0].insertId,
            role: newUser.role,
            email,
          }
          return res.json({
            token,
            id: newUserDb[0].insertId,
            role: newUser.role,
            email,
          })
        })
      } else {
        return res.status(400).json({
          error: 'The already existing email',
        })
      }
    } else {
      return res.status(400).json({
        error: 'One value is missing',
      })
    }
  } else {
    return res.status(400).json({
      error: 'No value has been entered',
    })
  }
})

router.post('/login', async (req, res) => {
  if (req.body.token) {
    const account = await req.mysql.query(
      'SELECT token,id,role,email,password_encrypt FROM users WHERE token = ?',
      [req.body.token]
    )
    if (account[0][0]) {
      const user = {
        token: account[0][0].token,
        id: account[0][0].id,
        role: account[0][0].role,
        email: account[0][0].email,
        password_encrypt: account[0][0].password_encrypt,
      }
      const tokenJwt = jwt.sign(user, process.env.SECRET)
      const token = {
        tokenSession: tokenJwt,
        tokenAccount: user.token,
      }
      req.session.user = {
        token,
        id: user.id,
        role: user.role,
        email: user.email,
      }
      return res.json({
        token,
        id: user.id,
        role: user.role,
        email: user.email,
      })
    } else {
      return res.status(400).json({
        error: 'Account not found',
      })
    }
  } else {
    const email = req.body.email
    const password = req.body.password
    if (email && password) {
      const account = await req.mysql.query(
        'SELECT token,id,role,email,password_encrypt FROM users WHERE email = ?',
        [email]
      )
      if (account[0][0]) {
        const user = {
          token: account[0][0].token,
          id: account[0][0].id,
          role: account[0][0].role,
          email: account[0][0].email,
          password_encrypt: account[0][0].password_encrypt,
        }
        bcrypt.compare(password, user.password_encrypt, function (err, result) {
          if (err)
            return res.status(400).json({
              error: 'An error has occurred',
            })
          if (result === true) {
            const tokenJwt = jwt.sign(user, process.env.SECRET)
            const token = {
              tokenSession: tokenJwt,
              tokenAccount: user.token,
            }
            req.session.user = {
              token,
              id: user.id,
              role: user.role,
              email: user.email,
            }
            return res.json({
              token,
              id: user.id,
              role: user.role,
              email: user.email,
            })
          } else {
            return res.status(400).json({
              error: 'Wrong password',
            })
          }
        })
      } else {
        return res.status(400).json({
          error: 'Account not found',
        })
      }
    } else {
      return res.status(400).json({
        error: 'A value is missing.',
      })
    }
  }
})

router.get('/logout', (req, res) => {
  req.session.user = null
  return res.json()
})

module.exports = router
