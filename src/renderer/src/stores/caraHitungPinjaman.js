import { defineStore } from 'pinia'
import router from '@renderer/router'
import { useAuthStore } from './auth'
import Swal from 'sweetalert2'
const request = window.api.caraHitungPinjaman

export const useCaraHitungPinjamanStore = defineStore({
  id: 'cara-hitung-pinjaman',
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
        // const data = await request.fetchProduk(
        //   search_type,
        //   search_data,
        //   sort_by,
        //   sort_mode,
        //   page_number,
        //   total_row_displayed,
        //   Auth.items.kantor
        // )
        const data = {
          success: true,
          data: {
            rows: [
              {
                id: '1',
                kode: 'P002',
                sandi: 'A',
                keterangan: 'FLAT'
              }
            ],
            total_page: 1
          }
        }
        if (data.success) {
          this.rawItems = data.data.rows
          return data.data.total_page
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
        const data = this.rawItems.map((item) => {
          if (item.id === id) return item
        })
        return data[0]
        //const data = await request.getProduk(id)
        // if (data.success) {
        //   return data.data.rows[0]
        // }
      } catch (error) {
        throw new Error(error)
      }
    },
    async postItem(id, kode, sandi, keterangan, isEdit) {
      const Auth = useAuthStore()
      try {
        if (!isEdit) {
          this.rawItems.push({
            id: this.rawItems.length + 1,
            kode,
            sandi,
            keterangan
          })
        } else {
          this.rawItems = this.rawItems.map((item) => {
            if (item.id === id) return { id, kode, sandi, keterangan }
          })
        }
        //await request.postProduk(kode, sandi, keterangan, isEdit, Auth.items.kantor)
      } catch (error) {
        throw new Error(error)
      }
    },
    async removeItem(id) {
      try {
        const Auth = useAuthStore()
        this.rawItems = this.rawItems.filter((item) => item.id !== id)
        //const data = await request.deleteProduk(id, Auth.items.kantor)
      } catch (error) {
        throw new Error(error)
      }
    }
  }
})
