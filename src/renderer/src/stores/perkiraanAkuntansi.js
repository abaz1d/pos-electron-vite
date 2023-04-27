import { defineStore } from 'pinia'
const request = window.api.perkiraanAkuntansi

export const usePerkiraanAkuntansiStore = defineStore({
  id: 'perkiraan-akuntansi',
  state: () => ({
    rawItems: [],
    detailPerkiraan: []
  }),
  getters: {
    items: (state) => state.rawItems,
    perkiraans: (state) => state.detailPerkiraan
  },
  actions: {
    async readItem(search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed) {
      try {
        const data = await request.fetchPerkiraan(
          search_type,
          search_data,
          sort_by,
          sort_mode,
          page_number,
          total_row_displayed
        )
        if (data.success) {
          this.rawItems = data.data.rows
          return data.data.total_page
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async readPerkiraan(noper) {
      try {
        const data = await request.getperkiraanPerkiraan(noper)
        if (data.success && data.data.length > 0) {
          return data.data[0].nama
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async getItem(bukti) {
      try {
        const data = await request.getPerkiraan(bukti)
        if (data.success) {
          this.detailPerkiraan = data.data.rows
          return data.data.rows
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async postItem(idtrans, TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH, isEdit) {
      try {
        let id = Date.now()
        let data
        if (!isEdit && idtrans == '') {
          this.detailPerkiraan.push({
            idtrans: Date.now(),
            TANGGAL,
            BUKTI,
            NOPER,
            KETERANGAN,
            JUMLAH
          })
          data = await request.createPerkiraan(TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH)
          if (data.success) {
            this.detailPerkiraan = this.detailPerkiraan.map((item) => {
              if (item.idtrans === id) {
                return {
                  idtrans: data.data.insertId,
                  TANGGAL: item.TANGGAL,
                  BUKTI: item.BUKTI,
                  NOPER: item.NOPER,
                  KETERANGAN: item.KETERANGAN,
                  JUMLAH: item.JUMLAH
                }
              }
              return item
            })
          }
        } else {
          this.detailPerkiraan = this.detailPerkiraan.map((item) => {
            if (item.idtrans === idtrans) {
              return { idtrans, TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH }
            }
            return item
          })
          data = await request.updatePerkiraan(idtrans, TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH)
        }
        if (data.success) {
          return true
        } else {
          return false
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    removeItem(idtrans) {
      this.detailPerkiraan = this.detailPerkiraan.filter((item) => {
        return item.idtrans !== idtrans
      })
      request.deletePerkiraan(idtrans)
    }
  }
})
