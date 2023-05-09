import { db, Response, isTokenValid } from '../../../helpers/util'

const daftarAnggota = {}

daftarAnggota.fetchAnggota = async (
  search_type,
  search_data,
  sort_by,
  sort_mode,
  page_number,
  total_row_displayed
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
      console.error(error)
      return new Response(error, false)
    }
  } else {
    return token
  }
}
daftarAnggota.fetchLaporan = async (kantor, tanggal, resort, limit) => {
  const token = await isTokenValid()
  if (token.success) {
    try {
      let query
      query = `SELECT * FROM anggota WHERE kantor = '${kantor}' AND tanggal <= '${tanggal}'`
      if (resort !== 'resort') {
        query += ` AND resort = '${resort}'`
      }
      query += ` ORDER BY iddata ASC`
      if (limit !== 0) {
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
daftarAnggota.getAnggota = async (iddata) => {
  try {
    const [rows] = await db.query(`SELECT * FROM anggota WHERE iddata = ${iddata};`)
    return new Response({ rows }, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
daftarAnggota.postAnggota = async (
  iddata,
  tanggal,
  no_anggota,
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
    // console.log(
    //   'POST AGT',

    //   tanggal,
    //   no_anggota,
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
    //   imagePA
    // )
    let rows
    if (imageFoto !== null || imageTTD !== null || imagePA !== null) {
      if (iddata == '') {
        ;[rows] = await db.query(
          `INSERT INTO anggota(cif, tanggal, nokK, noktp, nama, tempatlhr, tanggallhr, jeniskl, alamat, rt, desa, kecamatan, kota, agama, pekerjaan, statuskawin, phone, foto, tandatangan, paraf, resort) VALUES ('${no_anggota}', '${tanggal}', '${no_kk}', '${no_ktp}', '${nama_lengkap}', '${tempat_lahir}', '${tanggal_lahir}', '${jenis_kelamin}', '${alamat}', '${rt}', '${kelurahan}', '${kecamatan}', '${kota}', '${agama}', '${pekerjaan}', '${pendamping}', '${no_telepon}','${new Blob(
            [imageFoto],
            { type: imageFoto.type }
          )}','${new Blob([imageTTD], { type: imageTTD.type })}','${new Blob([imagePA], {
            type: imagePA.type
          })}', '${resort}')`
        )
      } else {
        ;[rows] = await db.query(
          `UPDATE anggota SET cif = '${no_anggota}', tanggal = '${tanggal}', nokK = '${no_kk}', noktp = '${no_ktp}', nama = '${nama_lengkap}', tempatlhr = '${tempat_lahir}', tanggallhr = '${tanggal_lahir}', jeniskl = '${jenis_kelamin}', alamat = '${alamat}', rt = '${rt}/${rw}', desa = '${kelurahan}', kecamatan = '${kecamatan}', kota = '${kota}', agama = '${agama}', pekerjaan = '${pekerjaan}', statuskawin = '${pendamping}', phone = '${no_telepon}', foto = ${new Blob(
            [imageFoto],
            { type: imageFoto.type }
          )}', tandatangan = '${new Blob([imageTTD], {
            type: imageTTD.type
          })}', paraf = '${new Blob([imagePA], {
            type: imagePA.type
          })}', resort = '${resort}' WHERE iddata = '${iddata}'`
        )
      }
    } else {
      if (iddata == '') {
        ;[rows] = await db.query(
          `INSERT INTO anggota(cif, tanggal, nokK, noktp, nama, tempatlhr, tanggallhr, jeniskl, alamat, rt, desa, kecamatan, kota, agama, pekerjaan, statuskawin, phone, resort) VALUES ('${no_anggota}', '${tanggal}', '${no_kk}', '${no_ktp}', '${nama_lengkap}', '${tempat_lahir}', '${tanggal_lahir}', '${jenis_kelamin}', '${alamat}', '${rt}', '${kelurahan}', '${kecamatan}', '${kota}', '${agama}', '${pekerjaan}', '${pendamping}', '${no_telepon}', '${resort}')`
        )
      } else {
        ;[rows] = await db.query(
          `UPDATE anggota SET cif = '${no_anggota}', tanggal = '${tanggal}', nokK = '${no_kk}', noktp = '${no_ktp}', nama = '${nama_lengkap}', tempatlhr = '${tempat_lahir}', tanggallhr = '${tanggal_lahir}', jeniskl = '${jenis_kelamin}', alamat = '${alamat}', rt = '${rt}/${rw}', desa = '${kelurahan}', kecamatan = '${kecamatan}', kota = '${kota}', agama = '${agama}', pekerjaan = '${pekerjaan}', statuskawin = '${pendamping}', phone = '${no_telepon}', resort = '${resort}' WHERE iddata = '${iddata}'`
        )
      }
    }
    return new Response(rows)
  } catch (error) {
    console.log('error models', error)
    return new Response(error, false)
  }
}
daftarAnggota.deleteAnggota = async (iddata) => {
  try {
    await db.query(`DELETE FROM anggota WHERE iddata = ${iddata};`)
    return new Response({ message: 'success delete anggota' }, true)
  } catch (error) {
    console.error(error)
    return new Response(error, false)
  }
}
export default daftarAnggota
