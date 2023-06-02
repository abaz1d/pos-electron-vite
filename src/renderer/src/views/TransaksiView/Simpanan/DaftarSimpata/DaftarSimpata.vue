<script setup>
import { useDaftarSimpataStore } from '@renderer/stores/daftarSimpata.js'
import { onMounted, onBeforeMount, ref, watch, inject } from 'vue'
import moment from 'moment'
import Breadcrumbs from '@renderer/components/Breadcrumbs/Breadcrumbs.vue'
import DaftarNasabah from './DaftarNasabah.vue'
import { currencyFormatter } from '@renderer/utils/helper'
import TRANSAKSI from '@renderer/assets/images/menu/transaksi.svg'

const swal = inject('$swal')
const daftarSimpata = useDaftarSimpataStore()
const isLoading = ref(false)
const isAdd = ref(false)
const isEdit = ref(false)
const isView = ref(false)
const modal_utama = ref(false)
const modal_nasabah = ref(false)
const modal_delete = ref(false)
const sort_by = ref('p.tanggal')
const sort_mode = ref(false)
const search_data = ref('')
const search_type = ref('a.nama')
const page_number = ref(1)
const total_pages = ref(0)
const row_per_page = ref(50)
const allSelected = ref(false)
const userIds = ref([])

const jenis_simpanan_list = ref([])
const produk_simpata_list = ref([])
const norek = ref('')
const tanggal = ref(moment(Date.now()).format('DD-MM-YYYY'))
const no_anggota = ref('')
const no_buku = ref('')
const jenis_simpanan = ref('')
const kd_produk = ref('')
const nama_lengkap = ref('')
const pendamping = ref('')
const alamat = ref('')
const desa = ref('')
const kecamatan = ref('')
const kota = ref('')
const suku_bunga = ref('')
const cara_hitung = ref('1')
const pajak = ref('')
const norek_sma = ref('')
const atas_nama = ref('')
const setoran_awal = ref('')
const jangka_waktu = ref('')
const mulai_tanggal = ref('')
const tanggal_selesai = ref('')
const saldo_sekarang = ref('')
const saldo_blokir = ref('')
const max_pengambilan = ref('')
const blokir_check = ref('')
const autodebet_check = ref('')
const catatan_check = ref('')
const petugas = ref('')
const tgl_tutup_rekening = ref('')

const addGet = () => {
  isAdd.value = true
  modal_utama.value = true
}
const editGet = async (e) => {
  isEdit.value = true
  modal_utama.value = true
  const simpanan = await daftarSimpata.getItem(e)
  tanggal.value =
    moment(simpanan.tanggal).format('DD-MM-YYYY') == '30-11-1899'
      ? ''
      : moment(simpanan.tanggal).format('DD-MM-YYYY')
  no_anggota.value = simpanan.cif
  no_buku.value = simpanan.nobuku
  norek.value = simpanan.norek
  jenis_simpanan.value = simpanan.jenis
  kd_produk.value = simpanan.marketing + ' '
  nama_lengkap.value = simpanan.nama
  pendamping.value = simpanan.statuskawin
  alamat.value = simpanan.alamat
  desa.value = simpanan.desa
  kecamatan.value = simpanan.kecamatan
  kota.value = simpanan.kota
  suku_bunga.value = simpanan.rate
  cara_hitung.value = simpanan.carahitung
  pajak.value = simpanan.adm
  norek_sma.value = ''
  atas_nama.value = ''
  setoran_awal.value = simpanan.pokok
  jangka_waktu.value = simpanan.lama
  mulai_tanggal.value = simpanan.tglawal
  tanggal_selesai.value = simpanan.tgljtempo
  saldo_sekarang.value = simpanan.saldo
  saldo_blokir.value = ''
  max_pengambilan.value = simpanan.saldo
  blokir_check.value = simpanan.lama
  autodebet_check.value = simpanan.lama
  catatan_check.value = simpanan.saldo
  petugas.value = simpanan.marketing
  tgl_tutup_rekening.value = simpanan.tgltutup
}
const deleteGet = (e) => {
  const simpanan = e

  if (simpanan.norek) {
    userIds.value = []
    userIds.value.push(simpanan.norek)
    console.log('delete get 1', userIds.value)
    modal_delete.value = true
  } else {
    if (userIds.value.length > 0) {
      console.log('delete get 1+', userIds.value)
      modal_delete.value = true
    }
  }
}

