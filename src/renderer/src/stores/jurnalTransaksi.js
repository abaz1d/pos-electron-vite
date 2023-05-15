import { defineStore } from 'pinia'
import router from '@renderer/router'
import { useAuthStore } from './auth'
import Swal from 'sweetalert2'
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
        const Auth = useAuthStore()
        const data = await request.fetchJurnal(
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
        const Auth = useAuthStore()
        let id = Date.now()
        let data
        if (!isEdit && idtrans == '') {
          this.detailJurnal.push({
            idtrans: Date.now(),
            TANGGAL,
            BUKTI,
            NOPER,
            KETERANGAN,
            JUMLAH,
            KANTOR: Auth.items.kantor
          })
          data = await request.createJurnal(
            TANGGAL,
            BUKTI,
            NOPER,
            KETERANGAN,
            JUMLAH,
            Auth.items.kantor
          )
          if (data.success) {
            this.detailJurnal = this.detailJurnal.map((item) => {
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
          this.detailJurnal = this.detailJurnal.map((item) => {
            if (item.idtrans === idtrans) {
              return { idtrans, TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH }
            }
            return item
          })
          data = await request.updateJurnal(idtrans, TANGGAL, BUKTI, NOPER, KETERANGAN, JUMLAH)
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
      this.detailJurnal = this.detailJurnal.filter((item) => {
        return item.idtrans !== idtrans
      })
      request.deleteJurnal(idtrans)
    }
  }
})
