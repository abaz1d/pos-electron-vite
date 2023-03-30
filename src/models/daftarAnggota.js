import { pool, Response } from '../helpers/util'
const db = pool.promise()

const daftarAnggota = {}

daftarAnggota.fetchProduk = async (
  search_type,
  search_data,
  sort_by,
  sort_mode,
  page_number,
  total_row_displayed
) => {
  var sortMode = sort_mode ? 'ASC' : 'DESC'
  let row_number
  if (page_number < 2) {
    row_number = 0
  } else {
    row_number = (page_number - 1) * total_row_displayed
  }

  try {
    let query = `SELECT COUNT(*) AS total FROM anggota`
    if (search_data !== '') {
      query += ` WHERE ${search_type} LIKE '%${search_data}%'`
    }
    const [data] = await db.query(query)
    let total_page
    if (data[0].total % total_row_displayed == 0) {
      total_page = parseInt(data[0].total / total_row_displayed)
    } else {
      total_page = parseInt(data[0].total / total_row_displayed) + 1
    }
    query = `SELECT * FROM anggota`
    if (search_data !== '') {
      query += ` WHERE ${search_type} LIKE '%${search_data}%'`
    }
    query += ` ORDER BY ${sort_by} ${sortMode} LIMIT ${row_number}, ${total_row_displayed};`
    const [rows] = await db.query(query)
    return new Response({ rows, total_page })
  } catch (error) {
    console.log(error)
    return new Response(error, false)
  }
}

export default daftarAnggota
