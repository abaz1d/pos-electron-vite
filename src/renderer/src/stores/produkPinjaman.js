import { defineStore } from 'pinia'
import router from '@renderer/router'
import { useAuthStore } from './auth'
import Swal from 'sweetalert2'
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
        const Auth = useAuthStore()
        const data = await request.fetchProduk(
          search_type,
          search_data,
          sort_by,
          sort_mode,
          page_number,
          total_row_displayed,
          Auth.items.kantor
        )
        if (data.success) {
          this.rawItems = data.data.rows
          return { total_pages: data.data.total_page, perkiraan: data.data.perkiraan }
        } else if (!data.success && data.data.message == 'token invalid') {
          Swal.fire({
            icon: 'error',
            title: 'Token Invalid',
            text: 'Token Anda Invalid, silahkan login ulang'
          }).then((data) => {
            localStorage.removeItem('user')
            router.push('/auth')
            window.location.reload()
          })
          return { total_pages: [], perkiraan: [] }
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
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async getItem(id) {
      try {
        const data = await request.getProduk(id)
        if (data.success) {
          return data.data.rows[0]
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async postItem(
      id,
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
        const Auth = useAuthStore()
        const produk = {
          id,
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
          kantor: Auth.items.kantor
        }
        if (isEdit) {
          this.rawItems = this.rawItems.map((item) => {
            if (item.id === id) {
              return produk
            }
            return item
          })
        } else {
          this.rawItems.push(produk)
        }
        await request.postProduk(
          id,
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
          isEdit,
          Auth.items.kantor
        )
      } catch (error) {
        throw new Error(error)
      }
    },
    async removeItem(id) {
      try {
        const Auth = useAuthStore()
        this.rawItems = this.rawItems.filter((item) => item.id !== id)
        const data = await request.deleteProduk(id, Auth.items.kantor)
      } catch (error) {
        throw new Error(error)
      }
    }
  }
})
