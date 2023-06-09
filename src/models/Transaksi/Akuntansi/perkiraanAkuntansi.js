import { db, Response, isTokenValid } from '../../../helpers/util'

const perkiraanAkuntansi = {}

perkiraanAkuntansi.fetchPerkiraan = async (
  search_type,
  search_data,
  sort_by,
  sort_mode,
  page_number,
  total_row_displayed,
  kantor
) => {
  const token = await isTokenValid()
  if (token.success) {
    var sortMode = sort_mode ? 'ASC' : 'DESC'
    let row_number
    if (page_number < 2) {
      row_number = 0
    } else {
      row_number = (page_number - 1) * total_row_displayed
    }

    try {
      let query = `SELECT COUNT(noper) AS total FROM perkiraan WHERE kantor = '${kantor}'`
      if (search_data !== '') {
        query += ` AND ${search_type} LIKE '%${search_data}%'`
      }
      const [data] = await db.query(query)
      let total_page
      if (data[0].total % total_row_displayed == 0) {
        total_page = parseInt(data[0].total / total_row_displayed)
      } else {
        total_page = parseInt(data[0].total / total_row_displayed) + 1
      }
      query = `SELECT noper, nama, kel, bukubantu, keldata, level, font, detail, saldo FROM perkiraan WHERE kantor = '${kantor}'`
      if (search_data !== '') {
        query += ` AND ${search_type} LIKE '%${search_data}%'`
      }
      query += ` ORDER BY ${sort_by} ${sortMode} LIMIT ${row_number}, ${total_row_displayed};`
      const [rows] = await db.query(query)
      return new Response({ rows, total_page })
    } catch (error) {
      console.error(error)
      return new Response(error, false)
    }
  } else {
    return token
  }
}
perkiraanAkuntansi.getperkiraanAkuntansi = async (noper) => {
  try {
    const [rows] = await db.query(`SELECT * FROM perkiraan WHERE noper = ${noper};`)
    return new Response(rows, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
perkiraanAkuntansi.getPerkiraan = async (bukti) => {
  try {
    const [rows] = await db.query(`SELECT * FROM perkiraan WHERE BUKTI = ${bukti};`)
    return new Response({ rows }, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
perkiraanAkuntansi.createPerkiraan = async (
  noper,
  nama,
  level,
  bukubantu,
  kelompok,
  kelompok_data,
  detail,
  kantor
) => {
  try {
    const [rows] = await db.query(
      `INSERT INTO perkiraan(noper, nama, level, bukubantu, kel, keldata, detail, font, kantor) VALUES ('${noper}', '${nama}', '${level}', '${bukubantu}', '${kelompok}', '${kelompok_data}', '${detail}', '', '${kantor}')`
    )
    return new Response(rows)
  } catch (error) {
    console.error('error models', error)
    return new Response(error, false)
  }
}
perkiraanAkuntansi.updatePerkiraan = async (
  noper,
  nama,
  level,
  bukubantu,
  kelompok,
  kelompok_data,
  detail
) => {
  try {
    const [rows] = await db.query(
      `UPDATE perkiraan SET nama = '${nama}', level = '${level}', bukubantu = '${bukubantu}', kel = '${kelompok}', keldata = '${kelompok_data}', detail = '${detail}' WHERE noper = '${noper}'`
    )
    return new Response(rows)
  } catch (error) {
    console.error('error models', error)
    return new Response(error, false)
  }
}
perkiraanAkuntansi.deletePerkiraan = async (noper) => {
  try {
    await db.query(`DELETE FROM perkiraan WHERE noper = ${noper};`)
    return new Response({ message: 'success delete perkiraan' }, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
export default perkiraanAkuntansi
