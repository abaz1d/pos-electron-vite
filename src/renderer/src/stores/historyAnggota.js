import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import router from '@renderer/router'
import Swal from 'sweetalert2'
const request = window.api.historyAnggota

export const useHistoryAnggotaStore = defineStore({
  id: 'history-anggota',
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
    async getItem(iddata) {
      try {
        const data = await request.getAnggota(iddata)
        if (data.success) {
          return data.data.rows[0]
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    async postItem(
      imageFoto,
      imageTTD,
      imagePA,

      tanggal,
      no_anggota,
      no_ktp,
      no_kk,
      nama_lengkap,
      tempat_lahir,
      tanggal_lahir,
      jenis_kelamin,
      agama,
      alamat,
      rt,
      rw,
      kelurahan,
      kecamatan,
      kota,
      pendamping,
      pekerjaan,
      no_telepon,
      resort
    ) {
      try {
        const iddata = Date.now()
        this.rawItems.push({
          iddata,
          tanggal,
          no_anggota,
          no_ktp,
          no_kk,
          nama_lengkap,
          tempat_lahir,
          tanggal_lahir,
          jenis_kelamin,
          agama,
          alamat,
          rt,
          rw,
          kelurahan,
          kecamatan,
          kota,
          pendamping,
          pekerjaan,
          no_telepon,
          resort
        })
        await request.postAnggota(
          tanggal,
          no_anggota,
          no_ktp,
          no_kk,
          nama_lengkap,
          tempat_lahir,
          tanggal_lahir,
          jenis_kelamin,
          agama,
          alamat,
          rt,
          rw,
          kelurahan,
          kecamatan,
          kota,
          pendamping,
          pekerjaan,
          no_telepon,
          resort,

          imageFoto,
          imageTTD,
          imagePA
        )
      } catch (error) {
        throw new Error(error)
      }
    },
    async removeItem(iddata) {
      try {
        this.rawItems = this.rawItems.filter((item) => item.iddata !== iddata)
        const data = await request.deleteAnggota(iddata)
      } catch (error) {
        throw new Error(error)
      }
    }
  }
})
