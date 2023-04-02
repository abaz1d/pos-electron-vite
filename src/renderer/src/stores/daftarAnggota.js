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
        //console.log(
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
    }
  }
})
