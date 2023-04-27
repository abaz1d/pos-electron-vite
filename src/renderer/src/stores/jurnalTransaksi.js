import { defineStore } from 'pinia'
const request = window.api.jurnalTransaksi

export const useJurnalTransaksiStore = defineStore({
  id: 'jurnal-transaksi',
  state: () => ({
    rawItems: [],
    detailJurnal: []
  }),
  getters: {
    items: (state) => state.rawItems,
    jurnals: (state) => state.detailJurnal
  },
  actions: {
    async readItem(search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed) {
      try {
        const data = await request.fetchJurnal(
          search_type,
          search_data,
          sort_by,
          sort_mode,
          page_number,
          total_row_displayed
        )
        if (data.success) {
          this.rawItems = data.data.rows
          return { total_pages: data.data.total_page, perkiraan: data.data.perkiraan }
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async readPerkiraan(noper) {
      try {
        const data = await request.getperkiraanJurnal(noper)
        if (data.success && data.data.length > 0) {
          return data.data[0].nama
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async getItem(bukti) {
      try {
        const data = await request.getJurnal(bukti)
        if (data.success) {
          this.detailJurnal = data.data.rows
          return data.data.rows
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async postItem(idtrans, TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH, isEdit) {
      try {
        if (!isEdit && idtrans == '') {
          this.detailJurnal.push({ idtrans: Date.now(), TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH })
        } else {
          this.detailJurnal = this.detailJurnal.map((item) => {
            if (item.idtrans === idtrans) {
              return { idtrans, TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH }
            }
            return item
          })
        }
        return true
      } catch (error) {
        throw new Error(error)
      }
    },
    removeItem(idtrans) {
      this.detailJurnal = this.detailJurnal.filter((item) => {
        return item.idtrans !== idtrans
      })
    }
  }
})
