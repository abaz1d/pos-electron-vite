// const mysql = require('mysql2')
import mysql from 'mysql2'
const jwt = require('jsonwebtoken')

export const pool = mysql.createPool({
  host: '153.92.210.7' || process.env.DB_HOST,
  user: 'admin' || process.env.DB_USER,
  password: 'AB9_$sQ95' || process.env.DB_PASS,
  database: 'binaniaga' || process.env.DB_NAME
})
export const db = pool.promise()
export const secretKey = 'posvite'

export class Response {
  constructor(data, success = true) {
    this.success = success
    this.data = data
  }
}

export const isTokenValid = async () => {
  const user = localStorage.getItem('user')
  const token = `Bearer ${JSON.parse(user).token}`
  //const token = req.headers.authorization
  if (token && token.split(' ')[1]) {
    const pureToken = token.split(' ')[1]

    try {
      const result = jwt.verify(pureToken, secretKey)
      const [data] = await db.query(
        `SELECT * FROM users WHERE id_user = ${result.userid} ORDER BY id_user ASC`
      )
      const user = data[0]
      if (user.token == pureToken) {
        //next()
        console.log('token', user.token == pureToken)
        return new Response({ message: 'token valid' }, true)
      } else {
        return new Response({ message: 'token invalid' }, false)
      }
    } catch (e) {
      console.error('gagal verify', e)
      return new Response({ message: 'token invalid' }, false)
    }
  } else {
    return new Response({ message: 'token invalid' }, false)
  }
}

exports = { db, pool, Response, isTokenValid, secretKey }
