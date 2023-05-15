<script setup>
import { useDaftarPinjamanStore } from '@renderer/stores/daftarPinjaman.js'
import { onMounted, ref, watch, inject } from 'vue'
import moment from 'moment'
import Breadcrumbs from '@renderer/components/Breadcrumbs/Breadcrumbs.vue'
import { list_jenis_kelamin, list_agama, list_resort } from '@renderer/utils/json'
import { currencyFormatter } from '@renderer/utils/helper'
import TRANSAKSI from '@renderer/assets/images/menu/transaksi.svg'

const swal = inject('$swal')
const daftarPinjaman = useDaftarPinjamanStore()
const isLoading = ref(false)
const isAdd = ref(false)
const isEdit = ref(false)
const isView = ref(false)
const modal_utama = ref(false)
const modal_delete = ref(false)
const sort_by = ref('a.nama')
const sort_mode = ref(true)
const search_data = ref('')
const search_type = ref('a.nama')
const page_number = ref(1)
const total_pages = ref(0)
const row_per_page = ref(50)
const allSelected = ref(false)
const userIds = ref([])

const tanggal = ref(moment(Date.now()).format('DD-MM-YYYY'))
const no_anggota = ref('')
const no_pk = ref('')
const norek = ref('')
const jenis_kredit = ref('')
const resort = ref('')
const nama_lengkap = ref('')
const pendamping = ref('')
const alamat = ref('')
const desa = ref('')
const kecamatan = ref('')
const kota = ref('')
const pokok_pinj = ref('')
const suku_bunga = ref('')
const cara_hitung = ref('')
const lama_durasi = ref('')
const admin = ref('')
const provisi = ref('')
const tgl_jatuh_tempo = ref('')
const tgl_alih_bunga = ref('')
const tgl_valuta = ref('')
const tgl_lunas = ref('')
const norek_lama = ref('')
const angsuran_pokok = ref('')
const angsuran_jasa = ref('')
const angsuran_bulanan = ref('')
const sisa_pokok = ref('')
const sisa_jasa = ref('')
const saldo_pinjaman = ref('')

