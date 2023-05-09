import { defineStore } from 'pinia'
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
        const data = await request.fetchAnggota(
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
        } else {
          console.log('data', data)
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
