import { defineStore } from 'pinia'
import router from '@renderer/router'
import { useAuthStore } from './auth'
import Swal from 'sweetalert2'
const request = window.api.daftarSimpata

export const useDaftarSimpataStore = defineStore({
  id: 'daftar-simpata',
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
        const data = await request.fetchSimpata(
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
        const data = await request.getSimpata(norek)
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
        const data = await request.setupSimpata(Auth.items.kantor)
        return data
      } catch (error) {
        throw new Error(error)
      }
    },
    async postItem(
      tanggal,
      cif,
      nobuku,
      norek,
      jenis,
      produk,
      nama,
      pendamping,
      alamat,
      desa,
      kecamatan,
      kota,
      rate,
      carahitung,
      pajak,
      norek_sma,
      atas_nama,
      pokok,
      jangka_waktu,
      mulai_tanggal,
      tanggal_selesai,
      aro,
      perpanjangan,
      saldo,
      saldo_blokir,
      max_pengambilan,
      blokir_check,
      autodebet_check,
      catatan_check,
      petugas,
      tgl_tutup_rekening,
      isEdit
    ) {
      try {
        const Auth = useAuthStore()
        const simpata = {
          tanggal,
          cif,
          nobuku,
          norek,
          jenis,
          produk,
          nama,
          pendamping,
          alamat,
          desa,
          kecamatan,
          kota,
          rate,
          carahitung,
          pajak,
          norek_sma,
          atas_nama,
          pokok,
          jangka_waktu,
          mulai_tanggal,
          tanggal_selesai,
          aro,
          perpanjangan,
          saldo,
          saldo_blokir,
          max_pengambilan,
          blokir_check,
          autodebet_check,
          catatan_check,
          petugas,
          tgl_tutup_rekening,
          isEdit,
          kantor: Auth.items.kantor
        }
        if (isEdit) {
          this.rawItems = this.rawItems.map((item) => {
            if (item.norek === norek) {
              return simpata
            }
            return item
          })
        } else {
          this.rawItems.push(simpata)
        }
        await request.postSimpata(
          tanggal,
          cif,
          nobuku,
          norek,
          jenis,
          produk,
          nama,
          pendamping,
          alamat,
          desa,
          kecamatan,
          kota,
          rate,
          carahitung,
          pajak,
          norek_sma,
          atas_nama,
          pokok,
          jangka_waktu,
          mulai_tanggal,
          tanggal_selesai,
          aro,
          perpanjangan,
          saldo,
          saldo_blokir,
          max_pengambilan,
          blokir_check,
          autodebet_check,
          catatan_check,
          petugas,
          tgl_tutup_rekening,
          isEdit,
          Auth.items.kantor
        )
      } catch (error) {
        throw new Error(error)
      }
    },
    async removeItem(norek) {
      try {
        this.rawItems = this.rawItems.filter((item) => item.norek !== norek)
        const data = await request.deleteSimpata(norek)
      } catch (error) {
        throw new Error(error)
      }
    }
  }
})
