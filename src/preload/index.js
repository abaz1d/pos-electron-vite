import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import produkPinjaman from '../models/Setting/Pinjaman/produkPinjaman'
import daftarAnggota from '../models/Transaksi/Keanggotaan/daftarAnggota'
import historyAnggota from '../models/Transaksi/Keanggotaan/historyAnggota'
import jurnalTransaksi from '../models/Transaksi/Akuntansi/jurnalTransaksi'
import perkiraanAkuntansi from '../models/Transaksi/Akuntansi/perkiraanAkuntansi'

// Custom APIs for renderer
const api = {
  produkPinjaman,
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
