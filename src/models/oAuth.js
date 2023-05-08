import { pool, Response } from '../helpers/util'
const db = pool.promise()

const oAuth = {}
console.log(process.env, import.meta.env)

oAuth.auth = async (input_user, password) => {
  try {
    var data
    db.query(`SELECT * FROM users WHERE email_user = ?`, [input_user], (err, rows) => {
      if (err) {
        throw new Error(err)
      }
      data = rows
      if (rows.length == 0) {
        //check username
        console.log('check username')
        db.query('SELECT * FROM users WHERE username = ?', [input_user], (err, rows2) => {
          if (err) {
            throw new Error(err)
          }

          if (rows2.length == 0) {
            return new Response({ message: 'unregistered e-mail/username' }, false)
          }
          data = rows2
          bcrypt.compare(password, data[0].password, async function (err, result) {
            if (err) throw new Error(err)

            if (!result) {
              return new Response({ message: "password doesn't match" }, false)
            }
            //crete token
            var token = jwt.sign(
              {
                userid: data[0].id_user,
                email: data[0].email_user
              },
              'posvite' || process.env.SECRETKEY
            )
            db.query(
              `UPDATE users SET token = ? WHERE id_user = ?;`,
              [token, data[0].id_user],
              (err, result) => {
                if (err) return new Response(err.toString(), false)
                db.query(
                  `SELECT * FROM users WHERE id_user = ?;`,
                  [data[0].id_user],
                  (err, result) => {
                    if (err) return new Response(err.toString(), false)
                    const rows = result
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
                )
              }
            )
          })
        })
      } else {
        console.log('check email')
        bcrypt.compare(password, data.rows[0].password, async function (err, result) {
          if (err) throw new Error(err)

          if (!result) {
            return new Response({ message: "password doesn't match" }, false)
          }
          //crete token
          var token = jwt.sign(
            {
              userid: data.rows[0].id_user,
              email: data.rows[0].email_user
            },
            'posvite' || process.env.SECRETKEY
          )
          db.query(
            `UPDATE users SET token = ? WHERE id_user = ?;`,
            [token, data[0].id_user],
            (err, result) => {
              if (err) return new Response(err.toString(), false)
              db.query(
                `SELECT * FROM users WHERE id_user = ?;`,
                [data[0].id_user],
                (err, result) => {
                  if (err) return new Response(err.toString(), false)
                  const rows = data.rows
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
              )
            }
          )
        })
      }
    })
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
oAuth.logOut = async () => {
  try {
    if (token && token.split(' ')[1]) {
      const pureToken = token.split(' ')[1]
      try {
        const result = jwt.verify(pureToken, 'posvite' || process.env.SECRETKEY)
        db.query(
          `SELECT * FROM users WHERE id_user = ${result.userid} ORDER BY id_user ASC`,
          (err, data) => {
            if (err) return new Response(err.toString(), false)
            const user = data[0]
            var tokenNow = null
            db.query(
              `UPDATE users SET token = ? WHERE id_user = ?;`,
              [tokenNow, user.id_user],
              (err, rows) => {
                if (err) return new Response(err.toString(), false)
                return new Response({ message: 'sign out success' }, true)
              }
            )
          }
        )
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
