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

setInterval(function () {
  connection.query('SELECT * FROM apps').then((apps) => {
    for (let i = 0; i < apps[0].length; i++) {
      const url = new URL(apps[0][i].github).pathname.split('/')
      octokit.repos
        .getLatestRelease({
          owner: url[1],
          repo: url[2],
        })
        .then(async (response) => {
          const github = response.data
          const obj = {
            name: apps[0][i].name,
            tid: apps[0][i].tid,
            description: apps[0][i].description,
            author: github.author.login,
            version: github.tag_name,
            github: apps[0][i].github,
            download: github.assets.find(
              (cias) => cias.name === apps[0][i].name_file
            ).browser_download_url,
            category: apps[0][i].category,
            released_at: new Date(
              github.assets.find(
                (cias) => cias.name === apps[0][i].name_file
              ).created_at
            )
              .toISOString()
              .slice(0, 19)
              .replace('T', ' '),
            name_file: github.assets.find(
              (cias) => cias.name === apps[0][i].name_file
            ).name,
          }
          console.log(obj)
          await connection.query(
            `UPDATE apps SET ? WHERE tid = '${apps[0][i].tid}'`,
            obj
          )
        })
        .catch((err) => {
          console.log(err)
        })
    }
  })
}, 3600000)
