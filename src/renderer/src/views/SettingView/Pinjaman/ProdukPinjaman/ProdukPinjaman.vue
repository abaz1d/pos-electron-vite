<script setup>
import { useProdukPinjamanStore } from '@renderer/stores/produkPinjaman.js'
import { onMounted, ref, watch, inject } from 'vue'
import moment from 'moment'
import Breadcrumbs from '@renderer/components/Breadcrumbs/Breadcrumbs.vue'
import SETTING from '@renderer/assets/images/menu/setting.svg'

const swal = inject('$swal')
const produkPinjaman = useProdukPinjamanStore()
const Perkiraan_list = ref('')
const isLoading = ref(false)
const isAdd = ref(false)
const isEdit = ref(false)
const isView = ref(false)
const modal_utama = ref(false)
const modal_delete = ref(false)
const sort_by = ref('sandi')
const sort_mode = ref(true)
const search_data = ref('')
const search_type = ref('sandi')
const page_number = ref(1)
const total_pages = ref(0)
const row_per_page = ref(50)
const allSelected = ref(false)
const userIds = ref([])
const id_produk = ref('')
const kode_produk = ref('')
const nama_produk = ref('')
const kode_perhitungan = ref('')
const pembulatan_angsuran = ref('')
const jasa_perbulan = ref('')
const periode_pembayaran = ref('')
const administrasi = ref('')
const provisi = ref('')
const jurnal_pokok_pinjaman = ref('')
const jurnal_jasa_pinjaman = ref('')
const jurnal_denda_pinjaman = ref('')
const jurnal_admin = ref('')
const jurnal_provisi = ref('')
const jurnal_akrual = ref('')
const jurnal_ppap = ref('')

