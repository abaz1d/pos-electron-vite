import { pool, Response } from '../../../helpers/util'
const db = pool.promise()

const perkiraanAkuntansi = {}

perkiraanAkuntansi.fetchPerkiraan = async (
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
    let query = `SELECT COUNT(*) AS total FROM perkiraan`
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
    query = `SELECT * FROM perkiraan`
    if (search_data !== '') {
      query += ` WHERE ${search_type} LIKE '%${search_data}%'`
    }
    query += ` ORDER BY ${sort_by} ${sortMode} LIMIT ${row_number}, ${total_row_displayed};`
    const [rows] = await db.query(query)
    return new Response({ rows, total_page })
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
perkiraanAkuntansi.getperkiraanAkuntansi = async (noper) => {
  try {
    const [rows] = await db.query(`SELECT nama FROM perkiraan WHERE noper = ${noper};`)
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
perkiraanAkuntansi.createPerkiraan = async (TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH) => {
  try {
    const [rows] = await db.query(
      `INSERT INTO perkiraan(TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH) VALUES ('${TANGGAL}', '${BUKTI}', '${NOPER}', '${KETERANGAN}', '${JUMLAH}')`
    )
    return new Response(rows)
  } catch (error) {
    console.error('error models', error)
    return new Response(error, false)
  }
}
perkiraanAkuntansi.updatePerkiraan = async (idtrans, TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH) => {
  try {
    const [rows] = await db.query(
      `UPDATE perkiraan SET TANGGAL = '${TANGGAL}', BUKTI = '${BUKTI}', NOPER = '${NOPER}', KETERANGAN = '${KETERANGAN}', JUMLAH = '${JUMLAH}' WHERE idtrans = '${idtrans}'`
    )
    return new Response(rows)
  } catch (error) {
    console.error('error models', error)
    return new Response(error, false)
  }
}
perkiraanAkuntansi.deletePerkiraan = async (idtrans) => {
  try {
    await db.query(`DELETE FROM perkiraan WHERE idtrans = ${idtrans};`)
    return new Response({ message: 'success delete perkiraan' }, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
export default perkiraanAkuntansi
