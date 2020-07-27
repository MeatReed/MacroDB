import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { Octokit } from '@octokit/rest'
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})
const router = Router()

router.get('/apps', (req, res) => {
  res.json({})
})

router.get('/apps/all', async (req, res) => {
  const array = []
  const dbApps = await req.mysql.query('SELECT * FROM apps')
  for (let i = 0; i < dbApps[0].length; i++) {
    const dbAssets = await req.mysql.query(
      'SELECT * FROM assets WHERE app_id = ?',
      dbApps[0][i].id
    )
    array.push({
      app: dbApps[0][i],
      assets: dbAssets[0],
    })
  }
  res.json(array)
})

router.get('/apps/categories', async (req, res) => {
  const dbCategories = await req.mysql.query('SELECT * FROM categories')
  res.json(dbCategories[0])
})

router.get('/apps/category/:name', async (req, res) => {
  const array = []
  const nameCategory = req.params.name
  if (!nameCategory) {
    return res.status(400).json({
      error: 'Missing category name',
    })
  }
  const dbApps = await req.mysql.query(
    'SELECT * FROM apps WHERE category = ?',
    nameCategory
  )
  for (let i = 0; i < dbApps[0].length; i++) {
    const dbAssets = await req.mysql.query(
      'SELECT * FROM assets WHERE app_id = ?',
      dbApps[0][i].id
    )
    array.push({
      app: dbApps[0][i],
      assets: dbAssets[0],
    })
  }
  res.json(array)
})

router.get('/apps/id/:id', async (req, res) => {
  const appID = req.params.id
  if (!appID) {
    return res.status(400).json({
      error: 'Missing app id',
    })
  }
  const dbApp = await req.mysql.query('SELECT * FROM apps WHERE id = ?', appID)
  const dbAssets = await req.mysql.query(
    'SELECT * FROM assets WHERE app_id = ?',
    dbApp[0][0].id
  )
  res.json({
    app: dbApp[0][0],
    assets: dbAssets[0],
  })
})

router.get('/apps/tid/:tid', async (req, res) => {
  const appTID = req.params.tid
  if (!appTID) {
    return res.status(400).json({
      error: 'Missing app id',
    })
  }
  const dbApp = await req.mysql.query(
    'SELECT * FROM apps WHERE tid = ?',
    appTID
  )
  const dbAssets = await req.mysql.query(
    'SELECT * FROM assets WHERE app_id = ?',
    dbApp[0][0].id
  )
  res.json({
    app: dbApp[0][0],
    assets: dbAssets[0],
  })
})

router.post('/apps/submit', async (req, res) => {
  if (req.body) {
    const name = req.body.name
    const tid = req.body.tid
    const description = req.body.description
    const github = req.body.github
    const category = req.body.category

    if (name && tid && description && github && category) {
      const dbApp = await req.mysql.query(
        'SELECT * FROM apps WHERE tid = ?',
        tid
      )
      if (!dbApp[0][0]) {
        const dbAppUnverified = await req.mysql.query(
          'SELECT * FROM appsUnverified WHERE tid = ?',
          tid
        )
        if (!dbAppUnverified[0][0]) {
          const app = {
            name,
            tid,
            description,
            github,
            category,
          }
          await req.mysql.query('INSERT INTO appsUnverified SET ?', app)
          return res.json(app)
        } else {
          return res.status(400).json({
            error: 'The already existing application',
          })
        }
      } else {
        return res.status(400).json({
          error: 'The already existing application',
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

router.get('/apps/unverified', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET, async (err, decrypt) => {
    if (err) {
      return res.status(400).json({
        error: 'An error has occurred',
      })
    }
    if (decrypt.role !== 0) {
      return res.status(400).json({
        error: "You don't have permission!",
      })
    }
    const dbApps = await req.mysql.query('SELECT * FROM appsUnverified')
    res.json(dbApps[0])
  })
})

router.post('/apps/verify', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET, async (err, decrypt) => {
    if (err) {
      return res.status(400).json({
        error: 'An error has occurred',
      })
    }
    if (decrypt.role !== 0) {
      return res.status(400).json({
        error: "You don't have permission!",
      })
    }
    const tid = req.body.tid
    if (!tid) {
      return res.status(400).json({
        error: 'An error has occurred',
      })
    }
    const dbApp = await req.mysql.query(
      'SELECT * FROM appsUnverified WHERE tid = ?',
      tid
    )
    const url = new URL(dbApp[0][0].github).pathname.split('/')
    octokit.repos
      .getLatestRelease({
        owner: url[1],
        repo: url[2],
      })
      .then((response) => {
        res.json({
          db: dbApp[0][0],
          github: response.data,
        })
      })
      .catch((err) => {
        res.json({
          error: err,
        })
      })
  })
})

router.post('/apps/unverified/delete', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET, async (err, decrypt) => {
    if (err) {
      return res.status(400).json({
        error: 'An error has occurred',
      })
    }
    if (decrypt.role !== 0) {
      return res.status(400).json({
        error: "You don't have permission!",
      })
    }
    const tid = req.body.tid
    if (!tid) {
      return res.status(400).json({
        error: 'An error has occurred',
      })
    }
    await req.mysql.query('DELETE FROM appsUnverified WHERE tid = ?', tid)
    res.json({})
  })
})

router.post('/apps/delete', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET, async (err, decrypt) => {
    if (err) {
      return res.status(400).json({
        error: 'An error has occurred',
      })
    }
    if (decrypt.role !== 0) {
      return res.status(400).json({
        error: "You don't have permission!",
      })
    }
    const tid = req.body.tid
    if (!tid) {
      return res.status(400).json({
        error: 'An error has occurred',
      })
    }
    const dbApp = await req.mysql.query(
      'SELECT id FROM apps WHERE tid = ?',
      tid
    )
    await req.mysql.query('DELETE FROM assets WHERE app_id = ?', dbApp[0][0].id)
    await req.mysql.query('DELETE FROM apps WHERE tid = ?', tid)
    res.json({})
  })
})

router.post('/apps/unverified/accept', verifyToken, (req, res) => {
  jwt.verify(req.token, process.env.SECRET, async (err, decrypt) => {
    if (err) {
      return res.status(400).json({
        error: 'An error has occurred',
      })
    }
    if (decrypt.role !== 0) {
      return res.status(400).json({
        error: "You don't have permission!",
      })
    }
    if (!req.body) {
      return res.status(400).json({
        error: 'An error has occurred',
      })
    }
    const tid = req.body.tid
    if (!tid) {
      return res.status(400).json({
        error: 'An error has occurred',
      })
    }
    await req.mysql.query('DELETE FROM appsUnverified WHERE tid = ?', tid)
    const appDB = await req.mysql.query('INSERT INTO apps SET ?', {
      name: req.body.name,
      tid: req.body.tid,
      description: req.body.description,
      author: req.body.author,
      version: req.body.version,
      github: req.body.github,
      category: req.body.category,
      released_at: req.body.released_at,
      name_file: req.body.name_file,
    })
    for (let i = 0; i < req.body.assets.length; i++) {
      const obj = {
        app_id: appDB[0].insertId,
        file_name: req.body.assets[i].name,
        file_size: req.body.assets[i].size,
        file_download: req.body.assets[i].browser_download_url,
      }
      await req.mysql.query('INSERT INTO assets SET ?', obj)
    }
    return res.json(req.body)
  })
})

function verifyToken(req, res, next) {
  const bearerHeader = req.headers.authorization
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ')
    const bearerToken = bearer[1]
    req.token = bearerToken
    next()
  } else {
    return res.status(400).json({
      error: 'Access denied!',
    })
  }
}

module.exports = router
