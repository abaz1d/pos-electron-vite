import { defineStore } from 'pinia'
import router from '@renderer/router'
import { useAuthStore } from './auth'
import Swal from 'sweetalert2'
const request = window.api.daftarPinjaman

export const useDaftarPinjamanStore = defineStore({
  id: 'daftar-pinjaman',
  state: () => ({
    rawItems: [],
    rawItems2: []
  }),
  getters: {
    items: (state) => state.rawItems,
    items2: (state) => state.rawItems2
  },
  actions: {
    async readItem(search_type, search_data, sort_by, sort_mode, page_number, total_row_displayed) {
      try {
        const Auth = useAuthStore()
        const data = await request.fetchPinjaman(
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
    async readItem2(
      search_type,
      search_data,
      sort_by,
      sort_mode,
      page_number,
      total_row_displayed
    ) {
      try {
        const Auth = useAuthStore()
        const data = await request.fetchAnggota(
          search_type,
          search_data,
          sort_by,
          sort_mode,
          page_number,
          total_row_displayed,
          Auth.items.kantor
        )
        if (data.success) {
          this.rawItems2 = data.data.rows
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
    async readLaporan(kantor, tanggal, resort, limit) {
      try {
        const data = await request.fetchLaporan(kantor, tanggal, resort, limit)
        if (data.success) {
          this.rawItems = data.data
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
    async getItem(norek) {
      try {
        const data = await request.getPinjaman(norek)
        if (data.success) {
          return data.data[0]
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async getNasabah(cif) {
      try {
        const data = await request.getNasabah(cif)
        return data
      } catch (error) {
        throw new Error(error)
      }
    },
    async setupItem() {
      try {
        const Auth = useAuthStore()
        const data = await request.setupPinjaman(Auth.items.kantor)
        return data
      } catch (error) {
        throw new Error(error)
      }
    },
    async postItem(
      tanggal,
      cif,
      nopk,
      norek,
      jenis,
      resort,
      pokok,
      rate,
      kdhit,
      tgl_mulai,
      lama,
      adm,
      provisi,
      tgl_jatuh_tempo,
      tgl_alih_bunga,
      tgl_valuta,
      tgl_lunas,
      angsuran_pokok,
      angsuran_jasa,
      sisa_pokok,
      sisa_jasa,
      isEdit
    ) {
      try {
        const Auth = useAuthStore()
        this.rawItems.push({
          tanggal: Date.now(),
          cif,
          nopk,
          norek,
          jenis,
          resort,
          pokok,
          rate,
          kdhit,
          tgl_mulai,
          lama,
          adm,
          provisi,
          tgl_jatuh_tempo,
          tgl_alih_bunga,
          tgl_valuta,
          tgl_lunas,
          angsuran_pokok,
          angsuran_jasa,
          sisa_pokok,
          sisa_jasa,
          isEdit,
          kantor: Auth.items.kantor,
          marketing: Auth.items.username
        })
        await request.postPinjaman(
          tanggal,
          cif,
          nopk,
          norek,
          jenis,
          resort,
          pokok,
          rate,
          kdhit,
          tgl_mulai,
          lama,
          adm,
          provisi,
          tgl_jatuh_tempo,
          tgl_alih_bunga,
          tgl_valuta,
          tgl_lunas,
          angsuran_pokok,
          angsuran_jasa,
          sisa_pokok,
          sisa_jasa,
          isEdit,
          Auth.items.kantor,
          Auth.items.username
        )
      } catch (error) {
        throw new Error(error)
      }
    },
    async removeItem(norek) {
      try {
        this.rawItems = this.rawItems.filter((item) => item.norek !== norek)
        const data = await request.deletePinjaman(norek)
      } catch (error) {
        throw new Error(error)
      }
    }
  }
})
