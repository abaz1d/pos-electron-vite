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
      let query = `SELECT COUNT(*) AS total FROM pinjaman p left join anggota a on p.cif = a.cif WHERE p.kantor = '${kantor}'`
      if (search_data !== '') {
        query += ` AND ${search_type} LIKE '%${search_data}%'`
      }
      console.log(query)
      const [data] = await db.query(query)
      let total_page
      if (data[0].total % total_row_displayed == 0) {
        total_page = parseInt(data[0].total / total_row_displayed)
      } else {
        total_page = parseInt(data[0].total / total_row_displayed) + 1
      }
      query = `SELECT a.nama, a.alamat, a.kecamatan, a.kota, p.tanggal, p.norek, p.cif, p.pokok, p.marketing, p.opt FROM pinjaman p left join anggota a on p.cif = a.cif WHERE p.kantor = '${kantor}'`
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
  norek,
  tanggal,
  no_pinjaman,
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
  imagePA,
  kantor
) => {
  try {
    // console.log(
    //   'POST AGT',

    //   tanggal,
    //   no_pinjaman,
    //   no_ktp,
    //   no_kk,
    //   nama_lengkap,
    //   tempat_lahir,
    //   tanggal_lahir,
    //   jenis_kelamin,
    //   agama,
    //   alamat,
    //   rt,
    //   rw,
    //   kelurahan,
    //   kecamatan,
    //   kota,
    //   pendamping,
    //   pekerjaan,
    //   no_telepon,
    //   resort,
    //   imageFoto,
    //   imageTTD,
    //   imagePA,
    //    kantor
    // )
    let rows
    if (imageFoto !== null || imageTTD !== null || imagePA !== null) {
      if (norek == '') {
        ;[rows] = await db.query(
          `INSERT INTO pinjaman(cif, tanggal, nokK, noktp, nama, tempatlhr, tanggallhr, jeniskl, alamat, rt, desa, kecamatan, kota, agama, pekerjaan, statuskawin, phone, foto, tandatangan, paraf, resort, kantor) VALUES ('${no_pinjaman}', '${tanggal}', '${no_kk}', '${no_ktp}', '${nama_lengkap}', '${tempat_lahir}', '${tanggal_lahir}', '${jenis_kelamin}', '${alamat}', '${rt}', '${kelurahan}', '${kecamatan}', '${kota}', '${agama}', '${pekerjaan}', '${pendamping}', '${no_telepon}','${new Blob(
            [imageFoto],
            { type: imageFoto.type }
          )}','${new Blob([imageTTD], { type: imageTTD.type })}','${new Blob([imagePA], {
            type: imagePA.type
          })}', '${resort}', '${kantor}')`
        )
      } else {
        ;[rows] = await db.query(
          `UPDATE pinjaman SET cif = '${no_pinjaman}', tanggal = '${tanggal}', nokK = '${no_kk}', noktp = '${no_ktp}', nama = '${nama_lengkap}', tempatlhr = '${tempat_lahir}', tanggallhr = '${tanggal_lahir}', jeniskl = '${jenis_kelamin}', alamat = '${alamat}', rt = '${rt}/${rw}', desa = '${kelurahan}', kecamatan = '${kecamatan}', kota = '${kota}', agama = '${agama}', pekerjaan = '${pekerjaan}', statuskawin = '${pendamping}', phone = '${no_telepon}', foto = ${new Blob(
            [imageFoto],
            { type: imageFoto.type }
          )}', tandatangan = '${new Blob([imageTTD], {
            type: imageTTD.type
          })}', paraf = '${new Blob([imagePA], {
            type: imagePA.type
          })}', resort = '${resort}' WHERE norek = '${norek}'`
        )
      }
    } else {
      if (norek == '') {
        ;[rows] = await db.query(
          `INSERT INTO pinjaman(cif, tanggal, nokK, noktp, nama, tempatlhr, tanggallhr, jeniskl, alamat, rt, desa, kecamatan, kota, agama, pekerjaan, statuskawin, phone, resort) VALUES ('${no_pinjaman}', '${tanggal}', '${no_kk}', '${no_ktp}', '${nama_lengkap}', '${tempat_lahir}', '${tanggal_lahir}', '${jenis_kelamin}', '${alamat}', '${rt}', '${kelurahan}', '${kecamatan}', '${kota}', '${agama}', '${pekerjaan}', '${pendamping}', '${no_telepon}', '${resort}')`
        )
      } else {
        ;[rows] = await db.query(
          `UPDATE pinjaman SET cif = '${no_pinjaman}', tanggal = '${tanggal}', nokK = '${no_kk}', noktp = '${no_ktp}', nama = '${nama_lengkap}', tempatlhr = '${tempat_lahir}', tanggallhr = '${tanggal_lahir}', jeniskl = '${jenis_kelamin}', alamat = '${alamat}', rt = '${rt}/${rw}', desa = '${kelurahan}', kecamatan = '${kecamatan}', kota = '${kota}', agama = '${agama}', pekerjaan = '${pekerjaan}', statuskawin = '${pendamping}', phone = '${no_telepon}', resort = '${resort}' WHERE norek = '${norek}'`
        )
      }
    }
    return new Response(rows)
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
