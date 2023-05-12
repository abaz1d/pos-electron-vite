"use strict";
const electron = require("electron");
const preload = require("@electron-toolkit/preload");
const mysql = require("mysql2");
const jwt$1 = require("jsonwebtoken");
const pool = mysql.createPool({
  host: "153.92.210.7",
  user: "admin",
  password: "AB9_$sQ95",
  database: "binaniaga"
});
const db = pool.promise();
const secretKey = "posvite";
class Response {
  constructor(data, success = true) {
    this.success = success;
    this.data = data;
  }
}
const isTokenValid = async () => {
  const user = localStorage.getItem("user");
  const token = `Bearer ${JSON.parse(user).token}`;
  if (token && token.split(" ")[1]) {
    const pureToken = token.split(" ")[1];
    try {
      const result = jwt$1.verify(pureToken, secretKey);
      const [data] = await db.query(
        `SELECT * FROM user WHERE id = ${result.userid} ORDER BY id ASC`
      );
      const user2 = data[0];
      if (user2.token == pureToken) {
        return new Response({ message: "token valid" }, true);
      } else {
        return new Response({ message: "token invalid" }, false);
      }
    } catch (e) {
      console.error("gagal verify", e);
      return new Response({ message: "token invalid" }, false);
    }
  } else {
    return new Response({ message: "token invalid" }, false);
  }
};
exports = { db, pool, Response, isTokenValid, secretKey };
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const oAuth = {};
oAuth.auth = async (input_user, password) => {
  try {
    var data;
    const [rows] = await db.query(`SELECT * FROM user WHERE nama = ?`, [input_user]);
    data = rows;
    if (rows.length == 0) {
      console.log("check userid");
      const [rows2] = await db.query("SELECT * FROM user WHERE userid = ?", [input_user]);
      if (rows2.length == 0) {
        return new Response({ message: "unregistered e-mail/userid" }, false);
      }
      data = rows2;
      const result = await bcrypt.compare(password, data[0].password);
      if (!result) {
        return new Response({ message: "password doesn't match" }, false);
      } else {
        var token = jwt.sign(
          {
            userid: data[0].id,
            nama: data[0].nama
          },
          secretKey
        );
        const [update] = await db.query(`UPDATE user SET token = ? WHERE id = ?;`, [
          token,
          data[0].id
        ]);
        const [rows22] = await db.query(`SELECT * FROM user WHERE id = ?;`, [data[0].id]);
        return new Response({
          userid: rows22[0].id,
          nama: rows22[0].nama,
          username: rows22[0].userid,
          kantor: rows22[0].kantor,
          token: rows22[0].token
        });
      }
    } else {
      console.log("check nama");
      const result = await bcrypt.compare(password, data[0].password);
      if (!result) {
        return new Response({ message: "password doesn't match" }, false);
      } else {
        var token = jwt.sign(
          {
            userid: data[0].id,
            nama: data[0].nama
          },
          secretKey
        );
        const [update] = await db.query(`UPDATE user SET token = ? WHERE id = ?;`, [
          token,
          data[0].id
        ]);
        const [rows2] = await db.query(`SELECT * FROM user WHERE id = ?;`, [data[0].id]);
        return new Response({
          userid: rows2[0].id,
          nama: rows2[0].nama,
          username: rows2[0].userid,
          kantor: rows2[0].kantor,
          token: rows2[0].token
        });
      }
    }
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
oAuth.logOut = async () => {
  try {
    const user = localStorage.getItem("user");
    const token = `Bearer ${JSON.parse(user).token}`;
    if (token && token.split(" ")[1]) {
      const pureToken = token.split(" ")[1];
      try {
        const result = jwt.verify(pureToken, secretKey);
        const [data] = await db.query(
          `SELECT * FROM user WHERE id = ${result.userid} ORDER BY id ASC`
        );
        const user2 = data[0];
        var tokenNow = null;
        const [rows] = await db.query(`UPDATE user SET token = ? WHERE id = ?;`, [
          tokenNow,
          user2.id
        ]);
        return new Response({ message: "sign out success" }, true);
      } catch (e) {
        return new Response({ message: e + "token invalid" }, false);
      }
    } else {
      return new Response({ message: "token invalid, gak ada token" }, false);
    }
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
const produkPinjaman = {};
produkPinjaman.fetchProduk = async (search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed, kantor) => {
  const token = await isTokenValid();
  if (token.success) {
    var sortMode = sort_mode ? "ASC" : "DESC";
    let row_number;
    if (page_number < 2) {
      row_number = 0;
    } else {
      row_number = (page_number - 1) * total_row_displayed;
    }
    try {
      let query = `SELECT COUNT(*) AS total FROM setsandi_pinj WHERE kantor = '${kantor}'`;
      if (search_data !== "") {
        query += ` AND ${search_type} LIKE '%${search_data}%'`;
      }
      const [data] = await db.query(query);
      let total_page;
      if (data[0].total % total_row_displayed == 0) {
        total_page = parseInt(data[0].total / total_row_displayed);
      } else {
        total_page = parseInt(data[0].total / total_row_displayed) + 1;
      }
      query = `SELECT * FROM setsandi_pinj WHERE kantor = '${kantor}'`;
      if (search_data !== "") {
        query += ` AND ${search_type} LIKE '%${search_data}%'`;
      }
      query += ` ORDER BY ${sort_by} ${sortMode} LIMIT ${row_number}, ${total_row_displayed};`;
      const [rows] = await db.query(query);
      const [perkiraan] = await db.query(
        `SELECT noper, nama FROM perkiraan WHERE kantor = '${kantor}' ORDER BY noper ASC;`
      );
      return new Response({ rows, total_page, perkiraan });
    } catch (error) {
      console.error(error);
      return new Response(error, false);
    }
  } else {
    return token;
  }
};
produkPinjaman.fetchLaporan = async (kantor, tanggal, resort, limit) => {
  try {
    let query;
    query = `SELECT * FROM setsandi_pinj WHERE kantor = '${kantor}' AND tanggal <= '${tanggal}'`;
    if (resort !== "resort") {
      query += ` AND resort = '${resort}'`;
    }
    query += ` ORDER BY sandi ASC`;
    if (limit !== 0) {
      query += ` LIMIT ${limit}`;
    }
    const [rows] = await db.query(query);
    return new Response(rows);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
produkPinjaman.getProduk = async (sandi) => {
  try {
    const [rows] = await db.query(`SELECT * FROM setsandi_pinj WHERE sandi = '${sandi}';`);
    return new Response({ rows }, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
produkPinjaman.postProduk = async (sandi, keterangan, kdhit, pembulatan, rate, periode, adm, prov, jurnal_pokok, jurnal_jasa, jurnal_denda, jurnal_adm, jurnal_prov, jurnal_yadit, jurnal_ppap, isEdit, kantor) => {
  try {
    let rows;
    if (!isEdit) {
      ;
      [rows] = await db.query(
        `INSERT INTO setsandi_pinj(sandi, keterangan, kdhit, pembulatan, rate, periode, adm, prov, jurnal_pokok, jurnal_jasa, jurnal_denda, jurnal_adm, jurnal_prov, jurnal_yadit, jurnal_ppap, kantor) VALUES ('${sandi}', '${keterangan}', '${kdhit}', '${pembulatan}', '${rate}', '${periode}', '${adm}', '${prov}', '${jurnal_pokok}', '${jurnal_jasa}', '${jurnal_denda}', '${jurnal_adm}', '${jurnal_prov}', '${jurnal_yadit}', '${jurnal_ppap}', '${kantor}')`
      );
    } else {
      ;
      [rows] = await db.query(
        `UPDATE setsandi_pinj SET sandi = '${sandi}', keterangan = '${keterangan}', kdhit = '${kdhit}', pembulatan = '${pembulatan}', rate = '${rate}', periode = '${periode}', adm = '${adm}', prov = '${prov}', jurnal_pokok = '${jurnal_pokok}', jurnal_jasa = '${jurnal_jasa}', jurnal_denda = '${jurnal_denda}', jurnal_adm = '${jurnal_adm}', jurnal_prov = '${jurnal_prov}', jurnal_yadit = '${jurnal_yadit}', jurnal_ppap = '${jurnal_ppap}'`
      );
    }
    return new Response(rows);
  } catch (error) {
    console.log("error models", error);
    return new Response(error, false);
  }
};
produkPinjaman.deleteProduk = async (sandi, kantor) => {
  try {
    await db.query(`DELETE FROM setsandi_pinj WHERE sandi = '${sandi}' AND kantor = '${kantor}';`);
    return new Response({ message: "success delete setsandi_pinj" }, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
const daftarAnggota = {};
daftarAnggota.fetchAnggota = async (search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed, kantor) => {
  const token = await isTokenValid();
  if (token.success) {
    var sortMode = sort_mode ? "ASC" : "DESC";
    let row_number;
    if (page_number < 2) {
      row_number = 0;
    } else {
      row_number = (page_number - 1) * total_row_displayed;
    }
    try {
      let query = `SELECT COUNT(*) AS total FROM anggota WHERE kantor = '${kantor}'`;
      if (search_data !== "") {
        query += ` AND ${search_type} LIKE '%${search_data}%'`;
      }
      const [data] = await db.query(query);
      let total_page;
      if (data[0].total % total_row_displayed == 0) {
        total_page = parseInt(data[0].total / total_row_displayed);
      } else {
        total_page = parseInt(data[0].total / total_row_displayed) + 1;
      }
      query = `SELECT * FROM anggota WHERE kantor = '${kantor}'`;
      if (search_data !== "") {
        query += ` AND ${search_type} LIKE '%${search_data}%'`;
      }
      query += ` ORDER BY ${sort_by} ${sortMode} LIMIT ${row_number}, ${total_row_displayed};`;
      const [rows] = await db.query(query);
      return new Response({ rows, total_page });
    } catch (error) {
      console.error(error);
      return new Response(error, false);
    }
  } else {
    return token;
  }
};
daftarAnggota.fetchLaporan = async (kantor, tanggal, resort, limit) => {
  const token = await isTokenValid();
  if (token.success) {
    try {
      let query;
      query = `SELECT * FROM anggota WHERE kantor = '${kantor}' AND tanggal <= '${tanggal}'`;
      if (resort !== "resort") {
        query += ` AND resort = '${resort}'`;
      }
      query += ` ORDER BY iddata ASC`;
      if (limit !== 0) {
        query += ` LIMIT ${limit}`;
      }
      const [rows] = await db.query(query);
      return new Response(rows);
    } catch (error) {
      console.error(error);
      return new Response(error, false);
    }
  } else {
    return token;
  }
};
daftarAnggota.getAnggota = async (iddata) => {
  try {
    const [rows] = await db.query(`SELECT * FROM anggota WHERE iddata = ${iddata};`);
    return new Response({ rows }, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
daftarAnggota.postAnggota = async (iddata, tanggal, no_anggota, no_ktp, no_kk, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, alamat, rt, rw, kelurahan, kecamatan, kota, pendamping, pekerjaan, no_telepon, resort, imageFoto, imageTTD, imagePA, kantor) => {
  try {
    let rows;
    if (imageFoto !== null || imageTTD !== null || imagePA !== null) {
      if (iddata == "") {
        ;
        [rows] = await db.query(
          `INSERT INTO anggota(cif, tanggal, nokK, noktp, nama, tempatlhr, tanggallhr, jeniskl, alamat, rt, desa, kecamatan, kota, agama, pekerjaan, statuskawin, phone, foto, tandatangan, paraf, resort, kantor) VALUES ('${no_anggota}', '${tanggal}', '${no_kk}', '${no_ktp}', '${nama_lengkap}', '${tempat_lahir}', '${tanggal_lahir}', '${jenis_kelamin}', '${alamat}', '${rt}', '${kelurahan}', '${kecamatan}', '${kota}', '${agama}', '${pekerjaan}', '${pendamping}', '${no_telepon}','${new Blob(
            [imageFoto],
            { type: imageFoto.type }
          )}','${new Blob([imageTTD], { type: imageTTD.type })}','${new Blob([imagePA], {
            type: imagePA.type
          })}', '${resort}', '${kantor}')`
        );
      } else {
        ;
        [rows] = await db.query(
          `UPDATE anggota SET cif = '${no_anggota}', tanggal = '${tanggal}', nokK = '${no_kk}', noktp = '${no_ktp}', nama = '${nama_lengkap}', tempatlhr = '${tempat_lahir}', tanggallhr = '${tanggal_lahir}', jeniskl = '${jenis_kelamin}', alamat = '${alamat}', rt = '${rt}/${rw}', desa = '${kelurahan}', kecamatan = '${kecamatan}', kota = '${kota}', agama = '${agama}', pekerjaan = '${pekerjaan}', statuskawin = '${pendamping}', phone = '${no_telepon}', foto = ${new Blob(
            [imageFoto],
            { type: imageFoto.type }
          )}', tandatangan = '${new Blob([imageTTD], {
            type: imageTTD.type
          })}', paraf = '${new Blob([imagePA], {
            type: imagePA.type
          })}', resort = '${resort}' WHERE iddata = '${iddata}'`
        );
      }
    } else {
      if (iddata == "") {
        ;
        [rows] = await db.query(
          `INSERT INTO anggota(cif, tanggal, nokK, noktp, nama, tempatlhr, tanggallhr, jeniskl, alamat, rt, desa, kecamatan, kota, agama, pekerjaan, statuskawin, phone, resort) VALUES ('${no_anggota}', '${tanggal}', '${no_kk}', '${no_ktp}', '${nama_lengkap}', '${tempat_lahir}', '${tanggal_lahir}', '${jenis_kelamin}', '${alamat}', '${rt}', '${kelurahan}', '${kecamatan}', '${kota}', '${agama}', '${pekerjaan}', '${pendamping}', '${no_telepon}', '${resort}')`
        );
      } else {
        ;
        [rows] = await db.query(
          `UPDATE anggota SET cif = '${no_anggota}', tanggal = '${tanggal}', nokK = '${no_kk}', noktp = '${no_ktp}', nama = '${nama_lengkap}', tempatlhr = '${tempat_lahir}', tanggallhr = '${tanggal_lahir}', jeniskl = '${jenis_kelamin}', alamat = '${alamat}', rt = '${rt}/${rw}', desa = '${kelurahan}', kecamatan = '${kecamatan}', kota = '${kota}', agama = '${agama}', pekerjaan = '${pekerjaan}', statuskawin = '${pendamping}', phone = '${no_telepon}', resort = '${resort}' WHERE iddata = '${iddata}'`
        );
      }
    }
    return new Response(rows);
  } catch (error) {
    console.error("error models", error);
    return new Response(error, false);
  }
};
daftarAnggota.deleteAnggota = async (iddata) => {
  try {
    await db.query(`DELETE FROM anggota WHERE iddata = ${iddata};`);
    return new Response({ message: "success delete anggota" }, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
const historyAnggota = {};
historyAnggota.fetchAnggota = async (search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed, kantor) => {
  const token = await isTokenValid();
  if (token.success) {
    var sortMode = sort_mode ? "ASC" : "DESC";
    let row_number;
    if (page_number < 2) {
      row_number = 0;
    } else {
      row_number = (page_number - 1) * total_row_displayed;
    }
    try {
      let query = `SELECT COUNT(*) AS total FROM anggota WHERE tglbht != '0000-00-00' AND kantor = '${kantor}'`;
      if (search_data !== "") {
        query += ` AND ${search_type} LIKE '%${search_data}%'`;
      }
      const [data] = await db.query(query);
      let total_page;
      if (data[0].total % total_row_displayed == 0) {
        total_page = parseInt(data[0].total / total_row_displayed);
      } else {
        total_page = parseInt(data[0].total / total_row_displayed) + 1;
      }
      query = `SELECT * FROM anggota WHERE tglbht != '0000-00-00' AND kantor = '${kantor}'`;
      if (search_data !== "") {
        query += ` AND ${search_type} LIKE '%${search_data}%'`;
      }
      query += ` ORDER BY ${sort_by} ${sortMode} LIMIT ${row_number}, ${total_row_displayed};`;
      const [rows] = await db.query(query);
      return new Response({ rows, total_page });
    } catch (error) {
      console.log(error);
      return new Response(error, false);
    }
  } else {
    return token;
  }
};
historyAnggota.getAnggota = async (iddata) => {
  try {
    const [rows] = await db.query(`SELECT * FROM anggota WHERE iddata = ${iddata};`);
    return new Response({ rows }, true);
  } catch (error) {
    console.log(error);
    return new Response(error, false);
  }
};
historyAnggota.postAnggota = async (tanggal, no_anggota, no_ktp, no_kk, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, agama, alamat, rt, rw, kelurahan, kecamatan, kota, pendamping, pekerjaan, no_telepon, resort, imageFoto, imageTTD, imagePA) => {
  try {
    console.log(
      "POST AGT",
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
      imagePA.path
    );
    const [rows] = await db.query(
      `INSERT INTO anggota(cif, tanggal, nokK, noktp, nama, tempatlhr, tanggallhr, jeniskl, alamat, rt, desa, kecamatan, kota, agama, pekerjaan, statuskawin, phone, foto, tandatangan, paraf, resort) VALUES ('${no_anggota}', '${tanggal}', '${no_kk}', '${no_ktp}', '${nama_lengkap}', '${tempat_lahir}', '${tanggal_lahir}', '${jenis_kelamin}', '${alamat}', '${rt}', '${kelurahan}', '${kecamatan}', '${kota}', '${agama}', '${pekerjaan}', '${pendamping}', '${no_telepon}', LOAD_FILE('${imageFoto.path}'), LOAD_FILE('${imageTTD.path}'), LOAD_FILE('${imagePA.path}'), '${resort}')`
    );
    return new Response(rows);
  } catch (error) {
    console.log("error models", error);
    return new Response(error, false);
  }
};
historyAnggota.deleteAnggota = async (iddata) => {
  try {
    await db.query(`DELETE FROM anggota WHERE iddata = ${iddata};`);
    return new Response({ message: "success delete anggota" }, true);
  } catch (error) {
    console.log(error);
    return new Response(error, false);
  }
};
const jurnalTransaksi = {};
jurnalTransaksi.fetchJurnal = async (search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed, kantor) => {
  const token = await isTokenValid();
  if (token.success) {
    var sortMode = sort_mode ? "ASC" : "DESC";
    let row_number;
    if (page_number < 2) {
      row_number = 0;
    } else {
      row_number = (page_number - 1) * total_row_displayed;
    }
    try {
      let query = `SELECT COUNT(*) AS total FROM jurnal WHERE kantor = '${kantor}'`;
      if (search_data !== "") {
        query += ` AND ${search_type} LIKE '%${search_data}%'`;
      }
      const [data] = await db.query(query);
      let total_page;
      if (data[0].total % total_row_displayed == 0) {
        total_page = parseInt(data[0].total / total_row_displayed);
      } else {
        total_page = parseInt(data[0].total / total_row_displayed) + 1;
      }
      query = `SELECT * FROM jurnal WHERE kantor = '${kantor}'`;
      if (search_data !== "") {
        query += ` AND ${search_type} LIKE '%${search_data}%'`;
      }
      query += ` ORDER BY ${sort_by} ${sortMode} LIMIT ${row_number}, ${total_row_displayed};`;
      const [rows] = await db.query(query);
      const [perkiraan] = await db.query(`SELECT noper, nama FROM perkiraan ORDER BY noper ASC;`);
      return new Response({ rows, total_page, perkiraan });
    } catch (error) {
      console.error(error);
      return new Response(error, false);
    }
  } else {
    return token;
  }
};
jurnalTransaksi.getperkiraanJurnal = async (noper) => {
  try {
    const [rows] = await db.query(`SELECT nama FROM perkiraan WHERE noper = ${noper};`);
    return new Response(rows, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
jurnalTransaksi.getJurnal = async (bukti) => {
  try {
    const [rows] = await db.query(`SELECT * FROM jurnal WHERE BUKTI = ${bukti};`);
    return new Response({ rows }, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
jurnalTransaksi.createJurnal = async (TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH, KANTOR) => {
  try {
    const [rows] = await db.query(
      `INSERT INTO jurnal(TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH, KANTOR) VALUES ('${TANGGAL}', '${BUKTI}', '${NOPER}', '${KETERANGAN}', '${JUMLAH}', '${KANTOR}')`
    );
    return new Response(rows);
  } catch (error) {
    console.error("error models", error);
    return new Response(error, false);
  }
};
jurnalTransaksi.updateJurnal = async (idtrans, TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH) => {
  try {
    const [rows] = await db.query(
      `UPDATE jurnal SET TANGGAL = '${TANGGAL}', BUKTI = '${BUKTI}', NOPER = '${NOPER}', KETERANGAN = '${KETERANGAN}', JUMLAH = '${JUMLAH}' WHERE idtrans = '${idtrans}'`
    );
    return new Response(rows);
  } catch (error) {
    console.error("error models", error);
    return new Response(error, false);
  }
};
jurnalTransaksi.deleteJurnal = async (idtrans) => {
  try {
    await db.query(`DELETE FROM jurnal WHERE idtrans = ${idtrans};`);
    return new Response({ message: "success delete jurnal" }, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
const perkiraanAkuntansi = {};
perkiraanAkuntansi.fetchPerkiraan = async (search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed, kantor) => {
  const token = await isTokenValid();
  if (token.success) {
    var sortMode = sort_mode ? "ASC" : "DESC";
    let row_number;
    if (page_number < 2) {
      row_number = 0;
    } else {
      row_number = (page_number - 1) * total_row_displayed;
    }
    try {
      let query = `SELECT COUNT(*) AS total FROM perkiraan WHERE kantor = '${kantor}'`;
      if (search_data !== "") {
        query += ` AND ${search_type} LIKE '%${search_data}%'`;
      }
      const [data] = await db.query(query);
      let total_page;
      if (data[0].total % total_row_displayed == 0) {
        total_page = parseInt(data[0].total / total_row_displayed);
      } else {
        total_page = parseInt(data[0].total / total_row_displayed) + 1;
      }
      query = `SELECT * FROM perkiraan WHERE kantor = '${kantor}'`;
      if (search_data !== "") {
        query += ` AND ${search_type} LIKE '%${search_data}%'`;
      }
      query += ` ORDER BY ${sort_by} ${sortMode} LIMIT ${row_number}, ${total_row_displayed};`;
      const [rows] = await db.query(query);
      return new Response({ rows, total_page });
    } catch (error) {
      console.error(error);
      return new Response(error, false);
    }
  } else {
    return token;
  }
};
perkiraanAkuntansi.getperkiraanAkuntansi = async (noper) => {
  try {
    const [rows] = await db.query(`SELECT * FROM perkiraan WHERE noper = ${noper};`);
    return new Response(rows, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
perkiraanAkuntansi.getPerkiraan = async (bukti) => {
  try {
    const [rows] = await db.query(`SELECT * FROM perkiraan WHERE BUKTI = ${bukti};`);
    return new Response({ rows }, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
perkiraanAkuntansi.createPerkiraan = async (noper, nama, level, bukubantu, kelompok, kelompok_data, detail, kantor) => {
  try {
    const [rows] = await db.query(
      `INSERT INTO perkiraan(noper, nama, level, bukubantu, kel, keldata, detail, font, kantor) VALUES ('${noper}', '${nama}', '${level}', '${bukubantu}', '${kelompok}', '${kelompok_data}', '${detail}', '', '${kantor}')`
    );
    return new Response(rows);
  } catch (error) {
    console.error("error models", error);
    return new Response(error, false);
  }
};
perkiraanAkuntansi.updatePerkiraan = async (noper, nama, level, bukubantu, kelompok, kelompok_data, detail) => {
  try {
    const [rows] = await db.query(
      `UPDATE perkiraan SET nama = '${nama}', level = '${level}', bukubantu = '${bukubantu}', kel = '${kelompok}', keldata = '${kelompok_data}', detail = '${detail}' WHERE noper = '${noper}'`
    );
    return new Response(rows);
  } catch (error) {
    console.error("error models", error);
    return new Response(error, false);
  }
};
perkiraanAkuntansi.deletePerkiraan = async (noper) => {
  try {
    await db.query(`DELETE FROM perkiraan WHERE noper = ${noper};`);
    return new Response({ message: "success delete perkiraan" }, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
const api = {
  oAuth,
  produkPinjaman,
  daftarAnggota,
  historyAnggota,
  jurnalTransaksi,
  perkiraanAkuntansi
};
if (process.contextIsolated) {
  try {
    electron.contextBridge.exposeInMainWorld("electron", preload.electronAPI);
    electron.contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  window.electron = preload.electronAPI;
  window.api = api;
}