import { pool, Response } from '../helpers/util'
const db = pool.promise()

const daftarAnggota = {}

daftarAnggota.fetchProduk = async (e) => {
  try {
    const [rows, fields] = await db.query('SELECT * FROM anggota;')
    return rows
  } catch (error) {
    throw new error()
  }
}

export default daftarAnggota
