import { db, Response, isTokenValid, secretKey } from '../helpers/util'
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const oAuth = {}

oAuth.auth = async (input_user, password) => {
  try {
    var data
    const [rows] = await db.query(`SELECT * FROM users WHERE email_user = ?`, [input_user])
    data = rows
    if (rows.length == 0) {
      //check username
      console.log('check username')
      const [rows2] = await db.query('SELECT * FROM users WHERE username = ?', [input_user])
      if (rows2.length == 0) {
        return new Response({ message: 'unregistered e-mail/username' }, false)
      }
      data = rows2
      const result = await bcrypt.compare(password, data[0].password)
      if (!result) {
        return new Response({ message: "password doesn't match" }, false)
      } else {
        //crete token
        var token = jwt.sign(
          {
            userid: data[0].id_user,
            email: data[0].email_user
          },
          secretKey
        )
        const [update] = await db.query(`UPDATE users SET token = ? WHERE id_user = ?;`, [
          token,
          data[0].id_user
        ])

        const [rows2] = await db.query(`SELECT * FROM users WHERE id_user = ?;`, [data[0].id_user])
        return new Response({
          userid: rows2[0].id_user,
          email: rows2[0].email_user,
          username: rows2[0].username,
          role: rows2[0].role,

          id_region: rows2[0].id_region,
          nama_region: rows2[0].nama_region,
          token: rows2[0].token
        })
      }
    } else {
      console.log('check email')
      const result = await bcrypt.compare(password, data[0].password)
      if (!result) {
        return new Response({ message: "password doesn't match" }, false)
      } else {
        //crete token
        var token = jwt.sign(
          {
            userid: data[0].id_user,
            email: data[0].email_user
          },
          secretKey
        )
        const [update] = await db.query(`UPDATE users SET token = ? WHERE id_user = ?;`, [
          token,
          data[0].id_user
        ])

        const rows = data
        return new Response({
          userid: rows[0].id_user,
          email: rows[0].email_user,
          username: rows[0].username,
          role: rows[0].role,

          id_region: rows[0].id_region,
          nama_region: rows[0].nama_region,
          token: rows[0].token
        })
      }
    }
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
oAuth.logOut = async () => {
  try {
    const user = localStorage.getItem('user')
    const token = `Bearer ${JSON.parse(user).token}`
    if (token && token.split(' ')[1]) {
      const pureToken = token.split(' ')[1]
      try {
        const result = jwt.verify(pureToken, secretKey)
        const [data] = await db.query(
          `SELECT * FROM users WHERE id_user = ${result.userid} ORDER BY id_user ASC`
        )
        const user = data[0]
        var tokenNow = null

        const [rows] = await db.query(`UPDATE users SET token = ? WHERE id_user = ?;`, [
          tokenNow,
          user.id_user
        ])
        return new Response({ message: 'sign out success' }, true)
      } catch (e) {
        return new Response({ message: e + 'token invalid' }, false)
      }
    } else {
      return new Response({ message: 'token invalid, gak ada token' }, false)
    }
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
export default oAuth