const viewData = async (e) => {
  isView.value = true
  modal_utama.value = true
  const simpanan = await daftarSimpata.getItem(e)
  tanggal.value =
    moment(simpanan.tanggal).format('DD-MM-YYYY') == '30-11-1899'
      ? ''
      : moment(simpanan.tanggal).format('DD-MM-YYYY')
  no_anggota.value = simpanan.cif
  no_buku.value = simpanan.nobuku
  norek.value = simpanan.norek
  jenis_simpanan.value = simpanan.jenis
  kd_produk.value = simpanan.marketing + ' '
  nama_lengkap.value = simpanan.nama
  pendamping.value = simpanan.statuskawin
  alamat.value = simpanan.alamat
  desa.value = simpanan.desa
  kecamatan.value = simpanan.kecamatan
  kota.value = simpanan.kota
  suku_bunga.value = simpanan.rate
  cara_hitung.value = simpanan.carahitung
  pajak.value = simpanan.adm
  norek_sma.value = ''
  atas_nama.value = ''
  setoran_awal.value = simpanan.pokok
  jangka_waktu.value = simpanan.lama
  mulai_tanggal.value = simpanan.tglawal
  tanggal_selesai.value = simpanan.tgljtempo
  saldo_sekarang.value = simpanan.saldo
  saldo_blokir.value = ''
  max_pengambilan.value = simpanan.saldo
  blokir_check.value = simpanan.lama
  autodebet_check.value = simpanan.lama
  catatan_check.value = simpanan.saldo
  petugas.value = simpanan.marketing
  tgl_tutup_rekening.value = simpanan.tgltutup
}
const getNasabah = async (e) => {
  if (no_anggota.value != '') {
    const data = await daftarSimpata.getNasabah(no_anggota.value)
    if (data.success) {
      const nasabah = data.data.rows[0]
      nama_lengkap.value = nasabah.nama
      pendamping.value = nasabah.statuskawin
      alamat.value = nasabah.alamat
      desa.value = nasabah.desa
      kecamatan.value = nasabah.kecamatan
      kota.value = nasabah.kota
    } else {
      swal({
        icon: 'error',
        title: 'Oops...',
        text: data.data.message
      })
    }
  } else if (typeof e == 'string') {
    const data = await daftarSimpata.getNasabah(e)
    if (data.success) {
      modal_nasabah.value = false
      const nasabah = data.data.rows[0]
      no_anggota.value = e
      nama_lengkap.value = nasabah.nama
      pendamping.value = nasabah.statuskawin
      alamat.value = nasabah.alamat
      desa.value = nasabah.desa
      kecamatan.value = nasabah.kecamatan
      kota.value = nasabah.kota
    } else {
      swal({
        icon: 'error',
        title: 'Oops...',
        text: data.data.message
      })
    }
  }
}
const simpan_data = async (e) => {
  try {
    await daftarSimpata.postItem(
      // console.log('simpan',
      tanggal.value,
      no_anggota.value,
      no_buku.value,
      norek.value,
      jenis_simpanan.value,
      kd_produk.value,
      nama_lengkap.value,
      pendamping.value,
      alamat.value,
      desa.value,
      kecamatan.value,
      kota.value,
      suku_bunga.value,
      cara_hitung.value,
      pajak.value,
      norek_sma.value,
      atas_nama.value,
      setoran_awal.value,
      jangka_waktu.value,
      mulai_tanggal.value,
      tanggal_selesai.value,
      saldo_sekarang.value,
      saldo_blokir.value,
      max_pengambilan.value,
      blokir_check.value,
      autodebet_check.value,
      catatan_check.value,
      petugas.value,
      tgl_tutup_rekening.value,
      isEdit.value
    )
    //e.target.reset()
    resetForm()
  } catch (error) {
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'ERROR SIMPAN DATA ' + error
    })
  }
}
const deletePinjaman = async () => {
  if (userIds.value.length > 1) {
    for (let idPinjaman = 0; idPinjaman < userIds.value.length; idPinjaman++) {
      console.log('delete post 1+', userIds.value[idPinjaman])
      await daftarSimpata.removeItem(userIds.value[idPinjaman])
    }
  } else {
    console.log('delete post 1', userIds.value)
    await daftarSimpata.removeItem(userIds.value[0])
  }
  resetForm()
}
const resetForm = () => {
  if (modal_utama.value == false && isEdit.value == false && isView.value == false) {
    search_data.value = ''
    search_type.value = 'a.nama'
    sort_by.value = 'p.tanggal'
    sort_mode.value = false
    page_number.value = 1
    total_pages.value = 0
    row_per_page.value = 50
  }
  allSelected.value = false
  userIds.value = []
  norek.value = ''
  tanggal.value = moment(Date.now()).format('DD-MM-YYYY')
  no_anggota.value = ''
  no_buku.value = ''
  jenis_simpanan.value = ''
  kd_produk.value = ''
  nama_lengkap.value = ''
  pendamping.value = ''
  alamat.value = ''
  desa.value = ''
  kecamatan.value = ''
  kota.value = ''
  suku_bunga.value = ''
  cara_hitung.value = '1'
  pajak.value = ''
  norek_sma.value = ''
  atas_nama.value = ''
  setoran_awal.value = ''
  jangka_waktu.value = ''
  mulai_tanggal.value = ''
  tanggal_selesai.value = ''
  saldo_sekarang.value = ''
  saldo_blokir.value = ''
  max_pengambilan.value = ''

  blokir_check.value = ''
  autodebet_check.value = ''
  catatan_check.value = ''
  petugas.value = ''
  tgl_tutup_rekening.value = ''

  modal_utama.value = false
  modal_nasabah.value = false
  modal_delete.value = false
  isAdd.value = false
  isEdit.value = false
  isView.value = false
}

const sorting = async (e) => {
  isLoading.value = true
  sort_by.value = e
  sort_mode.value = !sort_mode.value

  try {
    await daftarSimpata.readItem(
      search_type.value,
      search_data.value,
      e,
      sort_mode.value,
      page_number.value,
      row_per_page.value
    )
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'Gagal Sorting ' + error
    })
  }
}
const firstPage = async () => {
  page_number.value = 1
}
const previousPage = async () => {
  try {
    let page_no = parseInt(page_number.value)
    if (page_no > 1) {
      page_number.value = page_no - 1
    }
  } catch (error) {
    isLoading.value = false
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'Gagal page sebelumnya ' + error
    })
  }
}

const nextPage = () => {
  try {
    if (page_number.value == '') {
      page_number.value = 1
    }
    let page_no = parseInt(page_number.value)
    if (page_no < total_pages.value) {
      page_number.value = page_no + 1
    }
  } catch (error) {
    isLoading.value = false
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'Gagal page selanjutnya ' + error
    })
  }
}
const lastPage = async () => {
  page_number.value = total_pages.value
}

