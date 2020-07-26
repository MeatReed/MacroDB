const { Octokit } = require('@octokit/rest')

const mysql = require('mysql2/promise')

require('dotenv').config()
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})

setInterval(async function () {
  const apps = await connection.query('SELECT * FROM apps')
  for (let i = 0; i < apps[0].length; i++) {
    updateApps(apps[0][i])
  }
}, 3600000)

async function updateApps(app) {
  const url = new URL(app.github).pathname.split('/')
  const response = await octokit.repos.getLatestRelease({
    owner: url[1],
    repo: url[2],
  })

  const github = response.data
  const cia = github.assets.find((cias) => cias.file_name === app.name_file)
  await connection.query(`UPDATE apps SET ? WHERE tid = '${app.tid}'`, {
    name: app.name,
    tid: app.tid,
    description: app.description,
    author: github.author.login,
    version: github.tag_name,
    github: app.github,
    category: app.category,
    released_at: cia
      ? new Date(cia.created_at).toISOString().slice(0, 19).replace('T', ' ')
      : app.released_at,
    name_file: cia ? cia.name : app.name,
  })
  await connection.query('DELETE FROM assets WHERE app_id = ?', app.id)
  for (let i = 0; i < github.assets.length; i++) {
    const obj = {
      app_id: app.id,
      file_name: github.assets[i].name,
      file_size: github.assets[i].size,
      file_download: github.assets[i].browser_download_url,
    }
    await connection.query('INSERT INTO assets SET ?', obj)
  }
}

;(async function () {
  const apps = await connection.query('SELECT * FROM apps')
  for (let i = 0; i < apps[0].length; i++) {
    updateApps(apps[0][i])
  }
})()
