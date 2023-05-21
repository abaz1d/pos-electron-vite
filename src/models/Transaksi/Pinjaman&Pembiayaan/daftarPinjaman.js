import { db, Response, isTokenValid } from '../../../helpers/util'

const daftarPinjaman = {}

daftarPinjaman.fetchPinjaman = async (
  search_type,
  search_data,
  sort_by,
  sort_mode,
  page_number,
  total_row_displayed,
  kantor
) => {
  //console.log(isTokenValid() ? 'yes' : 'no')
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
      let query = `SELECT COUNT(*) AS total FROM pinjaman p left join anggota a on p.cif = a.cif WHERE p.tgllunas = '0000-00-00' AND p.kantor = '${kantor}'`
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
      query = `SELECT a.nama, a.alamat, a.kecamatan, a.kota, p.tanggal, p.norek, p.cif, p.pokok, p.marketing, p.opt FROM pinjaman p left join anggota a on p.cif = a.cif WHERE p.tgllunas = '0000-00-00' AND p.kantor = '${kantor}'`
      if (search_data !== '') {
        query += ` AND ${search_type} LIKE '%${search_data}%'`
      }
      query += ` ORDER BY ${sort_by} ${sortMode} LIMIT ${row_number}, ${total_row_displayed};`
      const [rows] = await db.query(query)
      console.log(query)
      return new Response({ rows, total_page })
    } catch (error) {
      console.error(error)
      return new Response(error, false)
    }
  } else {
    return token
  }
}
daftarPinjaman.fetchAnggota = async (
  search_type,
  search_data,
  sort_by,
  sort_mode,
  page_number,
  total_row_displayed,
  kantor
) => {
  //console.log(isTokenValid() ? 'yes' : 'no')
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
      let query = `SELECT COUNT(*) AS total FROM anggota WHERE tglbht = '0000-00-00' AND kantor = '${kantor}'`
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
      query = `SELECT iddata, cif, noktp, nokK, nama, alamat, desa, kecamatan, kota, statuskawin FROM anggota WHERE tglbht = '0000-00-00' AND kantor = '${kantor}'`
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
daftarPinjaman.getNasabah = async (cif) => {
  const [rows] = await db.query(
    `SELECT a.nama, a.statuskawin, a.desa, a.alamat, a.kecamatan, a.kota FROM pinjaman p left join anggota a on p.cif = a.cif WHERE p.tgllunas = '0000-00-00' AND p.cif = ${cif};`
  )
  if (rows.length > 0) {
    return new Response({ message: 'Nasabah ini masih memiliki Pinjaman Aktif' }, false)
  } else {
    const [rows] = await db.query(
      `SELECT nama, statuskawin, desa, alamat, kecamatan, kota FROM anggota WHERE cif = ${cif};`
    )
    if (rows.length > 0) {
      return new Response({ rows }, true)
    } else {
      return new Response({ message: 'Tidak ditemukan Nasabah dengan ID tersebut' }, false)
    }
  }
}
daftarPinjaman.setupPinjaman = async (kantor) => {
  try {
    // const [anggota] = await db.query(
    //   `SELECT a.nama, a.cif, a.kota FROM pinjaman p left join anggota a on p.cif = a.cif WHERE p.tgllunas != '0000-00-00' AND p.kantor = ${kantor} ORDER BY a.nama;`
    // )
    const [produk_pinjaman] = await db.query(
      `SELECT * FROM setsandi_pinj WHERE kantor = '${kantor}'`
    )
    const [marketing] = await db.query(
      `SELECT sandi, keterangan FROM setsandi WHERE kantor = '${kantor}' AND kode = 'C002'`
    )
    return new Response({ produk_pinjaman, marketing })
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
daftarPinjaman.fetchLaporan = async (kantor, tanggal, resort, limit) => {
  const token = await isTokenValid()
  if (token.success) {
    try {
      let query
      query = `SELECT * FROM pinjaman WHERE kantor = '${kantor}' AND tanggal <= '${tanggal}'`
      if (resort !== 'resort') {
        query += ` AND resort = '${resort}'`
      }
      query += ` ORDER BY norek ASC`
      if (limit !== '0') {
        query += ` LIMIT ${limit}`
      }
      const [rows] = await db.query(query)
      return new Response(rows)
    } catch (error) {
      console.error(error)
      return new Response(error, false)
    }
  } else {
    return token
  }
}
daftarPinjaman.getPinjaman = async (norek) => {
  try {
    const [rows] = await db.query(
      `SELECT a.nama, a.statuskawin, a.desa, a.alamat, a.kecamatan, a.kota, p.* FROM pinjaman p left join anggota a on p.cif = a.cif WHERE p.norek = ${norek};`
    )
    return new Response({ rows }, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
daftarPinjaman.postPinjaman = async (
  tanggal,
  cif,
  nopk,
  norek,
  jenis,
  marketing,
  pokok,
  rate,
  kdhit,
  tglmulai,
  lama,
  adm,
  provisi,
  tgljtempo,
  tgl_alih_bunga,
  tgl_valuta,
  tgllunas,
  pot_pokok,
  pot_bunga,
  sisa_pokok,
  sisa_jasa,
  isEdit,
  kantor
) => {
  try {
    let rows
    if (!isEdit) {
      console.log('ADDING')
      ;[rows] = await db.query(
        `INSERT INTO pinjaman(tanggal, cif, nopk, norek, jenis, marketing, pokok, rate, kdhit, tglmulai, lama, adm, provisi, tgljtempo, tgl_alih_bunga, tgl_valuta, tgllunas, pot_pokok, pot_bunga, sisa_pokok, sisa_jasa, kantor) VALUES ('${tanggal}', '${cif}', '${nopk}', '${norek}', '${jenis}', '${marketing}', '${pokok}', '${rate}', '${kdhit}', '${tglmulai}', '${lama}', '${adm}', '${provisi}', '${tgljtempo}', '${tgl_alih_bunga}', '${tgl_valuta}', '${tgllunas}', '${pot_pokok}', '${pot_bunga}', '${sisa_pokok}', '${sisa_jasa}', '${kantor}')`
      )
    } else {
      console.log('EDITING')
      ;[rows] = await db.query(
        `UPDATE pinjaman SET tanggal = '${tanggal}', cif = '${cif}', nopk = '${nopk}', norek = '${norek}', jenis = '${jenis}', marketing = '${marketing}', pokok = '${pokok}', rate = '${rate}', kdhit = '${kdhit}', tglmulai = '${tglmulai}', lama = '${lama}', adm = '${adm}', provisi = '${provisi}', tgljtempo = '${tgljtempo}', tgl_alih_bunga = '${tgl_alih_bunga}', tgl_valuta = '${tgl_valuta}',tgllunas = '${tgllunas}',pot_pokok = '${pot_pokok}',pot_bunga = '${pot_bunga}',sisa_pokok = '${sisa_pokok}',sisa_jasa = '${sisa_jasa}',kantor = '${kantor}'`
      )
    }
    console.log(
      'post',
      tanggal,
      cif,
      nopk,
      norek,
      jenis,
      marketing,
      pokok,
      rate,
      kdhit,
      tglmulai,
      lama,
      adm,
      provisi,
      tgljtempo,
      tgl_alih_bunga,
      tgl_valuta,
      tgllunas,
      pot_pokok,
      pot_bunga,
      sisa_pokok,
      sisa_jasa,
      isEdit,
      kantor
    )
    //return new Response(rows)
  } catch (error) {
    console.error('error models', error)
    return new Response(error, false)
  }
}
daftarPinjaman.deletePinjaman = async (norek) => {
  try {
    await db.query(`DELETE FROM pinjaman WHERE norek = ${norek};`)
    return new Response({ message: 'success delete pinjaman' }, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
export default daftarPinjaman
