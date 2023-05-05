import { defineStore } from 'pinia'
const request = window.api.produkPinjaman

export const useProdukPinjamanStore = defineStore({
  id: 'produk-pinjaman',
  state: () => ({
    rawItems: []
  }),
  getters: {
    items: (state) => state.rawItems
  },
  actions: {
    async readItem(search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed) {
      try {
        const data = await request.fetchProduk(
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
    async readLaporan(kantor, tanggal, resort, limit) {
      try {
        const data = await request.fetchLaporan(kantor, tanggal, resort, limit)
        if (data.success) {
          this.rawItems = data.data
          // return data.data.total_page
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async getItem(sandi) {
      try {
        const data = await request.getProduk(sandi)
        if (data.success) {
          return data.data.rows[0]
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async postItem(
      sandi,
      keterangan,
      kdhit,
      pembulatan,
      rate,
      periode,
      adm,
      prov,
      jurnal_pokok,
      jurnal_jasa,
      jurnal_denda,
      jurnal_adm,
      jurnal_prov,
      jurnal_yadit,
      jurnal_ppap,
      isEdit
    ) {
      try {
        //const iddata = Date.now()
        this.rawItems.push({
          sandi,
          keterangan,
          kdhit,
          pembulatan,
          rate,
          periode,
          adm,
          prov,
          jurnal_pokok,
          jurnal_jasa,
          jurnal_denda,
          jurnal_adm,
          jurnal_prov,
          jurnal_yadit,
          jurnal_ppap
        })
        //console.log(
        await request.postProduk(
          sandi,
          keterangan,
          kdhit,
          pembulatan,
          rate,
          periode,
          adm,
          prov,
          jurnal_pokok,
          jurnal_jasa,
          jurnal_denda,
          jurnal_adm,
          jurnal_prov,
          jurnal_yadit,
          jurnal_ppap,
          isEdit
        )
      } catch (error) {
        throw new Error(error)
      }
    },
    async removeItem(iddata) {
      try {
        this.rawItems = this.rawItems.filter((item) => item.iddata !== iddata)
        const data = await request.deleteProduk(iddata)
      } catch (error) {
        throw new Error(error)
      }
    }
  }
})
