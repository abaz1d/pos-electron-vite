import { defineStore } from 'pinia'
const request = window.api.daftarAnggota

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
      try {
        const data = await request.fetchProduk()
        this.rawItems = data
      } catch (error) {
        throw new Error(error)
      }
    }
  }
})
