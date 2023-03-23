// const mysql = require('mysql2')
import mysql from 'mysql2'

export const pool = mysql.createConnection({
  host: '153.92.210.7' || process.env.DB_HOST,
  user: 'admin' || process.env.DB_USER,
  password: 'AB9_$sQ95' || process.env.DB_PASS,
  database: 'abadan' || process.env.DB_NAME
})

export class Response {
  constructor(data, success = true) {
    this.success = success
    this.data = data
  }
}
const currencyFormatter = new Intl.NumberFormat('id', {
  style: 'currency',
  currency: 'IDR'
})

exports = { pool, Response, currencyFormatter }
