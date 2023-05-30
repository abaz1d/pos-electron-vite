import { defineStore } from 'pinia'
import router from '@renderer/router'
import { useAuthStore } from './auth'
import Swal from 'sweetalert2'
const request = window.api.daftarAnggota

export const useDaftarAnggotaStore = defineStore({
  id: 'daftar-anggota',
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
      iddata,
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
        const Auth = useAuthStore()
        const anggota = {
          iddata,
          tanggal,
          cif: no_anggota,
          noktp: no_ktp,
          nokK: no_kk,
          nama: nama_lengkap,
          tempatlhr: tempat_lahir,
          tanggallhr: tanggal_lahir,
          jeniskl: jenis_kelamin,
          agama,
          alamat,
          rt: `${rt}/${rw}`,
          desa: kelurahan,
          kecamatan: kecamatan,
          kota,
          statuskawin: pendamping,
          pekerjaan,
          phone: no_telepon,
          resort,
          kantor: Auth.items.kantor
        }
        if (iddata != '') {
          this.rawItems = this.rawItems.map((item) => {
            if (item.iddata === iddata) {
              return anggota
            }
            return item
          })
        } else {
          this.rawItems.push(anggota)
        }
        const data = await request.postAnggota(
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
          resort,

          imageFoto,
          imageTTD,
          imagePA,
          Auth.items.kantor
        )
        console.log('d', data)
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
