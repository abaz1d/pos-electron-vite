import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
//import { currencyFormatter } from '../helpers/util'

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
      // try {
      //   const { data } = await request.get("outlet");
      //   if (data.success) {
      //     this.rawItems = data.data;
      //     return this.rawItems;
      //   }
      // } catch (error) {
      //   throw new Error(error);
      // }
      let db = Object.values(Object.values(window.api)[0])[0]
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
      console.log('Connect', window.api)
    }
  }
})
