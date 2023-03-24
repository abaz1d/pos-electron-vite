import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
//import { currencyFormatter } from '../helpers/util'
const ipcRenderer = window.electron.ipcRenderer

export const useDaftarAnggotaStore = defineStore({
  id: 'daftar-anggota',
  state: () => ({
    rawItems: []
  }),
  getters: {
    items: (state) => state.rawItems
  },
  actions: {
    async readItem() {
      //const response = await window.electron.ping()
      try {
        //const data = await
        window.api.fetchProduk().then((data) => {
          console.log('pinia', data)
        })

        //return data
        // if (data.success) {
        //   this.rawItems = data.data;
        //   return this.rawItems;
        // }
      } catch (error) {
        throw new Error(error)
      }
      //ipcRenderer.send('fetch')
      //window.api.fetchProduk()
      // db.query('SELECT * FROM produk;', (err, rows) => {
      //   if (err) console.error(err)
      //   console.log(rows)
      // })
      // db.connect((err) => {
      //   if (err) {
      //     console.log('err database', err)
      //   } else {
      //     console.log('Connect DB successfully')
      //   }
      // })
      //console.log('Connect', ipcRenderer, window.api)
    }
  }
})
