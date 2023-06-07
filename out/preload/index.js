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
    const [rows] = await db.query(`SELECT id, nama, password FROM user WHERE nama = ?`, [
      input_user
    ]);
    data = rows;
    if (rows.length == 0) {
      console.log("check userid");
      const [rows2] = await db.query("SELECT id, nama, password FROM user WHERE userid = ?", [
        input_user
      ]);
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
        const [rows22] = await db.query(
          `SELECT id, nama, userid, kantor, token FROM user WHERE id = ?;`,
          [data[0].id]
        );
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
        const [rows2] = await db.query(
          `SELECT id, nama, userid, kantor, token FROM user WHERE id = ?;`,
          [data[0].id]
        );
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
      let query = `SELECT COUNT(id) AS total FROM setsandi_pinj WHERE kantor = '${kantor}'`;
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
      query = `SELECT id, sandi, keterangan, TGLINP, kantor FROM setsandi_pinj WHERE kantor = '${kantor}'`;
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
produkPinjaman.getProduk = async (id) => {
  try {
    const [rows] = await db.query(`SELECT * FROM setsandi_pinj WHERE id = '${id}';`);
    return new Response({ rows }, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
produkPinjaman.postProduk = async (id, sandi, keterangan, kdhit, pembulatan, rate, periode, adm, prov, jurnal_pokok, jurnal_jasa, jurnal_denda, jurnal_adm, jurnal_prov, jurnal_yadit, jurnal_ppap, isEdit, kantor) => {
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
        `UPDATE setsandi_pinj SET sandi = '${sandi}', keterangan = '${keterangan}', kdhit = '${kdhit}', pembulatan = '${pembulatan}', rate = '${rate}', periode = '${periode}', adm = '${adm}', prov = '${prov}', jurnal_pokok = '${jurnal_pokok}', jurnal_jasa = '${jurnal_jasa}', jurnal_denda = '${jurnal_denda}', jurnal_adm = '${jurnal_adm}', jurnal_prov = '${jurnal_prov}', jurnal_yadit = '${jurnal_yadit}', jurnal_ppap = '${jurnal_ppap}' WHERE id = '${id}'`
      );
    }
    return new Response(rows);
  } catch (error) {
    console.log("error models", error);
    return new Response(error, false);
  }
};
produkPinjaman.deleteProduk = async (id, kantor) => {
  try {
    await db.query(`DELETE FROM setsandi_pinj WHERE id = '${id}' AND kantor = '${kantor}';`);
    return new Response({ message: "success delete setsandi_pinj" }, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
const produkSimpata = {};
produkSimpata.fetchProduk = async (search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed, kantor) => {
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
      let query = `SELECT COUNT(id) AS total FROM setsandi_tab WHERE kantor = '${kantor}' AND jenis = '1'`;
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
      query = `SELECT id, SANDI, KETERANGAN, TGLINP, kantor FROM setsandi_tab WHERE kantor = '${kantor}' AND jenis = '1'`;
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
produkSimpata.fetchLaporan = async (kantor, tanggal, resort, limit) => {
  try {
    let query;
    query = `SELECT * FROM setsandi_tab WHERE kantor = '${kantor}' AND tanggal <= '${tanggal}'`;
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
produkSimpata.getProduk = async (id) => {
  try {
    const [rows] = await db.query(`SELECT * FROM setsandi_tab WHERE id = '${id}';`);
    return new Response({ rows }, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
produkSimpata.postProduk = async (id, SANDI, KETERANGAN, OPTHARI, VER, A_RATE, A_OPTADM, A_ADM, A_ADM1, A_NOMI_ADM1, P_RATE, P_OPTADM, P_ADM, P_ADM1, P_NOMI_ADM1, SALDOMINIMAL, BATASBUNGA, OPTPASIF, HARIPASIF, NOMIPASIF, BATASPAJAK, PAJAK, ANTARBANK, JURNALTAB, JURNALUTANGBG, JURNALBUNGA, JURNALADM, JURNALADMTUTUP, JURNALPAJAK, JURNALKSD, isEdit, kantor) => {
  try {
    let rows;
    console.log("edit", isEdit);
    if (!isEdit) {
      ;
      [rows] = await db.query(
        `INSERT INTO setsandi_tab(SANDI, KETERANGAN, OPTHARI, VER, A_RATE, A_OPTADM, A_ADM, A_ADM1, A_NOMI_ADM1, P_RATE, P_OPTADM, P_ADM, P_ADM1, P_NOMI_ADM1, SALDOMINIMAL,BATASBUNGA,OPTPASIF,HARIPASIF,NOMIPASIF,BATASPAJAK,PAJAK,ANTARBANK,JURNALTAB,JURNALUTANGBG,JURNALBUNGA,JURNALADM,JURNALADMTUTUP,JURNALPAJAK,JURNALKSD, jenis, kantor) VALUES ('${SANDI}', '${KETERANGAN}', '${OPTHARI}', '${VER}', '${A_RATE}', '${A_OPTADM}', '${A_ADM}', '${A_ADM1}', '${A_NOMI_ADM1}', '${P_RATE}', '${P_OPTADM}', '${P_ADM}', '${P_ADM1}', '${P_NOMI_ADM1}', '${SALDOMINIMAL}','${BATASBUNGA}','${OPTPASIF}','${HARIPASIF}','${NOMIPASIF}','${BATASPAJAK}','${PAJAK}','${ANTARBANK}','${JURNALTAB}','${JURNALUTANGBG}','${JURNALBUNGA}','${JURNALADM}','${JURNALADMTUTUP}','${JURNALPAJAK}','${JURNALKSD}', '1', '${kantor}')`
      );
    } else {
      console.log("edit");
      [rows] = await db.query(
        `UPDATE setsandi_tab SET SANDI = '${SANDI}', KETERANGAN = '${KETERANGAN}', OPTHARI = '${OPTHARI}', VER = '${VER}', A_RATE = '${A_RATE}', A_OPTADM = '${A_OPTADM}', A_ADM = '${A_ADM}', A_ADM1 = '${A_ADM1}', A_NOMI_ADM1 = '${A_NOMI_ADM1}', P_RATE = '${P_RATE}', P_OPTADM = '${P_OPTADM}', P_ADM = '${P_ADM}', P_ADM1 = '${P_ADM1}', P_NOMI_ADM1 = '${P_NOMI_ADM1}', SALDOMINIMAL = '${SALDOMINIMAL}', BATASBUNGA ='${BATASBUNGA}',OPTPASIF ='${OPTPASIF}',HARIPASIF ='${HARIPASIF}',NOMIPASIF ='${NOMIPASIF}',BATASPAJAK ='${BATASPAJAK}',PAJAK ='${PAJAK}',ANTARBANK ='${ANTARBANK}',JURNALTAB ='${JURNALTAB}',JURNALUTANGBG ='${JURNALUTANGBG}',JURNALBUNGA ='${JURNALBUNGA}',JURNALADM ='${JURNALADM}',JURNALADMTUTUP ='${JURNALADMTUTUP}',JURNALPAJAK ='${JURNALPAJAK}',JURNALKSD ='${JURNALKSD}' WHERE id = '${id}'`
      );
    }
    return new Response(rows);
  } catch (error) {
    console.log("error models", error);
    return new Response(error, false);
  }
};
produkSimpata.deleteProduk = async (id, kantor) => {
  try {
    await db.query(`DELETE FROM setsandi_tab WHERE id = '${id}' AND kantor = '${kantor}';`);
    return new Response({ message: "success delete setsandi_tab" }, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
const caraHitungPinjaman = {};
const daftarPinjaman = {};
daftarPinjaman.fetchPinjaman = async (search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed, kantor) => {
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
      let query = `SELECT COUNT(p.norek) AS total FROM pinjaman p left join anggota a on p.cif = a.cif WHERE p.tgllunas = '0000-00-00' AND p.kantor = '${kantor}'`;
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
      query = `SELECT a.nama, a.alamat, a.kecamatan, a.kota, p.tanggal, p.norek, p.cif, p.pokok, p.marketing, p.opt FROM pinjaman p left join anggota a on p.cif = a.cif WHERE p.tgllunas = '0000-00-00' AND p.kantor = '${kantor}'`;
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
daftarPinjaman.fetchAnggota = async (search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed, kantor) => {
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
      let query = `SELECT COUNT(*) AS total FROM anggota WHERE tglbht = '0000-00-00' AND kantor = '${kantor}'`;
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
      query = `SELECT iddata, cif, noktp, nokK, nama, alamat, desa, kecamatan, kota, statuskawin FROM anggota WHERE tglbht = '0000-00-00' AND kantor = '${kantor}'`;
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
daftarPinjaman.getNasabah = async (cif) => {
  const [rows] = await db.query(
    `SELECT a.nama, a.statuskawin, a.desa, a.alamat, a.kecamatan, a.kota FROM pinjaman p left join anggota a on p.cif = a.cif WHERE p.tgllunas = '0000-00-00' AND p.cif = ${cif};`
  );
  if (rows.length > 0) {
    return new Response({ message: "Nasabah ini masih memiliki Pinjaman Aktif" }, false);
  } else {
    const [rows2] = await db.query(
      `SELECT nama, statuskawin, desa, alamat, kecamatan, kota FROM anggota WHERE cif = ${cif};`
    );
    if (rows2.length > 0) {
      return new Response({ rows: rows2 }, true);
    } else {
      return new Response({ message: "Tidak ditemukan Nasabah dengan ID tersebut" }, false);
    }
  }
};
daftarPinjaman.setupPinjaman = async (kantor) => {
  try {
    const [produk_pinjaman] = await db.query(
      `SELECT * FROM setsandi_pinj WHERE kantor = '${kantor}'`
    );
    const [marketing] = await db.query(
      `SELECT sandi, keterangan FROM setsandi WHERE kantor = '${kantor}' AND kode = 'C002'`
    );
    return new Response({ produk_pinjaman, marketing });
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
daftarPinjaman.fetchLaporan = async (kantor, tanggal, resort, limit) => {
  const token = await isTokenValid();
  if (token.success) {
    try {
      let query;
      query = `SELECT * FROM pinjaman WHERE kantor = '${kantor}' AND tanggal <= '${tanggal}'`;
      if (resort !== "resort") {
        query += ` AND resort = '${resort}'`;
      }
      query += ` ORDER BY norek ASC`;
      if (limit !== "0") {
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
daftarPinjaman.getPinjaman = async (norek) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, a.nama, a.statuskawin, a.desa, a.alamat, a.kecamatan, a.kota FROM pinjaman p left join anggota a on p.cif = a.cif WHERE p.norek = ${norek};`
    );
    return new Response(rows, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
daftarPinjaman.postPinjaman = async (tanggal, cif, nopk, norek, jenis, marketing, pokok, rate, kdhit, tglmulai, lama, adm, provisi, tgljtempo, tgl_alih_bunga, tglvaluta, tgllunas, pot_pokok, pot_bunga, sisapokok, sisabunga, isEdit, kantor, opt) => {
  try {
    let rows;
    if (!isEdit) {
      console.log("ADDING");
      [rows] = await db.query(
        `INSERT INTO pinjaman(tanggal, cif, nopk, norek, jenis, marketing, pokok, rate, kdhit, tglmulai, lama, adm, provisi, tgljtempo, tglvaluta, tgllunas, pot_pokok, pot_bunga, sisapokok, sisabunga, kantor, opt) VALUES (STR_TO_DATE('${tanggal}','%d-%m-%Y'), '${cif}', '${nopk}', '${norek}', '${jenis}', '${marketing + " "}', '${pokok}', '${rate}', '${kdhit}', STR_TO_DATE('${tglmulai}','%Y-%m-%d'), '${lama}', '${adm}', '${provisi}', STR_TO_DATE('${tgljtempo}','%d-%m-%Y'), '${tglvaluta}', '${tgllunas}', '${pot_pokok}', '${pot_bunga}', '${sisapokok}', '${sisabunga}', '${kantor}', '${opt}')`
      );
    } else {
      console.log("EDITING");
      [rows] = await db.query(
        `UPDATE pinjaman SET tanggal = STR_TO_DATE('${tanggal}','%d-%m-%Y'), cif = '${cif}', nopk = '${nopk}', norek = '${norek}', jenis = '${jenis}', marketing = '${marketing}', pokok = '${pokok}', rate = '${rate}', kdhit = '${kdhit}', tglmulai = STR_TO_DATE('${tglmulai}','%Y-%m-%d'), lama = '${lama}', adm = '${adm}', provisi = '${provisi}', tgljtempo = STR_TO_DATE('${tgljtempo}','%d-%m-%Y'), tglvaluta = '${tglvaluta}',tgllunas = '${tgllunas}',pot_pokok = '${pot_pokok}',pot_bunga = '${pot_bunga}',sisapokok = '${sisapokok}',sisabunga = '${sisabunga}',kantor = '${kantor}', opt = '${opt}' WHERE norek = '${norek}'`
      );
    }
    return new Response(rows);
  } catch (error) {
    console.error("error models", error);
    return new Response(error, false);
  }
};
daftarPinjaman.deletePinjaman = async (norek) => {
  try {
    await db.query(`DELETE FROM pinjaman WHERE norek = ${norek};`);
    return new Response({ message: "success delete pinjaman" }, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
const daftarSimpata = {};
daftarSimpata.fetchSimpata = async (search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed, kantor) => {
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
      let query = `SELECT COUNT(p.cif) AS total FROM simpanan p left join anggota a on p.cif = a.cif WHERE p.produk = '002' AND p.tgltutup = '0000-00-00' AND p.kantor = '${kantor}'`;
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
      query = `SELECT a.nama, a.alamat, a.kecamatan, a.kota, p.tanggal, p.norek, p.cif, p.pokok, p.marketing, p.saldo FROM simpanan p left join anggota a on p.cif = a.cif WHERE p.produk = '002' AND p.tgltutup = '0000-00-00' AND p.kantor = '${kantor}'`;
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
daftarSimpata.fetchAnggota = async (search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed, kantor) => {
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
      let query = `SELECT COUNT(*) AS total FROM anggota WHERE tglbht = '0000-00-00' AND kantor = '${kantor}'`;
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
      query = `SELECT iddata, cif, noktp, nokK, nama, alamat, desa, kecamatan, kota, statuskawin FROM anggota WHERE tglbht = '0000-00-00' AND kantor = '${kantor}'`;
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
daftarSimpata.getNasabah = async (cif) => {
  const [rows] = await db.query(
    `SELECT a.nama, a.statuskawin, a.desa, a.alamat, a.kecamatan, a.kota FROM simpanan p left join anggota a on p.cif = a.cif WHERE p.tgltutup = '0000-00-00' AND p.cif = ${cif};`
  );
  if (rows.length > 0) {
    return new Response({ message: "Nasabah ini masih memiliki Simpata Aktif" }, false);
  } else {
    const [rows2] = await db.query(
      `SELECT nama, statuskawin, desa, alamat, kecamatan, kota FROM anggota WHERE cif = ${cif};`
    );
    if (rows2.length > 0) {
      return new Response({ rows: rows2 }, true);
    } else {
      return new Response({ message: "Tidak ditemukan Nasabah dengan ID tersebut" }, false);
    }
  }
};
daftarSimpata.setupSimpata = async (kantor) => {
  try {
    const [produk_simpanan] = await db.query(
      `SELECT * FROM setsandi_tab WHERE kantor = '${kantor}'`
    );
    const [jenis_simpanan] = await db.query(
      `SELECT sandi, keterangan FROM setsandi WHERE kantor = '${kantor}' AND kode = 'S000'`
    );
    return new Response({ produk_simpanan, jenis_simpanan });
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
daftarSimpata.fetchLaporan = async (kantor, tanggal, resort, limit) => {
  const token = await isTokenValid();
  if (token.success) {
    try {
      let query;
      query = `SELECT * FROM simpanan WHERE kantor = '${kantor}' AND tanggal <= '${tanggal}'`;
      if (resort !== "resort") {
        query += ` AND resort = '${resort}'`;
      }
      query += ` ORDER BY norek ASC`;
      if (limit !== "0") {
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
daftarSimpata.getSimpata = async (norek) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, a.nama, a.statuskawin, a.desa, a.alamat, a.kecamatan, a.kota FROM simpanan p left join anggota a on p.cif = a.cif WHERE p.norek = ${norek};`
    );
    return new Response(rows, true);
  } catch (error) {
    console.error(error);
    return new Response(error, false);
  }
};
daftarSimpata.postSimpata = async (tanggal, cif, nobuku, norek, jenis, produk, nama, pendamping, alamat, desa, kecamatan, kota, rate, carahitung, pajak, norek_sma, atas_nama, pokok, jangka_waktu, mulai_tanggal, tanggal_selesai, aro, perpanjangan, saldo, saldo_blokir, max_pengambilan, blokir_check, autodebet_check, catatan_check, petugas, tgl_tutup_rekening, isEdit, kantor) => {
  try {
    let rows;
    console.log(
      tanggal,
      cif,
      nobuku,
      norek,
      jenis,
      produk,
      nama,
      pendamping,
      alamat,
      desa,
      kecamatan,
      kota,
      rate,
      carahitung,
      pajak,
      norek_sma,
      atas_nama,
      pokok,
      jangka_waktu,
      mulai_tanggal,
      tanggal_selesai,
      aro,
      perpanjangan,
      saldo,
      saldo_blokir,
      max_pengambilan,
      blokir_check,
      autodebet_check,
      catatan_check,
      petugas,
      tgl_tutup_rekening,
      isEdit,
      Auth.items.kantor
    );
  } catch (error) {
    console.error("error models", error);
    return new Response(error, false);
  }
};
daftarSimpata.deleteSimpata = async (norek) => {
  try {
    await db.query(`DELETE FROM simpanan WHERE norek = ${norek};`);
    return new Response({ message: "success delete simpanan" }, true);
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
      let query = `SELECT COUNT(iddata) AS total FROM anggota WHERE tglbht = '0000-00-00' AND kantor = '${kantor}'`;
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
      query = `SELECT iddata, cif, tanggal, resort, noktp, nokK, nama, alamat, desa, kecamatan, kota, statuskawin, kantor FROM anggota WHERE tglbht = '0000-00-00' AND kantor = '${kantor}'`;
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
      if (limit !== "0") {
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
    console.log("Add", imageFoto, imageTTD, imagePA, kantor);
    if (imageFoto !== null || imageTTD !== null || imagePA !== null) {
      if (iddata == "") {
        ;
        [rows] = await db.query(
          `INSERT INTO anggota(cif, tanggal, nokK, noktp, nama, tempatlhr, tanggallhr, jeniskl, alamat, rt, desa, kecamatan, kota, agama, pekerjaan, statuskawin, phone, foto, tandatangan, paraf, resort, tglbht, kantor) VALUES ('${no_anggota}', '${tanggal}', '${no_kk}', '${no_ktp}', '${nama_lengkap}', '${tempat_lahir}', '${tanggal_lahir}', '${jenis_kelamin}', '${alamat}', '${rt}/${rw}', '${kelurahan}', '${kecamatan}', '${kota}', '${agama}', '${pekerjaan}', '${pendamping}', '${no_telepon}','${new Blob(
            [imageFoto],
            { type: imageFoto.type }
          )}','${new Blob([imageTTD], { type: imageTTD.type })}','${new Blob([imagePA], {
            type: imagePA.type
          })}', '${resort}', '0000-00-00', '${kantor}')`
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
          `INSERT INTO anggota(cif, tanggal, nokK, noktp, nama, tempatlhr, tanggallhr, jeniskl, alamat, rt, desa, kecamatan, kota, agama, pekerjaan, statuskawin, phone, resort, tglbht, kantor) VALUES ('${no_anggota}', '${tanggal}', '${no_kk}', '${no_ktp}', '${nama_lengkap}', '${tempat_lahir}', '${tanggal_lahir}', '${jenis_kelamin}', '${alamat}', '${rt}/${rw}', '${kelurahan}', '${kecamatan}', '${kota}', '${agama}', '${pekerjaan}', '${pendamping}', '${no_telepon}', '${resort}', '0000-00-00', '${kantor}')`
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
      let query = `SELECT COUNT(iddata) AS total FROM anggota WHERE tglbht != '0000-00-00' AND kantor = '${kantor}'`;
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
      query = `SELECT iddata, cif, tanggal, resort, noktp, nokK, nama, alamat, desa, kecamatan, kota, statuskawin, kantor FROM anggota WHERE tglbht != '0000-00-00' AND kantor = '${kantor}'`;
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
      let query = `SELECT COUNT(idtrans) AS total FROM jurnal WHERE kantor = '${kantor}'`;
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
      query = `SELECT idtrans, TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH FROM jurnal WHERE kantor = '${kantor}'`;
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
      let query = `SELECT COUNT(noper) AS total FROM perkiraan WHERE kantor = '${kantor}'`;
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
      query = `SELECT noper, nama, kel, bukubantu, keldata, level, font, detail, saldo FROM perkiraan WHERE kantor = '${kantor}'`;
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
  produkSimpata,
  caraHitungPinjaman,
  daftarPinjaman,
  daftarSimpata,
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