const addGet = () => {
  isAdd.value = true
  modal_utama.value = true
}
const editGet = async (e) => {
  const anggota = await produkPinjaman.getItem(e)
  isEdit.value = true
  id_produk.value = anggota.id
  kode_produk.value = anggota.sandi
  nama_produk.value = anggota.keterangan
  kode_perhitungan.value = anggota.kdhit
  pembulatan_angsuran.value = anggota.pembulatan
  jasa_perbulan.value = anggota.rate
  periode_pembayaran.value = anggota.periode
  administrasi.value = anggota.adm
  provisi.value = anggota.prov
  jurnal_pokok_pinjaman.value = anggota.jurnal_pokok == '' ? '-' : anggota.jurnal_pokok
  jurnal_jasa_pinjaman.value = anggota.jurnal_jasa == '' ? '-' : anggota.jurnal_jasa
  jurnal_denda_pinjaman.value = anggota.jurnal_denda == '' ? '-' : anggota.jurnal_denda
  jurnal_admin.value = anggota.jurnal_adm == '' ? '-' : anggota.jurnal_adm
  jurnal_provisi.value = anggota.jurnal_prov == '' ? '-' : anggota.jurnal_prov
  jurnal_akrual.value = anggota.jurnal_yadit == '' ? '-' : anggota.jurnal_yadit
  jurnal_ppap.value = anggota.jurnal_ppap == '' ? '-' : anggota.jurnal_ppap
  modal_utama.value = true
}
const deleteGet = (e) => {
  const anggota = e

  if (anggota.id) {
    userIds.value = []
    userIds.value.push(anggota.id)
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
  const anggota = await produkPinjaman.getItem(e)
  isView.value = true
  id_produk.value = anggota.id
  kode_produk.value = anggota.sandi
  nama_produk.value = anggota.keterangan
  kode_perhitungan.value = anggota.kdhit
  pembulatan_angsuran.value = anggota.pembulatan
  jasa_perbulan.value = anggota.rate
  periode_pembayaran.value = anggota.periode
  administrasi.value = anggota.adm
  provisi.value = anggota.prov
  jurnal_pokok_pinjaman.value = anggota.jurnal_pokok
  jurnal_jasa_pinjaman.value = anggota.jurnal_jasa
  jurnal_denda_pinjaman.value = anggota.jurnal_denda
  jurnal_admin.value = anggota.jurnal_adm
  jurnal_provisi.value = anggota.jurnal_prov
  jurnal_akrual.value = anggota.jurnal_yadit
  jurnal_ppap.value = anggota.jurnal_ppap
  modal_utama.value = true
}
const simpan_data = async (e) => {
  try {
    await produkPinjaman.postItem(
      id_produk.value,
      kode_produk.value,
      nama_produk.value,
      kode_perhitungan.value,
      pembulatan_angsuran.value,
      jasa_perbulan.value,
      periode_pembayaran.value,
      administrasi.value,
      provisi.value,
      jurnal_pokok_pinjaman.value,
      jurnal_jasa_pinjaman.value,
      jurnal_denda_pinjaman.value,
      jurnal_admin.value,
      jurnal_provisi.value,
      jurnal_akrual.value,
      jurnal_ppap.value,
      isEdit.value
    )
    e.target.reset()
    resetForm()
  } catch (error) {
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'ERROR SIMPAN DATA:  ' + error
    })
  }
}
const deleteAnggota = async () => {
  if (userIds.value.length > 1) {
    for (let idAnggota = 0; idAnggota < userIds.value.length; idAnggota++) {
      console.log('delete post 1+', userIds.value[idAnggota])
      await produkPinjaman.removeItem(userIds.value[idAnggota])
    }
  } else {
    console.log('delete post 1', userIds.value)
    await produkPinjaman.removeItem(userIds.value[0])
  }
  resetForm()
}
const resetForm = () => {
  if (modal_utama.value == false && isEdit.value == false && isView.value == false) {
    search_data.value = ''
    search_type.value = 'sandi'
    sort_by.value = 'sandi'
    sort_mode.value = true
    page_number.value = 1
    total_pages.value = 0
    row_per_page.value = 50
  }
  allSelected.value = false
  userIds.value = []
  id_produk.value = ''
  kode_produk.value = ''
  nama_produk.value = null
  pembulatan_angsuran.value = null
  jasa_perbulan.value = null
  kode_perhitungan.value = null
  jurnal_admin.value = null
  jurnal_provisi.value = null
  jurnal_denda_pinjaman.value = null
  periode_pembayaran.value = null
  provisi.value = null
  jurnal_pokok_pinjaman.value = null
  jurnal_jasa_pinjaman.value = null
  jurnal_akrual.value = ''
  jurnal_ppap.value = ''
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
    await produkPinjaman.readItem(
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
      text: 'GAGAL SORTING: ' + error
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
    await produkPinjaman.readItem(
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
    const data = await produkPinjaman.readItem(
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
    const data = await produkPinjaman.readItem(
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
    const data = await produkPinjaman.readItem(
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
    for (let anggota = 0; anggota < produkPinjaman.items.length; anggota++) {
      userIds.value.push(produkPinjaman.items[anggota].id)
    }
  }
}
const selectOne = () => {
  allSelected.value = false
}

onMounted(async () => {
  try {
    isLoading.value = true
    const data = await produkPinjaman.readItem(
      search_type.value,
      search_data.value,
      sort_by.value,
      sort_mode.value,
      page_number.value,
      row_per_page.value
    )
    Perkiraan_list.value = data.perkiraan
    total_pages.value = data.total_pages
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
  <Breadcrumbs title="Setting" subTitle="Pinjaman" :icon="SETTING" />
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
          to="/laporan-daftar-anggota"
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
          to="/laporan-daftar-anggota"
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
          to="/laporan-daftar-anggota"
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
              <option value="keterangan">Keterangan</option>
              <option value="sandi">Sandi</option>
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
              class="text-center uppercase border cursor-pointer hover:bg-blue-300 w-20 pl-1"
              @click="sorting('sandi')"
            >
              SANDI
              <SortAscIcon
                v-if="sort_by === 'sandi' && sort_mode"
                class="inline ml-1 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'sandi' && !sort_mode"
                class="inline ml-1 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('keterangan')"
            >
              Keterangan
              <SortAscIcon
                v-if="sort_by === 'keterangan' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'keterangan' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('TGLINP')"
            >
              Tanggal INP
              <SortAscIcon
                v-if="sort_by === 'TGLINP' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'TGLINP' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('kantor')"
            >
              Kantor
              <SortAscIcon
                v-if="sort_by === 'kantor' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'kantor' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th scope="col" class="text-center uppercase border">Actions</th>
          </tr>
        </thead>
        <tbody class="overflow-y-scroll" v-show="!isLoading">
          <tr
            class="bg-white hover:bg-lime-300 hover:text-slate-700 drop-shadow-2xl group"
            v-for="produk in produkPinjaman.items"
            :key="produk.sandi"
            :produk="produk"
            :value="produk.sandi"
          >
            <td class="w-4 border-r border-b font-medium p-0 pl-3">
              <div class="flex items-center">
                <span
                  class="hidden cursor-pointer -ml-[9px] mr-[1px] rotate-90 group-hover:block text-black"
                  >:::</span
                >
                <input
                  :value="produk.id"
                  type="checkbox"
                  v-model="userIds"
                  @click="selectOne"
                  class="data-checkbox w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2"
                />
              </div>
            </td>
            <th
              @dblclick="viewData(produk.id)"
              scope="row"
              class="border-r border-b font-medium whitespace-nowrap pl-2"
            >
              {{ produk.sandi }}
            </th>
            <td
              @dblclick="viewData(produk.id)"
              class="min-w-max text-center border-r border-b font-medium px-2"
            >
              {{ produk.keterangan }}
            </td>
            <td
              @dblclick="viewData(produk.id)"
              class="min-w-max text-center border-r border-b font-medium px-2"
            >
              {{ moment(produk.TGLINP).format('DD-MM-YYYY') }}
            </td>
            <td
              @dblclick="viewData(produk.id)"
              class="min-w-max text-center border-r border-b font-medium px-2"
            >
              {{ produk.kantor }}
            </td>
            <td class="min-w-max border-r border-b font-medium p-1">
              <div class="flex justify-center">
                <a
                  @click="editGet(produk.id)"
                  class="flex items-center mr-4 hover:text-blue-700 text-sky-600"
                  href="javascript:;"
                >
                  <CheckSquareIcon class="w-3 h-3 mr-1" /> Edit
                </a>
                <a
                  @click="deleteGet(produk)"
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
  <Modal backdrop="static" size="modal-lg" :show="modal_utama" @hidden="modal_utama = false">
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">
        <span v-if="isAdd">Tambah </span><span v-if="isEdit">Edit </span
        ><span v-if="isView">Data </span> Produk
        <span v-if="isEdit || isView">{{ id_produk }}</span>
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
      <form method="post" id="produkPinjamanForm" @submit.prevent="simpan_data">
        <div class="bg-pink-100 p-3 rounded-t">
          <div class="text-gray-700 flex items-center mx-auto w-9/12">
            <div class="mb-1 w-2/5 text-xs">
              <label>Kode Produk</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                type="text"
                v-model="kode_produk"
                maxlength="4"
                required
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-9/12">
            <div class="mb-1 w-2/5 text-xs">
              <label>Nama Produk</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                type="text"
                v-model="nama_produk"
                maxlength="40"
                required
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-9/12">
            <div class="mb-1 w-2/5 text-xs">
              <label>Kode Perhitungan</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                type="text"
                v-model="kode_perhitungan"
                maxlength="1"
                required
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-9/12">
            <div class="mb-1 w-2/5 text-xs">
              <label>Pembulatan Angsuran</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                type="number"
                v-model="pembulatan_angsuran"
                maxlength="4"
                required
              />
            </div>
          </div>
        </div>
        <div class="w-full uppercase px-2 text-center bg-slate-100 font-medium text-sm">
          Default Isian
        </div>
        <div class="bg-pink-100 p-3 rounded-t">
          <div class="text-gray-700 flex items-center mx-auto w-9/12">
            <div class="mb-1 w-2/5 text-xs">
              <label>Jasa Perbulan (%)</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                type="number"
                v-model="jasa_perbulan"
                required
                step="0.1"
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-9/12 mb-1">
            <div class="mb-1 w-2/5 text-xs">
              <label>Periode Pembayaran</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <select
                name="periode_list"
                id="periode_list"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
                v-model="periode_pembayaran"
                required
              >
                <option value="HARIAN">HARIAN</option>
                <option value="PASARAN">PASARAN</option>
                <option value="MINGGUAN">MINGGUAN</option>
                <option value="BULANAN        ">BULANAN</option>
                <option value="MUSIMAN">MUSIMAN</option>
              </select>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-9/12">
            <div class="mb-1 w-2/5 text-xs">
              <label>Administrasi (%)</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                type="number"
                v-model="administrasi"
                step="0.1"
                required
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-9/12">
            <div class="mb-1 w-2/5 text-xs">
              <label>Provisi (%)</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                type="number"
                step="0.1"
                v-model="provisi"
                required
              />
            </div>
          </div>
        </div>
        <div class="w-full uppercase px-2 text-center bg-slate-100 font-medium text-sm">
          Rekening Jurnal Akuntansi
        </div>
        <div class="bg-pink-100 p-3 rounded-b">
          <div class="text-gray-700 flex items-center mx-auto w-9/12 mb-1">
            <div class="mb-1 w-2/5 text-xs">
              <label>Jurnal Pokok Pinjaman</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <select
                name="jurnal_pokok_pinjaman"
                id="jurnal_pokok_pinjaman"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
                v-model="jurnal_pokok_pinjaman"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-9/12 mb-1">
            <div class="mb-1 w-2/5 text-xs">
              <label>Jurnal Jasa Pinjaman</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <select
                name="jurnal_jasa_pinjaman"
                id="jurnal_jasa_pinjaman"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
                v-model="jurnal_jasa_pinjaman"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-9/12 mb-1">
            <div class="mb-1 w-2/5 text-xs">
              <label>Jurnal Denda Pinjaman</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <select
                name="jurnal_denda_pinjaman"
                id="jurnal_denda_pinjaman"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
                v-model="jurnal_denda_pinjaman"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-9/12 mb-1">
            <div class="mb-1 w-2/5 text-xs">
              <label>Jurnal Administrasi</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <select
                name="jurnal_admin"
                id="jurnal_admin"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
                v-model="jurnal_admin"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-9/12 mb-1">
            <div class="mb-1 w-2/5 text-xs">
              <label>Jurnal Provisi</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <select
                name="jurnal_provisi"
                id="jurnal_provisi"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
                v-model="jurnal_provisi"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-9/12 mb-1">
            <div class="mb-1 w-2/5 text-xs">
              <label>Jurnal Pend. Jasa Akrual</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <select
                name="jurnal_akrual"
                id="jurnal_akrual"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
                v-model="jurnal_akrual"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-9/12 mb-1">
            <div class="mb-1 w-2/5 text-xs">
              <label>Jurnal PPAP</label>
            </div>
            <span class="mr-3 pb-2">:</span>
            <div class="w-3/5 flex-grow">
              <select
                name="jurnal_ppap"
                id="jurnal_ppap"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
                v-model="jurnal_ppap"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </ModalBody>
    <ModalFooter class="text-right">
      <button type="button" class="btn btn-outline-secondary w-32 mr-1" @click="resetForm">
        Cancel
      </button>
      <button v-if="!isView" type="submit" form="produkPinjamanForm" class="btn btn-primary w-32">
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
          Ingin menghapus <span v-if="userIds.length > 1">Beberapa</span> data dengan SANDI <br />
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
              deleteAnggota()
            }
          "
        >
          Hapus
        </button>
      </div>
    </ModalBody>
  </Modal>
</template>