const addGet = () => {
  isAdd.value = true
  modal_utama.value = true
}
const editGet = async (e) => {
  const pinjaman = await daftarPinjaman.getItem(e)
  console.log(pinjaman)
  no_anggota.value = pinjaman.cif
  no_pk.value = pinjaman.nopk
  norek.value = pinjaman.norek
  jenis_kredit.value = pinjaman.jenis
  resort.value = pinjaman.marketing
  nama_lengkap.value = pinjaman.nama
  pendamping.value = pinjaman.statuskawin
  alamat.value = pinjaman.alamat
  desa.value = pinjaman.desa
  kecamatan.value = pinjaman.kecamatan
  kota.value = pinjaman.kota
  pokok_pinj.value = pinjaman.pokok
  suku_bunga.value = pinjaman.rate
  cara_hitung.value = pinjaman.kdhit
  lama_durasi.value = pinjaman.lama
  admin.value = pinjaman.adm
  provisi.value = pinjaman.provisi
  tgl_jatuh_tempo.value = pinjaman.tgljtempo
  //tgl_alih_bunga.value = pinjaman.
  tgl_valuta.value = pinjaman.tglvaluta
  tgl_lunas.value = pinjaman.tgllunas
  norek_lama.value = pinjaman.norek_lama
  angsuran_pokok.value = pinjaman.pot_pokok
  angsuran_jasa.value = pinjaman.pot_bunga
  angsuran_bulanan.value = pinjaman.pot_pokok + pinjaman.pot_bunga
  sisa_pokok.value = pinjaman.sisapokok
  sisa_jasa.value = pinjaman.pot_bunga
  // saldo_pinjaman.value = pinjaman.
  isEdit.value = true

  modal_utama.value = true
}
const deleteGet = (e) => {
  const pinjaman = e

  if (pinjaman.norek) {
    userIds.value = []
    userIds.value.push(pinjaman.norek)
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
  const pinjaman = await daftarPinjaman.getItem(e)
  isView.value = true

  modal_utama.value = true
}
const simpan_data = async (e) => {
  try {
    await daftarPinjaman.postItem(
      //console.log(
      norek.value
    )
    e.target.reset()
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
      await daftarPinjaman.removeItem(userIds.value[idPinjaman])
    }
  } else {
    console.log('delete post 1', userIds.value)
    await daftarPinjaman.removeItem(userIds.value[0])
  }
  resetForm()
}
const resetForm = () => {
  if (modal_utama.value == false && isEdit.value == false && isView.value == false) {
    search_data.value = ''
    search_type.value = 'nama'
    sort_by.value = 'nama'
    sort_mode.value = true
    page_number.value = 1
    total_pages.value = 0
    row_per_page.value = 50
  }
  allSelected.value = false
  userIds.value = []
  norek.value = ''
  nama_lengkap.value = ''
  no_anggota.value = null
  jenis_kredit.value = null
  pokok_pinj.value = null
  no_pk.value = null
  lama_durasi.value = null
  tgl_valuta.value = null
  tgl_alih_bunga.value = null
  suku_bunga.value = null
  cara_hitung.value = null
  provisi.value = null
  admin.value = null
  tanggal.value = moment(Date.now()).format('DD-MM-YYYY')
  tgl_lunas.value = ''
  norek_lama.value = ''
  angsuran_pokok.value = ''
  angsuran_jasa.value = ''
  angsuran_bulanan.value = ''
  sisa_pokok.value = ''
  sisa_jasa.value = ''
  alamat.value = ''
  desa.value = ''
  kecamatan.value = ''
  kota.value = ''
  pendamping.value = ''
  resort.value = ''
  saldo_pinjaman.value = ''
  modal_utama.value = false
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
    await daftarPinjaman.readItem(
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
    await daftarPinjaman.readItem(
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
    const data = await daftarPinjaman.readItem(
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
    const data = await daftarPinjaman.readItem(
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
    const data = await daftarPinjaman.readItem(
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

const selectAll = (e) => {
  userIds.value = []

  if (!allSelected.value || e) {
    for (let pinjaman = 0; pinjaman < daftarPinjaman.items.length; pinjaman++) {
      userIds.value.push(daftarPinjaman.items[pinjaman].norek)
    }
  }
}
const selectOne = () => {
  allSelected.value = false
}

onMounted(async () => {
  try {
    isLoading.value = true
    const data = await daftarPinjaman.readItem(
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
  <Breadcrumbs title="Transaksi" subTitle="Pinjaman dan Pembiayaan" :icon="TRANSAKSI" />
  <div class="relative top-0 bg-white w-full border-y-2 border-[#d0d3d4]">
    <div class="flex space-x-4 w-full justify-center m-auto px-5">
      <div class="grid grid-cols-8 xl:grid-cols-10 w-full h-10">
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
          to="/laporan-daftar-pinjaman"
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
          to="/laporan-daftar-pinjaman"
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
          to="/laporan-daftar-pinjaman"
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
      <div class="flex order-2 w-full h-10">
        <div id="pagination" class="mx-auto">
          <div class="inline-flex align-middle leading-tight text-xs">
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
      <div class="items-center justify-center w-full flex h-10">
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
              <option value="norek">norek</option>
              <option value="cif">No Anggota</option>
              <option value="pokok">Pokok</option>
              <option value="alamat">Alamat</option>
              <option value="kecamatan">kecamatan</option>
              <option value="kota">Kota</option>
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
              @click="sorting('tanggal')"
            >
              Tanggal
              <SortAscIcon
                v-if="sort_by === 'tanggal' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'tanggal' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('norek')"
            >
              Norek
              <SortAscIcon
                v-if="sort_by === 'norek' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'norek' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('cif')"
            >
              No Anggota
              <SortAscIcon
                v-if="sort_by === 'cif' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'cif' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('nama')"
            >
              Nama
              <SortAscIcon
                v-if="sort_by === 'nama' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'nama' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('alamat')"
            >
              Alamat
              <SortAscIcon
                v-if="sort_by === 'alamat' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'alamat' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('kecamatan')"
            >
              Kecamatan
              <SortAscIcon
                v-if="sort_by === 'kecamatan' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'kecamatan' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('kota')"
            >
              Kota
              <SortAscIcon
                v-if="sort_by === 'kota' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'kota' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('pokok')"
            >
              Pinjaman Pokok
              <SortAscIcon
                v-if="sort_by === 'pokok' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'pokok' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('marketing')"
            >
              Resort
              <SortAscIcon
                v-if="sort_by === 'marketing' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'marketing' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('opt')"
            >
              User ID
              <SortAscIcon
                v-if="sort_by === 'opt' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'opt' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th scope="col" class="text-center uppercase border">Actions</th>
          </tr>
        </thead>
        <tbody class="overflow-y-scroll" v-show="!isLoading">
          <tr
            class="bg-white hover:bg-lime-300 hover:text-slate-700 drop-shadow-2xl group"
            v-for="pinjaman in daftarPinjaman.items"
            :key="pinjaman.norek"
            :pinjaman="pinjaman"
            :value="pinjaman.norek"
          >
            <td class="w-4 border-r border-b font-medium p-0 pl-3">
              <div class="flex items-center">
                <span
                  class="hidden cursor-pointer -ml-[9px] mr-[1px] rotate-90 group-hover:block text-black"
                  >:::</span
                >
                <input
                  :value="pinjaman.norek"
                  type="checkbox"
                  v-model="userIds"
                  @click="selectOne"
                  class="data-checkbox w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2"
                />
              </div>
            </td>
            <th
              @dblclick="viewData(pinjaman.norek)"
              scope="row"
              class="border-r border-b font-medium whitespace-nowrap pl-2"
            >
              {{ moment(pinjaman.tanggal).format('DD-MM-YYYY') }}
            </th>
            <td
              @dblclick="viewData(pinjaman.norek)"
              class="min-w-max text-center border-r border-b font-medium px-2"
            >
              {{ pinjaman.norek }}
            </td>
            <td
              @dblclick="viewData(pinjaman.norek)"
              class="min-w-max text-center border-r border-b font-medium px-2"
            >
              {{ pinjaman.cif }}
            </td>
            <td
              @dblclick="viewData(pinjaman.norek)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ pinjaman.nama }}
            </td>
            <td
              @dblclick="viewData(pinjaman.norek)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ pinjaman.alamat }}
            </td>
            <td
              @dblclick="viewData(pinjaman.norek)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ pinjaman.kecamatan }}
            </td>
            <td
              @dblclick="viewData(pinjaman.norek)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ pinjaman.kota }}
            </td>
            <td
              @dblclick="viewData(pinjaman.norek)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ currencyFormatter.format(pinjaman.pokok) }}
            </td>
            <td
              @dblclick="viewData(pinjaman.norek)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ pinjaman.marketing }}
            </td>
            <td
              @dblclick="viewData(pinjaman.norek)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ pinjaman.opt }}
            </td>
            <td class="min-w-max border-r border-b font-medium p-1">
              <div class="flex justify-center">
                <a
                  @click="editGet(pinjaman.norek)"
                  class="flex items-center mr-4 hover:text-blue-700 text-sky-600"
                  href="javascript:;"
                >
                  <CheckSquareIcon class="w-3 h-3 mr-1" /> Edit
                </a>
                <a
                  @click="deleteGet(pinjaman)"
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
        ><span v-if="isView">Data </span> Pinjaman
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
        class="flex space-x-4 -mx-5 py-2 justify-center -mt-5 mb-3 bg-gray-100"
      >
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-amber-800 bg-white hover:bg-slate-200"
          title="Cek Saldo"
        >
          <WalletIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Cek Saldo</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-slate-600 bg-white hover:bg-slate-200"
          title="Angsuran"
        >
          <TimerIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Angsuran</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-amber-400 bg-white hover:bg-slate-200"
          title="Jadwal"
        >
          <CalendarDaysIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Jadwal</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-amber-700 bg-white hover:bg-slate-200"
          title="Debius"
        >
          <LogOutIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Debius</span
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
          class="px-2 h-10 border rounded-md box flex items-center text-primary bg-white hover:bg-slate-200"
          title="Jaminan"
        >
          <GemIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Jaminan</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-green-600 bg-white hover:bg-slate-200"
          title="Lain - Lain"
        >
          <CircleEllipsisIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Lain - Lain</span
          >
        </button>
      </div>
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
                  readonly
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-9/12">
              <div class="mb-1 w-2/5 text-xs">
                <label>No Anggota</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="no_anggota"
                  required
                />
              </div>
            </div>
          </div>
          <div class="bg-slate-100 p-3 rounded-t w-1/3">
            <div class="text-gray-700 flex items-center mx-auto w-9/12">
              <div class="mb-1 w-2/5 text-xs">
                <label>Nomor PK</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="no_pk"
                  required
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
                />
              </div>
            </div>
          </div>
          <div class="bg-slate-100 p-3 rounded-t w-1/3">
            <div class="text-gray-700 flex items-center mx-auto w-9/12">
              <div class="mb-1 w-2/5 text-xs">
                <label>Jenis Kredit</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="jenis_kredit"
                  required
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-9/12">
              <div class="mb-1 w-2/5 text-xs">
                <label>Resort</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="resort"
                  required
                />
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
                />
              </div>
            </div>
          </div>
        </div>
        <hr />
        <div class="flex items-center justify-center w-full">
          <div class="bg-slate-100 p-3 rounded-t w-7/12">
            <div class="text-gray-700 flex items-center mx-[26px] w-[48%]">
              <div class="mb-1 w-2/5 text-xs">
                <label>Pokok Pinj.</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="pokok_pinj"
                  required
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-11/12 space-x-5">
              <div class="mb-1 w-2/5 text-xs">
                <label>Suku Bunga</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="suku_bunga"
                  required
                />
              </div>
              <div class="mb-1 w-3/6 text-xs">
                <label>Admin</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/6 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="admin"
                  required
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-11/12 space-x-5">
              <div class="mb-1 w-2/5 text-xs">
                <label>Cara Hitung</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="cara_hitung"
                  required
                />
              </div>
              <div class="mb-1 w-3/6 text-xs">
                <label>Provisi</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/6 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="provisi"
                  required
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-[26px] w-[48%]">
              <div class="mb-1 w-2/5 text-xs">
                <label>Lama</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="lama_durasi"
                  required
                />
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="lama_durasi"
                  required
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-11/12 space-x-5">
              <div class="mb-1 w-3/6 text-xs">
                <label>Tgl Jatuh Tempo</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/6 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="tgl_jatuh_tempo"
                  required
                />
              </div>
              <div class="mb-1 w-3/6 text-xs">
                <label>Tgl Valuta</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/6 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="tgl_valuta"
                  required
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-11/12 space-x-5">
              <div class="mb-1 w-3/6 text-xs">
                <label>Tgl Alih Bunga</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/6 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="tgl_alih_bunga"
                  required
                />
              </div>
              <div class="mb-1 w-3/6 text-xs">
                <label>Tgl Lunas</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/6 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="tgl_lunas"
                  required
                />
              </div>
            </div>
          </div>
          <div class="bg-slate-100 p-3 rounded-t w-5/12">
            <div class="text-gray-700 flex items-center mx-auto w-9/12">
              <div class="mb-1 w-2/5 text-xs">
                <label>Norek Lama</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="norek_lama"
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-9/12">
              <div class="mb-1 w-2/5 text-xs">
                <label>Angsuran Pokok</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="angsuran_pokok"
                  required
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-9/12">
              <div class="mb-1 w-2/5 text-xs">
                <label>Angsuran Jasa</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="angsuran_jasa"
                  required
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-9/12">
              <div class="mb-1 w-2/5 text-xs">
                <label>Angsuran Perbulan</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="angsuran_bulanan"
                  required
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-9/12">
              <div class="mb-1 w-2/5 text-xs">
                <label>Sisa Pokok</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="sisa_pokok"
                  required
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-9/12">
              <div class="mb-1 w-2/5 text-xs">
                <label>Sisa Jasa</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="sisa_jasa"
                  required
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-9/12">
              <div class="mb-1 w-2/5 text-xs">
                <label>Saldo Pinjaman</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="text"
                  v-model="saldo_pinjaman"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button type="button" class="btn btn-outline-secondary w-32 mr-1" @click="resetForm">
        Cancel
      </button>
      <button v-if="!isView" type="submit" form="daftarPinjamanForm" class="btn btn-primary w-32">
        Simpan
      </button>
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
          @click="modal_delete = false"
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
