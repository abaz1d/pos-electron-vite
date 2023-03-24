import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { pool, Response } from '../helpers/util.js'
const db = pool.promise()

// Custom APIs for renderer
const api = {}

api.ping = function (req, res) {
  ipcRenderer.invoke('ping')
}

api.fetchProduk = async (e) => {
  try {
    const [rows, fields] = await db.query('SELECT * FROM anggota;')
    return rows
  } catch (error) {
    console.log(error)
  }
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
