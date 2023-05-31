import { db, Response, isTokenValid } from '../../../helpers/util'
const produkSimpata = {}

produkSimpata.fetchProduk = async (
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
      let query = `SELECT COUNT(id) AS total FROM setsandi_tab WHERE kantor = '${kantor}' AND jenis = '1'`
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
      query = `SELECT id, SANDI, KETERANGAN, TGLINP, kantor FROM setsandi_tab WHERE kantor = '${kantor}' AND jenis = '1'`
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
produkSimpata.fetchLaporan = async (kantor, tanggal, resort, limit) => {
  try {
    let query
    query = `SELECT * FROM setsandi_tab WHERE kantor = '${kantor}' AND tanggal <= '${tanggal}'`
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
produkSimpata.getProduk = async (id) => {
  try {
    const [rows] = await db.query(`SELECT * FROM setsandi_tab WHERE id = '${id}';`)
    return new Response({ rows }, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
produkSimpata.postProduk = async (
  id,
  SANDI,
  KETERANGAN,
  OPTHARI,
  VER,
  A_RATE,
  A_OPTADM,
  A_ADM,
  // a_optadm == '1' ? a_adm1 : '0',
  // a_optadm == '1' ? a_nomi_adm1 : '0',
  A_ADM1,
  A_NOMI_ADM1,
  P_RATE,
  P_OPTADM,
  P_ADM,
  // p_optadm == '1' ? p_adm1 : '0',
  // p_optadm == '1' ? p_nomi_adm1 : '0',
  P_ADM1,
  P_NOMI_ADM1,
  SALDOMINIMAL,
  BATASBUNGA,
  OPTPASIF,
  //optpasif1,
  HARIPASIF,
  //optpasif2,
  NOMIPASIF,
  BATASPAJAK,
  PAJAK,
  ANTARBANK,
  JURNALTAB,
  JURNALUTANGBG,
  JURNALBUNGA,
  JURNALADM,
  JURNALADMTUTUP,
  JURNALPAJAK,
  JURNALKSD,
  // dapat_shu
  // metode_shu
  isEdit,
  kantor
) => {
  try {
    let rows
    console.log('edit', isEdit)
    if (!isEdit) {
      ;[rows] = await db.query(
        `INSERT INTO setsandi_tab(SANDI, KETERANGAN, OPTHARI, VER, A_RATE, A_OPTADM, A_ADM, A_ADM1, A_NOMI_ADM1, P_RATE, P_OPTADM, P_ADM, P_ADM1, P_NOMI_ADM1, SALDOMINIMAL,BATASBUNGA,OPTPASIF,HARIPASIF,NOMIPASIF,BATASPAJAK,PAJAK,ANTARBANK,JURNALTAB,JURNALUTANGBG,JURNALBUNGA,JURNALADM,JURNALADMTUTUP,JURNALPAJAK,JURNALKSD, jenis, kantor) VALUES ('${SANDI}', '${KETERANGAN}', '${OPTHARI}', '${VER}', '${A_RATE}', '${A_OPTADM}', '${A_ADM}', '${A_ADM1}', '${A_NOMI_ADM1}', '${P_RATE}', '${P_OPTADM}', '${P_ADM}', '${P_ADM1}', '${P_NOMI_ADM1}', '${SALDOMINIMAL}','${BATASBUNGA}','${OPTPASIF}','${HARIPASIF}','${NOMIPASIF}','${BATASPAJAK}','${PAJAK}','${ANTARBANK}','${JURNALTAB}','${JURNALUTANGBG}','${JURNALBUNGA}','${JURNALADM}','${JURNALADMTUTUP}','${JURNALPAJAK}','${JURNALKSD}', '1', '${kantor}')`
      )
    } else {
      console.log('edit')
      ;[rows] = await db.query(
        `UPDATE setsandi_tab SET SANDI = '${SANDI}', KETERANGAN = '${KETERANGAN}', OPTHARI = '${OPTHARI}', VER = '${VER}', A_RATE = '${A_RATE}', A_OPTADM = '${A_OPTADM}', A_ADM = '${A_ADM}', A_ADM1 = '${A_ADM1}', A_NOMI_ADM1 = '${A_NOMI_ADM1}', P_RATE = '${P_RATE}', P_OPTADM = '${P_OPTADM}', P_ADM = '${P_ADM}', P_ADM1 = '${P_ADM1}', P_NOMI_ADM1 = '${P_NOMI_ADM1}', SALDOMINIMAL = '${SALDOMINIMAL}', BATASBUNGA ='${BATASBUNGA}',OPTPASIF ='${OPTPASIF}',HARIPASIF ='${HARIPASIF}',NOMIPASIF ='${NOMIPASIF}',BATASPAJAK ='${BATASPAJAK}',PAJAK ='${PAJAK}',ANTARBANK ='${ANTARBANK}',JURNALTAB ='${JURNALTAB}',JURNALUTANGBG ='${JURNALUTANGBG}',JURNALBUNGA ='${JURNALBUNGA}',JURNALADM ='${JURNALADM}',JURNALADMTUTUP ='${JURNALADMTUTUP}',JURNALPAJAK ='${JURNALPAJAK}',JURNALKSD ='${JURNALKSD}' WHERE id = '${id}'`
      )
    }
    return new Response(rows)
  } catch (error) {
    console.log('error models', error)
    return new Response(error, false)
  }
}
produkSimpata.deleteProduk = async (id, kantor) => {
  try {
    await db.query(`DELETE FROM setsandi_tab WHERE id = '${id}' AND kantor = '${kantor}';`)
    return new Response({ message: 'success delete setsandi_tab' }, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
export default produkSimpata