watch(page_number, async (e) => {
  try {
    isLoading.value = true
    await daftarSimpata.readItem(
      search_type.value,
      search_data.value,
      sort_by.value,
      sort_mode.value,
      e,
      row_per_page.value
    )
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'Gagal ganti page ' + error
    })
  }
})
watch(row_per_page, async (e) => {
  try {
    isLoading.value = true
    if (page_number.value > total_pages.value || page_number.value == '') {
      page_number.value = 1
    }
    const data = await daftarSimpata.readItem(
      search_type.value,
      search_data.value,
      sort_by.value,
      sort_mode.value,
      page_number.value,
      e
    )
    total_pages.value = data
    userIds.value = []
    allSelected.value = false
    if (page_number.value > total_pages.value) {
      page_number.value = 1
    }
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'Gagal ganti row/page ' + error
    })
  }
})
watch(search_data, async (e) => {
  try {
    isLoading.value = true
    const data = await daftarSimpata.readItem(
      search_type.value,
      e,
      sort_by.value,
      sort_mode.value,
      page_number.value,
      row_per_page.value
    )
    total_pages.value = data
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'Gagal ganti page ' + error
    })
  }
})
watch(search_type, async (e) => {
  try {
    isLoading.value = true
    const data = await daftarSimpata.readItem(
      e,
      search_data.value,
      sort_by.value,
      sort_mode.value,
      page_number.value,
      row_per_page.value
    )
    total_pages.value = data
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'Gagal ganti page ' + error
    })
  }
})
watch(norek_sma, async (tanggal) => {
  try {
    if (jenis_simpanan.value != '' && pajak.value != '') {
      atas_nama.value = moment(tanggal).add(pajak.value, 'M').format('DD-MM-YYYY')
    }
  } catch (error) {
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'Gagal pilih tanggal mulai ' + error
    })
  }
})
watch(jenis_simpanan, async (sandi) => {
  try {
    // produk_simpata_list.value.map((produk) => {
    //   if (produk.sandi === sandi) {
    //     suku_bunga.value = parseFloat(produk.rate).toFixed(2)
    //     pajak.value = produk.LAMA
    //     admin_percent.value = parseFloat(produk.adm).toFixed(2)
    //     provisi_percent.value = parseFloat(produk.prov).toFixed(2)
    //     if (pokok_pinj.value != '' && !isView.value) {
    //       admin.value = parseFloat(
    //         (parseFloat(produk.adm).toFixed(2) / 100) * parseFloat(pokok_pinj.value)
    //       ).toFixed(2)
    //       provisi.value = parseFloat(
    //         (parseFloat(produk.prov).toFixed(2) / 100) * parseFloat(pokok_pinj.value)
    //       ).toFixed(2)
    //       saldo_sekarang.value = parseFloat(pokok_pinj.value / produk.LAMA)
    //       saldo_blokir.value =
    //         (parseFloat(produk.rate).toFixed(2) / 100) * parseFloat(pokok_pinj.value)
    //       max_pengambilan.value = saldo_sekarang.value + saldo_blokir.value
    //       if (norek_sma.value != '' && pajak.value != '') {
    //         atas_nama.value = moment(norek_sma.value)
    //           .add(pajak.value, 'M')
    //           .format('DD-MM-YYYY')
    //       }
    //     }
    //   }
    // })
  } catch (error) {
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'Gagal pilih jenis kredit ' + error
    })
  }
})

const selectAll = (e) => {
  userIds.value = []

  if (!allSelected.value || e) {
    for (let simpanan = 0; simpanan < daftarSimpata.items.length; simpanan++) {
      userIds.value.push(daftarSimpata.items[simpanan].norek)
    }
  }
}
const selectOne = () => {
  allSelected.value = false
}

