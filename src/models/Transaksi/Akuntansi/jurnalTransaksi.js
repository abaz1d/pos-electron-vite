import { pool, Response } from '../../../helpers/util'
const db = pool.promise()

const jurnalTransaksi = {}

jurnalTransaksi.fetchJurnal = async (
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
    let query = `SELECT COUNT(*) AS total FROM jurnal`
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
    query = `SELECT * FROM jurnal`
    if (search_data !== '') {
      query += ` WHERE ${search_type} LIKE '%${search_data}%'`
    }
    query += ` ORDER BY ${sort_by} ${sortMode} LIMIT ${row_number}, ${total_row_displayed};`
    const [rows] = await db.query(query)
    const [perkiraan] = await db.query(`SELECT noper, nama FROM perkiraan ORDER BY noper ASC;`)
    return new Response({ rows, total_page, perkiraan })
  } catch (error) {
    console.log(error)
    return new Response(error, false)
  }
}
jurnalTransaksi.getperkiraanJurnal = async (noper) => {
  try {
    const [rows] = await db.query(`SELECT nama FROM perkiraan WHERE noper = ${noper};`)
    return new Response(rows, true)
  } catch (error) {
    console.log(error)
    return new Response(error, false)
  }
}
jurnalTransaksi.getJurnal = async (bukti) => {
  try {
    const [rows] = await db.query(`SELECT * FROM jurnal WHERE BUKTI = ${bukti};`)
    return new Response({ rows }, true)
  } catch (error) {
    console.log(error)
    return new Response(error, false)
  }
}
jurnalTransaksi.postJurnal = async (
  tanggal,
  no_jurnal,
  no_ktp,
  no_kk,
  nama_lengkap,
  tempat_lahir,
  tanggal_lahir,
  jenis_kelamin,
  agama,
  alamat,
  rt,
  rw,
  kelurahan,
  kecamatan,
  kota,
  pendamping,
  pekerjaan,
  no_telepon,
  resort,
  imageFoto,
  imageTTD,
  imagePA
) => {
  try {
    console.log(
      'POST AGT',

      tanggal,
      no_jurnal,
      no_ktp,
      no_kk,
      nama_lengkap,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      agama,
      alamat,
      rt,
      rw,
      kelurahan,
      kecamatan,
      kota,
      pendamping,
      pekerjaan,
      no_telepon,
      resort,
      imageFoto,
      imageTTD,
      imagePA.path
    )
    const [rows] = await db.query(
      `INSERT INTO jurnal(cif, tanggal, nokK, noktp, nama, tempatlhr, tanggallhr, jeniskl, alamat, rt, desa, kecamatan, kota, agama, pekerjaan, statuskawin, phone, foto, tandatangan, paraf, resort) VALUES ('${no_jurnal}', '${tanggal}', '${no_kk}', '${no_ktp}', '${nama_lengkap}', '${tempat_lahir}', '${tanggal_lahir}', '${jenis_kelamin}', '${alamat}', '${rt}', '${kelurahan}', '${kecamatan}', '${kota}', '${agama}', '${pekerjaan}', '${pendamping}', '${no_telepon}', LOAD_FILE('${imageFoto.path}'), LOAD_FILE('${imageTTD.path}'), LOAD_FILE('${imagePA.path}'), '${resort}')`
    )
    return new Response(rows)
  } catch (error) {
    console.log('error models', error)
    return new Response(error, false)
  }
}
jurnalTransaksi.deleteJurnal = async (idtrans) => {
  try {
    await db.query(`DELETE FROM jurnal WHERE idtrans = ${idtrans};`)
    return new Response({ message: 'success delete jurnal' }, true)
  } catch (error) {
    console.log(error)
    return new Response(error, false)
  }
}
export default jurnalTransaksi
