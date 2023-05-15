import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import Swal from 'sweetalert2'
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
        const Auth = useAuthStore()
        const data = await request.fetchPerkiraan(
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
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async readPerkiraan(noper) {
      try {
        const data = await request.getperkiraanAkuntansi(noper)
        if (data.success) {
          return data.data[0]
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async postItem(noper, nama, level, bukubantu, kelompok, kelompok_data, detail, isEdit) {
      try {
        const Auth = useAuthStore()
        let data
        if (!isEdit) {
          this.rawItems.push(noper, nama, level, bukubantu, kelompok, kelompok_data, detail)
          data = await request.createPerkiraan(
            noper,
            nama,
            level,
            bukubantu,
            kelompok,
            kelompok_data,
            detail,
            Auth.items.kantor
          )
        } else {
          this.rawItems = this.rawItems.map((item) => {
            if (item.noper === noper) {
              return { noper, nama, level, bukubantu, kelompok, kelompok_data, detail }
            }
            return item
          })
          data = await request.updatePerkiraan(
            noper,
            nama,
            level,
            bukubantu,
            kelompok,
            kelompok_data,
            detail
          )
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
    removeItem(noper) {
      this.rawItems = this.rawItems.filter((item) => {
        return item.noper !== noper
      })
      request.deletePerkiraan(noper)
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
    }
  }
})
