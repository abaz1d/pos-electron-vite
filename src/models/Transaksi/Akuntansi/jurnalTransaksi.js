import { db, Response, isTokenValid } from '../../../helpers/util'

const jurnalTransaksi = {}

jurnalTransaksi.fetchJurnal = async (
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
      let query = `SELECT COUNT(*) AS total FROM jurnal WHERE kantor = '${kantor}'`
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
      query = `SELECT * FROM jurnal WHERE kantor = '${kantor}'`
      if (search_data !== '') {
        query += ` AND ${search_type} LIKE '%${search_data}%'`
      }
      query += ` ORDER BY ${sort_by} ${sortMode} LIMIT ${row_number}, ${total_row_displayed};`
      const [rows] = await db.query(query)
      const [perkiraan] = await db.query(`SELECT noper, nama FROM perkiraan ORDER BY noper ASC;`)
      return new Response({ rows, total_page, perkiraan })
    } catch (error) {
      console.error(error)
      return new Response(error, false)
    }
  } else {
    return token
  }
}
jurnalTransaksi.getperkiraanJurnal = async (noper) => {
  try {
    const [rows] = await db.query(`SELECT nama FROM perkiraan WHERE noper = ${noper};`)
    return new Response(rows, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
jurnalTransaksi.getJurnal = async (bukti) => {
  try {
    const [rows] = await db.query(`SELECT * FROM jurnal WHERE BUKTI = ${bukti};`)
    return new Response({ rows }, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
jurnalTransaksi.createJurnal = async (TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH, KANTOR) => {
  try {
    const [rows] = await db.query(
      `INSERT INTO jurnal(TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH, KANTOR) VALUES ('${TANGGAL}', '${BUKTI}', '${NOPER}', '${KETERANGAN}', '${JUMLAH}', '${KANTOR}')`
    )
    return new Response(rows)
  } catch (error) {
    console.error('error models', error)
    return new Response(error, false)
  }
}
jurnalTransaksi.updateJurnal = async (idtrans, TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH) => {
  try {
    const [rows] = await db.query(
      `UPDATE jurnal SET TANGGAL = '${TANGGAL}', BUKTI = '${BUKTI}', NOPER = '${NOPER}', KETERANGAN = '${KETERANGAN}', JUMLAH = '${JUMLAH}' WHERE idtrans = '${idtrans}'`
    )
    return new Response(rows)
  } catch (error) {
    console.error('error models', error)
    return new Response(error, false)
  }
}
jurnalTransaksi.deleteJurnal = async (idtrans) => {
  try {
    await db.query(`DELETE FROM jurnal WHERE idtrans = ${idtrans};`)
    return new Response({ message: 'success delete jurnal' }, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
export default jurnalTransaksi
