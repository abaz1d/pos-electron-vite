import { db, Response, isTokenValid } from '../../../helpers/util'
const produkPinjaman = {}

produkPinjaman.fetchProduk = async (
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
      let query = `SELECT COUNT(id) AS total FROM setsandi_pinj WHERE kantor = '${kantor}'`
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
      query = `SELECT id, sandi, keterangan, TGLINP, kantor FROM setsandi_pinj WHERE kantor = '${kantor}'`
      if (search_data !== '') {
        query += ` AND ${search_type} LIKE '%${search_data}%'`
      }
      query += ` ORDER BY ${sort_by} ${sortMode} LIMIT ${row_number}, ${total_row_displayed};`
      const [rows] = await db.query(query)
      const [perkiraan] = await db.query(
        `SELECT noper, nama FROM perkiraan WHERE kantor = '${kantor}' ORDER BY noper ASC;`
      )
      return new Response({ rows, total_page, perkiraan })
    } catch (error) {
      console.error(error)
      return new Response(error, false)
    }
  } else {
    return token
  }
}
produkPinjaman.fetchLaporan = async (kantor, tanggal, resort, limit) => {
  try {
    let query
    query = `SELECT * FROM setsandi_pinj WHERE kantor = '${kantor}' AND tanggal <= '${tanggal}'`
    if (resort !== 'resort') {
      query += ` AND resort = '${resort}'`
    }
    query += ` ORDER BY sandi ASC`
    if (limit !== 0) {
      query += ` LIMIT ${limit}`
    }
    const [rows] = await db.query(query)
    return new Response(rows)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
produkPinjaman.getProduk = async (id) => {
  try {
    const [rows] = await db.query(`SELECT * FROM setsandi_pinj WHERE id = '${id}';`)
    return new Response({ rows }, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
produkPinjaman.postProduk = async (
  id,
  sandi,
  keterangan,
  kdhit,
  pembulatan,
  rate,
  periode,
  adm,
  prov,
  jurnal_pokok,
  jurnal_jasa,
  jurnal_denda,
  jurnal_adm,
  jurnal_prov,
  jurnal_yadit,
  jurnal_ppap,
  isEdit,
  kantor
) => {
  try {
    let rows
    if (!isEdit) {
      ;[rows] = await db.query(
        `INSERT INTO setsandi_pinj(sandi, keterangan, kdhit, pembulatan, rate, periode, adm, prov, jurnal_pokok, jurnal_jasa, jurnal_denda, jurnal_adm, jurnal_prov, jurnal_yadit, jurnal_ppap, kantor) VALUES ('${sandi}', '${keterangan}', '${kdhit}', '${pembulatan}', '${rate}', '${periode}', '${adm}', '${prov}', '${jurnal_pokok}', '${jurnal_jasa}', '${jurnal_denda}', '${jurnal_adm}', '${jurnal_prov}', '${jurnal_yadit}', '${jurnal_ppap}', '${kantor}')`
      )
    } else {
      ;[rows] = await db.query(
        `UPDATE setsandi_pinj SET sandi = '${sandi}', keterangan = '${keterangan}', kdhit = '${kdhit}', pembulatan = '${pembulatan}', rate = '${rate}', periode = '${periode}', adm = '${adm}', prov = '${prov}', jurnal_pokok = '${jurnal_pokok}', jurnal_jasa = '${jurnal_jasa}', jurnal_denda = '${jurnal_denda}', jurnal_adm = '${jurnal_adm}', jurnal_prov = '${jurnal_prov}', jurnal_yadit = '${jurnal_yadit}', jurnal_ppap = '${jurnal_ppap}' WHERE id = '${id}'`
      )
    }
    return new Response(rows)
  } catch (error) {
    console.log('error models', error)
    return new Response(error, false)
  }
}
produkPinjaman.deleteProduk = async (id, kantor) => {
  try {
    await db.query(`DELETE FROM setsandi_pinj WHERE id = '${id}' AND kantor = '${kantor}';`)
    return new Response({ message: 'success delete setsandi_pinj' }, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
export default produkPinjaman
