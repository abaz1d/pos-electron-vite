import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import oAuth from '../models/oAuth'
import produkPinjaman from '../models/Setting/Pinjaman/produkPinjaman'
import produkSimpata from '../models/Setting/Simpanan/produkSimpata'
import caraHitungPinjaman from '../models/Setting/Pinjaman/caraHitungPinjaman'
import daftarPinjaman from '../models/Transaksi/Pinjaman/daftarPinjaman'
import daftarAnggota from '../models/Transaksi/Keanggotaan/daftarAnggota'
import historyAnggota from '../models/Transaksi/Keanggotaan/historyAnggota'
import jurnalTransaksi from '../models/Transaksi/Akuntansi/jurnalTransaksi'
import perkiraanAkuntansi from '../models/Transaksi/Akuntansi/perkiraanAkuntansi'

// Custom APIs for renderer
const api = {
  oAuth,
  produkPinjaman,
  produkSimpata,
  caraHitungPinjaman,
  daftarPinjaman,
  daftarAnggota,
  historyAnggota,
  jurnalTransaksi,
  perkiraanAkuntansi
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}