onBeforeMount(async () => {
  try {
    const data = await daftarSimpata.setupItem()
    if (data.success) {
      jenis_simpanan_list.value = data.data.jenis_simpanan
      produk_simpata_list.value = data.data.produk_simpanan
    }
  } catch (error) {
    isLoading.value = false
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'ERROR BEFORE MOUNTED ' + error
    })
  }
})
onMounted(async () => {
  try {
    isLoading.value = true
    const data = await daftarSimpata.readItem(
      search_type.value,
      search_data.value,
      sort_by.value,
      sort_mode.value,
      page_number.value,
      row_per_page.value
    )
    total_pages.value = data
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'ERROR MOUNTED ' + error
    })
  }
})
</script>
<template>
  <Breadcrumbs title="Transaksi" subTitle="Simpanan atau Funding" :icon="TRANSAKSI" />
  <div class="relative top-0 bg-white w-full border-y-2 border-[#d0d3d4]">
    <div class="flex space-x-4 w-full justify-center m-auto px-5">
      <div class="grid grid-cols-8 w-3/12 h-10">
        <button
          class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:text-blue-700 hover:bg-gray-200 btn-light-bordered"
          @click="addGet"
          id="delete-multiple-data"
          data-bs-toggle="tooltip"
          title="Tambah Data"
        >
          <PlusIcon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
        </button>
        <button
          class="inline-block align-middle hover:text-danger text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          @click="deleteGet"
          id="delete-multiple-data"
          data-bs-toggle="tooltip"
          title="Hapus Data"
        >
          <Trash2Icon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
        </button>
        <RouterLink
          to="/laporan-daftar-simpanan"
          class="inline-block align-middle hover:text-success text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 p-1 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          title="Export CSV"
        >
          <ShareIcon class="w-3 h-3 mx-auto stroke-2 stroke-current" />
          <span
            class="w-4 h-2 px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-[8px] text-success font-bold"
            >CSV</span
          >
        </RouterLink>
        <RouterLink
          to="/laporan-daftar-simpanan"
          class="inline-block hover:text-danger align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 p-1 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          title="Export PDF"
        >
          <ShareIcon class="w-3 h-3 mx-auto stroke-2 stroke-current" />
          <span
            class="w-4 h-2 px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-[8px] text-danger font-bold"
            >PDF</span
          >
        </RouterLink>
        <RouterLink
          to="/laporan-daftar-simpanan"
          class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 p-1 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          title="Print Table"
        >
          <PrinterIcon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
        </RouterLink>
        <button
          class="inline-block hover:text-success align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          @click="selectAll(true), (allSelected = true)"
          id="select-all"
          title="Select All"
        >
          <CheckIcon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
          <i class="fa-solid fa-check"></i>
        </button>
        <button
          class="inline-block align-middle hover:text-danger text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          @click=";(userIds = []), (allSelected = false)"
          id="unselect-all"
          title="Unselect All"
        >
          <XIcon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
        </button>
        <a
          href="javascript:history.go(0)"
          title="Refresh All"
          class="inline-block hover:text-primary align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
        >
          <RefreshCwIcon class="w-4 h-4 mx-auto my-[9px] stroke-2 stroke-current" />
        </a>
      </div>
      <div class="flex order-2 w-6/12 h-10">
        <div id="pagination" class="mx-auto">
          <div class="inline-flex align-middle leading-tight text-xs">
            <div
              class="flex items-center mx-auto border rounded-lg w-full space-x-5 mr-2 px-1 btn-light-bordered h-9 bg-gray-100"
            >
              <div class="flex items-center w-1/3">
                <input
                  id="tabungan-checkbox"
                  type="checkbox"
                  disabled
                  value=""
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="tabungan-checkbox" class="ml-1 text-xs font-medium">Tabungan</label>
              </div>
              <div class="flex items-center w-1/3">
                <input
                  id="deposito-checkbox"
                  type="checkbox"
                  disabled
                  value=""
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="deposito-checkbox" class="ml-1 text-xs font-medium">Deposito</label>
              </div>
              <div class="flex items-center w-1/3">
                <input
                  id="penyertaan-checkbox"
                  type="checkbox"
                  disabled
                  value=""
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="penyertaan-checkbox" class="ml-1 text-xs font-medium">Penyertaan</label>
              </div>
            </div>
            <div class="relative inline-flex align-middle py-1 leading-tight text-xs">
              <a
                href="javascript:void(0);"
                class="inline-block align-middle text-center rounded-l-lg select-none border font-normal whitespace-no-wrap h-9 -mt-1 py-1 px-3 leading-normal no-underline bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
                id="first-page"
                title="first page"
                @click="firstPage()"
              >
                <SkipBackIcon class="w-4 h-4 mx-auto my-[5px]"
              /></a>
              <a
                href="javascript:void(0);"
                class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap h-9 -mt-1 py-1 px-3 leading-normal no-underline bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
                id="previous-page"
                title="previous page"
                @click="previousPage()"
                ><RewindIcon class="w-4 h-4 mx-auto my-[5px]"
              /></a>
            </div>
            <div class="flex items-stretch w-full">
              <input
                type="number"
                class="block appearance-none w-full mb-1 px-2 bg-white text-gray-800 border-y border-r border-gray-400 text-xs leading-normal"
                v-model="page_number"
              />
              <input
                type="number"
                class="block appearance-none w-full px-2 mb-1 bg-gray-200 text-gray-800 border-y border-gray-400 text-xs leading-normal"
                v-model="total_pages"
                disabled
              />
            </div>
            <div class="relative inline-flex align-middle py-1 leading-tight text-xs">
              <a
                href="javascript:void(0);"
                class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap h-9 -mt-1 py-1 px-3 leading-normal no-underline bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
                id="next-page"
                title="next page"
                @click="nextPage()"
                ><FastForwardIcon class="w-4 h-4 mx-auto my-[5px]"
              /></a>
              <a
                href="javascript:void(0);"
                class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap h-9 -mt-1 rounded-r-lg py-1 px-3 leading-normal no-underline bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
                id="last-page"
                title="last page"
                @click="lastPage()"
                ><SkipForwardIcon class="w-4 h-4 mx-auto my-[5px]"
              /></a>
            </div>
          </div>
        </div>
      </div>
      <div class="items-center justify-center w-3/12 flex h-10">
        <select
          name="row_per_page"
          v-model="row_per_page"
          class="bg-gray-50 border border-gray-300 text-gray-900 pl-1 mr-2 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block -mt-1 w-[70px] h-9"
        >
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
        </select>

        <div class="relative flex items-stretch w-full" id="search-input-group">
          <input
            type="text"
            class="block appearance-none border-y border-l rounded-l-lg w-full mb-1 bg-white text-gray-800 border-gray-300 px-2 text-xs leading-normal h-9"
            v-model="search_data"
            :placeholder="'Cari ' + search_type + ' ' + $route.name.replace(/-/gi, ' ')"
            name="search-data"
          />
          <div class="input-group-append">
            <button
              v-if="search_data !== ''"
              class="inline align-middle text-center select-none border-y border-[#d0d3d4] w-10 font-normal whitespace-no-wrap no-underline h-9 mx-auto px-2 leading-tight text-xs"
              id="clear-btn"
              @click="search_data = ''"
            >
              <DeleteIcon class="w-5 h-5 stroke-2 text-danger mx-auto my-[5px]" />
            </button>
          </div>
          <div class="input-group-append">
            <select
              name="search_type"
              v-model="search_type"
              class="inline align-middle text-center select-none border w-14 font-normal whitespace-no-wrap rounded-r-lg no-underline h-9 mx-auto px-0 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
            >
              <option value="a.nama">Nama</option>
              <option value="p.norek">Norek</option>
              <option value="p.nopk">No PK</option>
              <option value="p.cif">No Anggota</option>
              <option value="p.pokok">Pokok</option>
              <option value="a.alamat">Alamat</option>
              <option value="a.kecamatan">kecamatan</option>
              <option value="a.kota">Kota</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col h-[80vh] min-[1537px]:h-[85vh] shadow-md rounded-lg">
    <div class="flex-grow overflow-auto">
      <table class="relative w-full text-xs text-left text-gray-500 table-interval">
        <thead
          class="text-xs font-bold text-gray-800 uppercase bg-blue-200 sticky top-0 z-10 table-fixed"
        >
          <tr>
            <th scope="col" class="p-2 border pl-3">
              <div class="flex items-center">
                <input
                  id="checkbox-all-search"
                  v-model="allSelected"
                  @click="selectAll(false)"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-blue-200 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label for="checkbox-all-search" class="sr-only">checkbox</label>
              </div>
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('p.tanggal')"
            >
              Tanggal
              <SortAscIcon
                v-if="sort_by === 'p.tanggal' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'p.tanggal' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('p.norek')"
            >
              Norek
              <SortAscIcon
                v-if="sort_by === 'p.norek' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'p.norek' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('p.cif')"
            >
              No Anggota
              <SortAscIcon
                v-if="sort_by === 'p.cif' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'p.cif' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('a.nama')"
            >
              Nama
              <SortAscIcon
                v-if="sort_by === 'a.nama' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'a.nama' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('a.alamat')"
            >
              Alamat
              <SortAscIcon
                v-if="sort_by === 'a.alamat' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'a.alamat' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('a.kecamatan')"
            >
              Kecamatan
              <SortAscIcon
                v-if="sort_by === 'a.kecamatan' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'a.kecamatan' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('a.kota')"
            >
              Kota
              <SortAscIcon
                v-if="sort_by === 'a.kota' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'a.kota' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('p.pokok')"
            >
              Saldo
              <SortAscIcon
                v-if="sort_by === 'p.pokok' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'p.pokok' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th scope="col" class="text-center uppercase border">Actions</th>
          </tr>
        </thead>
        <tbody class="overflow-y-scroll" v-show="!isLoading">
          <tr
            class="bg-white hover:bg-lime-300 hover:text-slate-700 drop-shadow-2xl group"
            v-for="simpanan in daftarSimpata.items"
            :key="simpanan.norek"
            :simpanan="simpanan"
            :value="simpanan.norek"
          >
            <td class="w-4 border-r border-b font-medium p-0 pl-3">
              <div class="flex items-center">
                <span
                  class="hidden cursor-pointer -ml-[9px] mr-[1px] rotate-90 group-hover:block text-black"
                  >:::</span
                >
                <input
                  :value="simpanan.norek"
                  type="checkbox"
                  v-model="userIds"
                  @click="selectOne"
                  class="data-checkbox w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2"
                />
              </div>
            </td>
            <th
              @dblclick="viewData(simpanan.norek)"
              scope="row"
              class="border-r border-b font-medium whitespace-nowrap pl-2"
            >
              {{ moment(simpanan.tanggal).format('DD-MM-YYYY') }}
            </th>
            <td
              @dblclick="viewData(simpanan.norek)"
              class="min-w-max text-center border-r border-b font-medium px-2"
            >
              {{ simpanan.norek }}
            </td>
            <td
              @dblclick="viewData(simpanan.norek)"
              class="min-w-max text-center border-r border-b font-medium px-2"
            >
              {{ simpanan.cif }}
            </td>
            <td
              @dblclick="viewData(simpanan.norek)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ simpanan.nama }}
            </td>
            <td
              @dblclick="viewData(simpanan.norek)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ simpanan.alamat }}
            </td>
            <td
              @dblclick="viewData(simpanan.norek)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ simpanan.kecamatan }}
            </td>
            <td
              @dblclick="viewData(simpanan.norek)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ simpanan.kota }}
            </td>
            <td
              @dblclick="viewData(simpanan.norek)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ currencyFormatter.format(simpanan.saldo) }}
            </td>
            <td class="min-w-max border-r border-b font-medium p-1">
              <div class="flex justify-center">
                <a
                  @click="editGet(simpanan.norek)"
                  class="flex items-center mr-4 hover:text-blue-700 text-sky-600"
                  href="javascript:;"
                >
                  <CheckSquareIcon class="w-3 h-3 mr-1" /> Edit
                </a>
                <a
                  @click="deleteGet(simpanan)"
                  class="flex items-center hover:text-red-800 text-danger"
                  href="javascript:;"
                >
                  <Trash2Icon class="w-3 h-3 mr-1" /> Hapus
                </a>
              </div>
            </td>
          </tr>
        </tbody>
        <tbody v-show="isLoading">
          <div
            class="fixed intleft-2 right-0 top-0 bottom-0 w-full h-[100vh] z-50 overflow-hidden bg-gray-500 opacity-75 flex flex-col items-center justify-center"
          >
            <Loader2Icon class="motion-safe:animate-spin stroke-[5px] text-white h-12 w-12 mb-2" />
            <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
            <p class="w-1/3 text-center text-white">Sedang Memuat Data</p>
            <p class="w-1/3 text-center text-white">
              Ini mungkin memakan waktu beberapa saat, tolong jangan tutup halaman ini.
            </p>
          </div>
        </tbody>
      </table>
    </div>
  </div>
  <Modal backdrop="static" size="modal-xl" :show="modal_utama" @hidden="modal_utama = false">
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">
        <span v-if="isAdd">Tambah </span><span v-if="isEdit">Edit </span
        ><span v-if="isView">Data </span> Simpata
        <span v-if="isEdit || isView">{{ norek }}</span>
      </h2>

      <a
        data-tw-dismiss="modal"
        @click="resetForm"
        href="javascript:;"
        class="border bg-danger rounded-lg hover:bg-red-700 -my-5 -mr-3"
      >
        <XIcon class="lucide lucide-x w-7 h-7 text-white hover:text-slate-100" />
      </a>
    </ModalHeader>
    <ModalBody>
      <div
        v-if="isView || isEdit"
        class="flex space-x-3 -mx-5 py-2 justify-center -mt-5 mb-3 bg-gray-100"
      >
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-amber-800 bg-white hover:bg-slate-200"
          title="CIF"
        >
          <FingerprintIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >CIF</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-slate-600 bg-white hover:bg-slate-200"
          title="Khusus"
        >
          <PinIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Khusus</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-amber-400 bg-white hover:bg-slate-200"
          title="Mutasi"
        >
          <CalendarDaysIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Mutasi</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-amber-700 bg-white hover:bg-slate-200"
          title="Autodebet"
        >
          <BanknoteIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Autodebet</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-black bg-white hover:bg-slate-200"
          title="Catatan"
        >
          <FileIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Catatan</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-danger bg-white hover:bg-slate-200"
          title="Blokir"
        >
          <XOctagonIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Blokir</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-rose-400 bg-white hover:bg-slate-200"
          title="Laporan"
        >
          <PrinterIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Laporan</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-secondary bg-white hover:bg-slate-200"
          title="Lain - Lain"
        >
          <CircleEllipsisIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Lain - Lain</span
          >
        </button>
      </div>
      <form id="daftarSimpataForm" @submit.prevent="simpan_data">
        <div class="-mx-4">
          <div class="flex items-center justify-center w-full">
            <div class="bg-slate-100 p-3 rounded-t w-1/3">
              <div class="text-gray-700 flex items-center mx-auto w-9/12">
                <div class="mb-1 w-2/5 text-xs">
                  <label>Tanggal</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    v-model="tanggal"
                    required
                    readonly
                  />
                </div>
              </div>
              <div class="text-gray-700 flex items-center mx-auto ml-2 w-full">
                <div class="mb-1 pl-3 w-[40%] text-xs">
                  <label>No Anggota</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-[45%] flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded-l focus:shadow-outline"
                    type="text"
                    v-model="no_anggota"
                    @keyup.enter="no_anggota == '' ? (modal_nasabah = true) : getNasabah"
                    @blur="getNasabah"
                    required
                    :readonly="isView"
                  />
                </div>
                <div
                  v-if="!isView"
                  @click="modal_nasabah = true"
                  class="w-[15%] text-xs cursor-pointer py-[1.4px] flex justify-center mb-1 rounded-r bg-white hover:bg-slate-200"
                >
                  <FolderSearchIcon />
                </div>
              </div>
            </div>
            <div class="bg-slate-100 p-3 rounded-t w-1/3">
              <div class="text-gray-700 flex items-center mx-auto w-9/12">
                <div class="mb-1 w-2/5 text-xs">
                  <label>No Buku</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    v-model="no_buku"
                    required
                    :readonly="isView"
                  />
                </div>
              </div>
              <div class="text-gray-700 flex items-center mx-auto w-9/12">
                <div class="mb-1 w-2/5 text-xs">
                  <label>No Rekening</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    v-model="norek"
                    required
                    :readonly="isView"
                  />
                </div>
              </div>
            </div>
            <div class="bg-slate-100 p-3 rounded-t w-1/3">
              <div class="text-gray-700 flex items-center mx-auto w-9/12">
                <div class="mb-1 w-2/5 text-xs">
                  <label>Jenis Simpanan</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <select
                    name="kd_produk"
                    id="kd_produk"
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    placeholder=" "
                    v-model="jenis_simpanan"
                    required
                    :disabled="isView"
                  >
                    <option class="text-xs" value="" disabled>Pilih Jenis Simpanan</option>
                    <option v-for="jenis in jenis_simpanan_list" :value="jenis.sandi">
                      {{ jenis.sandi }} - {{ jenis.keterangan }}
                    </option>
                  </select>
                </div>
              </div>
              <div class="text-gray-700 flex items-center mx-auto w-9/12">
                <div class="mb-1 w-2/5 text-xs">
                  <label>KD Produk</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <select
                    name="jenis_simpanan"
                    id="jenis_simpanan"
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    placeholder=" "
                    v-model="kd_produk"
                    required
                    :disabled="isView"
                  >
                    <option class="text-xs" value="" disabled>Pilih KD Produk</option>
                    <option
                      v-for="produk in produk_simpata_list"
                      :value="produk.SANDI"
                      :disabled="produk.SANDI != '002'"
                    >
                      {{ produk.SANDI }} - {{ produk.KETERANGAN }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <hr />
          <div class="flex items-center justify-center w-full">
            <div class="bg-slate-100 p-3 rounded-t w-1/2">
              <div class="text-gray-700 flex items-center mx-auto w-9/12">
                <div class="mb-1 w-2/5 text-xs">
                  <label>Nama</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    v-model="nama_lengkap"
                    required
                    readonly
                  />
                </div>
              </div>
              <div class="text-gray-700 flex items-center mx-auto w-9/12">
                <div class="mb-1 w-2/5 text-xs">
                  <label>Pendamping</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    v-model="pendamping"
                    required
                    readonly
                  />
                </div>
              </div>
              <div class="text-gray-700 flex items-center mx-auto w-9/12">
                <div class="mb-1 w-2/5 text-xs">
                  <label>Alamat</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    v-model="alamat"
                    required
                    readonly
                  />
                </div>
              </div>
            </div>
            <div class="bg-slate-100 p-3 rounded-t w-1/2">
              <div class="text-gray-700 flex items-center mx-auto w-9/12">
                <div class="mb-1 w-2/5 text-xs">
                  <label>Desa</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    v-model="desa"
                    required
                    readonly
                  />
                </div>
              </div>
              <div class="text-gray-700 flex items-center mx-auto w-9/12">
                <div class="mb-1 w-2/5 text-xs">
                  <label>Kecamatan</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    v-model="kecamatan"
                    required
                    readonly
                  />
                </div>
              </div>
              <div class="text-gray-700 flex items-center mx-auto w-9/12">
                <div class="mb-1 w-2/5 text-xs">
                  <label>Kota</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    v-model="kota"
                    required
                    readonly
                  />
                </div>
              </div>
            </div>
          </div>
          <hr />
          <h1 class="uppercase text-center border-y">
            {{
              jenis_simpanan == '1'
                ? 'tabungan'
                : jenis_simpanan == '2'
                ? 'simpanan berjangka'
                : jenis_simpanan == '3'
                ? 'penyertaan'
                : '==================='
            }}
          </h1>
          <div class="flex items-center justify-center w-full bg-slate-100">
            <div class="p-3 flex rounded-t w-7/12 space-x-16">
              <div class="rounded-t w-1/2">
                <div class="text-gray-700 flex items-center mx-[26px] w-full space-x-5">
                  <div class="mb-1 w-[35%] text-xs">
                    <label>Suku Bunga</label>
                  </div>
                  <span class="mr-3 pb-2">:</span>
                  <div class="w-3/5 flex-grow">
                    <input
                      class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                      type="text"
                      v-model="suku_bunga"
                      readonly
                      required
                    />
                  </div>
                </div>
                <div class="text-gray-700 flex items-center mx-[26px] w-full space-x-5">
                  <div class="mb-1 w-[35%] text-xs">
                    <label>Cara Hitung</label>
                  </div>
                  <span class="mr-3 pb-2">:</span>
                  <div class="w-3/5 flex-grow">
                    <select
                      name="cara_hitung"
                      id="cara_hitung"
                      class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                      placeholder=" "
                      v-model="cara_hitung"
                      required
                      disabled
                    >
                      <option class="text-xs" value="" disabled>Pilih Cara Hitung</option>
                      <option value="1">A - FLAT</option>
                    </select>
                  </div>
                </div>
                <div class="text-gray-700 flex items-center mx-[26px] w-full">
                  <div class="mb-1 w-2/5 text-xs">
                    <label>Pajak</label>
                  </div>
                  <span class="mr-3 pb-2">:</span>
                  <div class="w-3/5 flex-grow">
                    <input
                      class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                      type="text"
                      v-model="pajak"
                      readonly
                      required
                    />
                  </div>
                </div>
                <div class="text-gray-700 flex items-center mx-[26px] w-full">
                  <div class="mb-1 w-2/5 text-xs">
                    <label>Norek S M A</label>
                  </div>
                  <span class="mr-3 pb-2">:</span>
                  <div class="w-3/5 flex-grow">
                    <input
                      class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                      type="text"
                      v-model="norek_sma"
                      required
                      :readonly="isView"
                    />
                  </div>
                </div>
                <div class="text-gray-700 flex items-center mx-[26px] w-full">
                  <div class="mb-1 w-2/5 text-xs">
                    <label>Atas Nama</label>
                  </div>
                  <span class="mr-3 pb-2">:</span>
                  <div class="w-3/5 flex-grow">
                    <input
                      class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                      type="text"
                      v-model="atas_nama"
                      readonly
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="rounded-t w-1/2">
                <div class="w-full" v-if="jenis_simpanan == '2'">
                  <div class="text-gray-700 flex items-center mx-[26px] w-full space-x-5">
                    <div class="mb-1 w-[35%] text-xs">
                      <label>Setoran Awal</label>
                    </div>
                    <span class="mr-3 pb-2">:</span>
                    <div class="w-3/5 flex-grow">
                      <input
                        class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                        type="text"
                        v-model="setoran_awal"
                        readonly
                        required
                      />
                    </div>
                  </div>
                  <div class="text-gray-700 flex items-center mx-[26px] w-full space-x-5">
                    <div class="mb-1 w-[35%] text-xs">
                      <label>Jangka Waktu</label>
                    </div>
                    <span class="mr-3 pb-2">:</span>
                    <div class="w-3/5 flex-grow">
                      <input
                        class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                        type="text"
                        v-model="jangka_waktu"
                        readonly
                        required
                      />
                    </div>
                  </div>
                  <div class="text-gray-700 flex items-center mx-[26px] w-full">
                    <div class="mb-1 w-2/5 text-xs">
                      <label>Mulai Tanggal</label>
                    </div>
                    <span class="mr-3 pb-2">:</span>
                    <div class="w-3/5 flex-grow">
                      <input
                        class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                        type="date"
                        v-model="mulai_tanggal"
                        readonly
                        required
                      />
                    </div>
                  </div>
                  <div class="text-gray-700 flex items-center mx-[26px] w-full">
                    <div class="mb-1 w-2/5 text-xs">
                      <label>S/D. Tanggal ARO</label>
                    </div>
                    <span class="mr-3 pb-2">:</span>
                    <div class="w-3/5 flex-grow">
                      <input
                        class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                        type="text"
                        v-model="tanggal_selesai"
                        required
                        :readonly="isView"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-3 rounded-t w-5/12">
              <div class="text-gray-700 flex items-center mx-auto w-9/12 pt-3">
                <div class="mb-1 w-2/5 text-xs">
                  <label>Saldo Sekarang</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    v-model="saldo_sekarang"
                    readonly
                  />
                </div>
              </div>
              <div class="text-gray-700 flex items-center mx-auto w-9/12 pb-3">
                <div class="mb-1 w-2/5 text-xs">
                  <label>Saldo Blokir</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    v-model="saldo_blokir"
                    readonly
                  />
                </div>
              </div>
              <div
                class="text-gray-700 flex items-center mx-auto w-9/12 mb-3 border-t-2 border-white pt-1"
              >
                <div class="mb-1 w-2/5 text-xs">
                  <label>Max Pengambilan</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    v-model="max_pengambilan"
                    readonly
                  />
                </div>
              </div>
              <div
                class="text-gray-700 flex items-center mx-auto w-9/12 border-t-2 border-white pt-1"
              >
                <div class="flex items-center w-1/3">
                  <input
                    id="blokir-checkbox"
                    type="checkbox"
                    v-model="blokir_check"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="blokir-checkbox" class="ml-2 text-xs font-medium">Blokir</label>
                </div>
                <div class="flex items-center w-1/3">
                  <input
                    id="autodebet-checkbox"
                    type="checkbox"
                    v-model="autodebet_check"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="autodebet-checkbox" class="ml-2 text-xs font-medium">Autodebet</label>
                </div>
                <div class="flex items-center w-1/3">
                  <input
                    id="catatan-checkbox"
                    type="checkbox"
                    v-model="catatan_check"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="catatan-checkbox" class="ml-2 text-xs font-medium">Catatan</label>
                </div>
              </div>
            </div>
          </div>
          <div class="flex items-center justify-center w-full bg-slate-100 border-t-2 border-white">
            <div class="p-3 rounded-t w-7/12">
              <div class="text-gray-700 flex items-center mx-[26px] w-1/2 space-x-5">
                <div class="mb-1 w-[35%] text-xs">
                  <label>Petugas</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    v-model="petugas"
                    required
                  />
                </div>
              </div>
            </div>
            <div class="p-3 rounded-t w-5/12">
              <div class="text-gray-700 flex items-center mx-auto w-9/12">
                <div class="mb-1 w-2/5 text-xs">
                  <label>Tgl Tutup Rekening</label>
                </div>
                <span class="mr-3 pb-2">:</span>
                <div class="w-3/5 flex-grow">
                  <input
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="date"
                    v-model="tgl_tutup_rekening"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </ModalBody>
    <ModalFooter class="text-right">
      <button type="button" class="btn btn-outline-secondary w-32 mr-1" @click="resetForm">
        Cancel
      </button>
      <button v-if="!isView" type="submit" form="daftarSimpataForm" class="btn btn-primary w-32">
        Simpan
      </button>
    </ModalFooter>
  </Modal>
  <Modal backdrop="static" size="modal-xl" :show="modal_nasabah" @hidden="modal_nasabah = false">
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">Daftar Anggota/ Nasabah</h2>

      <a
        data-tw-dismiss="modal"
        href="javascript:;"
        class="border bg-danger rounded-lg hover:bg-red-700 -my-5 -mr-3"
      >
        <XIcon class="lucide lucide-x w-7 h-7 text-white hover:text-slate-100" />
      </a>
    </ModalHeader>
    <ModalBody>
      <DaftarNasabah @selectNasabah="getNasabah" />
    </ModalBody>
    <ModalFooter class="text-right italic">
      * Klik 2 kali untuk memilih Nasabah/ Anggota
    </ModalFooter>
  </Modal>

  <Modal backdrop="static" :show="modal_delete" @hidden="modal_delete = false">
    <ModalBody class="p-0">
      <div class="p-5 text-center">
        <XCircleIcon class="w-16 h-16 text-danger mx-auto mt-3" />
        <div class="text-3xl mt-5">Apakah Anda Yakin ?</div>
        <div class="text-slate-500 mt-2">
          Ingin menghapus <span v-if="userIds.length > 1">Beberapa</span> data dengan ID <br />
          <b> {{ userIds.length > 1 ? userIds : userIds[0] }} </b> ? <br />Data yang telah dihapus
          tidak bisa kembali.
        </div>
      </div>
      <div class="px-5 pb-8 text-center">
        <button
          type="button"
          @click=";(userIds = []), (modal_delete = false)"
          class="btn btn-outline-secondary w-24 mr-1 text-xs"
        >
          Batal
        </button>
        <button
          type="button"
          class="btn btn-danger w-24 text-xs"
          @click="
            (e) => {
              e.preventDefault()
              deletePinjaman()
            }
          "
        >
          Hapus
        </button>
      </div>
    </ModalBody>
  </Modal>
</template>
