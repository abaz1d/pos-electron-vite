<script setup>
import { useJurnalTransaksiStore } from '@renderer/stores/jurnalTransaksi.js'
import { onBeforeMount, ref, watch } from 'vue'
import { currencyFormatter } from '@renderer/utils/helper'
import Breadcrumbs from '@renderer/components/Breadcrumbs/Breadcrumbs.vue'
import moment from 'moment'
import TRANSAKSI from '@renderer/assets/menu/transaksi.svg'

const jurnalTransaksi = useJurnalTransaksiStore()
const isLoading = ref(false)
const isAdd = ref(false)
const isEdit = ref(false)
const isView = ref(false)
const modal_utama = ref(false)
const modal_delete = ref(false)
const sort_by = ref('idtrans')
const sort_mode = ref(true)
const search_data = ref('')
const search_type = ref('idtrans')
const page_number = ref(1)
const total_pages = ref(0)
const row_per_page = ref(50)
const allSelected = ref(false)
const userIds = ref([])
const KETERANGAN = ref('')

const addGet = () => {
  isAdd.value = true
  modal_utama.value = true
}
const deleteGet = (e) => {}
const editGet = async (e) => {}
const simpan_data = async (e) => {}
const viewData = async (e) => {
  try {
    if (e != '') {
      const data = await jurnalTransaksi.readPerkiraan(e)
      KETERANGAN.value = data
    } else {
      KETERANGAN.value = ''
    }
  } catch (error) {
    alert('ERROR VIEW DATA: ' + error)
  }
}
const resetForm = () => {
  if (isEdit.value == false && isView.value == false) {
    search_data.value = ''
    search_type.value = 'nama'
    sort_by.value = 'idtrans'
    sort_mode.value = true
    page_number.value = 1
    total_pages.value = 0
    row_per_page.value = 50
  }
  allSelected.value = false
  userIds.value = []
  KETERANGAN.value = ''

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
    await jurnalTransaksi.readItem(
      search_type.value,
      search_data.value,
      e,
      sort_mode.value,
      page_number.value,
      row_per_page.value
    )
    configureClass()
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    alert('Gagal sorting' + error)
  }
}
const firstPage = async () => {
  page_number.value = 1
  // try {
  //   isLoading.value = true
  //   await jurnalTransaksi.readItem(
  //     search_type.value,
  //     search_data.value,
  //     sort_by.value,
  //     sort_mode.value,
  //     1,
  //     row_per_page.value
  //   )
  //    configureClass()
  //   isLoading.value = false
  // } catch (error) {
  //   isLoading.value = false
  //   alert('Gagal page pertama' + error)
  // }
}
const previousPage = async () => {
  try {
    let page_no = parseInt(page_number.value)
    // isLoading.value = true
    if (page_no > 1) {
      page_number.value = page_no - 1
      // await jurnalTransaksi.readItem(
      //   search_type.value,
      //   search_data.value,
      //   sort_by.value,
      //   sort_mode.value,
      //   page_no - 1,
      //   row_per_page.value
      // )
    }
    //  configureClass()
    // isLoading.value = false
  } catch (error) {
    isLoading.value = false
    alert('Gagal page sebelumnya' + error)
  }
}
const nextPage = () => {
  try {
    // isLoading.value = true
    if (page_number.value == '') {
      page_number.value = 1
    }
    let page_no = parseInt(page_number.value)
    if (page_no < total_pages.value) {
      page_number.value = page_no + 1
      // jurnalTransaksi.readItem(
      //   search_type.value,
      //   search_data.value,
      //   sort_by.value,
      //   sort_mode.value,
      //   page_no + 1,
      //   row_per_page.value
      // )
    }
    //  configureClass()
    // isLoading.value = false
  } catch (error) {
    isLoading.value = false
    alert('Gagal page selanjutnya' + error)
  }
}
const lastPage = async () => {
  page_number.value = total_pages.value
  // try {
  //   isLoading.value = true
  //   await jurnalTransaksi.readItem(
  //     search_type.value,
  //     search_data.value,
  //     sort_by.value,
  //     sort_mode.value,
  //     total_pages.value,
  //     row_per_page.value
  //   )
  //    configureClass()
  //   isLoading.value = false
  // } catch (error) {
  //   isLoading.value = false
  //   alert('Gagal page terkhir' + error)
  // }
}
watch(page_number, async (e) => {
  try {
    isLoading.value = true
    await jurnalTransaksi.readItem(
      search_type.value,
      search_data.value,
      sort_by.value,
      sort_mode.value,
      e,
      row_per_page.value
    )
    configureClass()
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    alert('Gagal ganti page' + error)
    console.log(error)
  }
})
watch(row_per_page, async (e) => {
  try {
    isLoading.value = true
    if (page_number.value > total_pages.value || page_number.value == '') {
      page_number.value = 1
    }
    const data = await jurnalTransaksi.readItem(
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
    configureClass()
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    alert('Gagal ganti row/page' + error)
  }
})
watch(search_data, async (e) => {
  try {
    isLoading.value = true
    const data = await jurnalTransaksi.readItem(
      search_type.value,
      e,
      sort_by.value,
      sort_mode.value,
      page_number.value,
      row_per_page.value
    )
    total_pages.value = data
    configureClass()
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    alert('Gagal search page' + error)
  }
})
watch(search_type, async (e) => {
  try {
    isLoading.value = true
    const data = await jurnalTransaksi.readItem(
      e,
      search_data.value,
      sort_by.value,
      sort_mode.value,
      page_number.value,
      row_per_page.value
    )
    total_pages.value = data
    configureClass()
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    alert('Gagal search page' + error)
  }
})

const selectAll = (e) => {
  userIds.value = []

  if (!allSelected.value || e) {
    for (let anggota = 0; anggota < jurnalTransaksi.items.length; anggota++) {
      userIds.value.push(jurnalTransaksi.items[anggota].idtrans)
    }
  }
}
const selectOne = () => {
  allSelected.value = false
}
const configureClass = () => {
  if (jurnalTransaksi.items[0]) {
    let prevValue = jurnalTransaksi.items[0].BUKTI
    let currentClass = 'bg-white'
    for (let i = 0; i < jurnalTransaksi.items.length; i++) {
      let value = jurnalTransaksi.items[i].BUKTI
      if (prevValue !== value) {
        currentClass == 'bg-white' ? (currentClass = 'bg-slate-200') : (currentClass = 'bg-white')
      }
      document.querySelector('#table_jurnal_transaksi tbody').children[i].className = ''
      document
        .querySelector('#table_jurnal_transaksi tbody')
        .children[i].classList.add(
          currentClass,
          'hover:bg-lime-300',
          'hover:text-slate-700',
          'drop-shadow-2xl',
          'group'
        )
      prevValue = value
    }
  }
}
onBeforeMount(async () => {
  try {
    isLoading.value = true
    const data = await jurnalTransaksi.readItem(
      search_type.value,
      search_data.value,
      sort_by.value,
      sort_mode.value,
      page_number.value,
      row_per_page.value
    )
    total_pages.value = data
    configureClass()
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    alert('ERROR MOUNTED:' + error)
  }
})
</script>
<template>
  <Breadcrumbs title="Transaksi" subTitle="Akuntansi" :icon="TRANSAKSI" />
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
        <button
          class="inline-block align-middle hover:text-success text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          title="Export CSV"
          onclick="exportData('csv')"
        >
          <ShareIcon class="w-3 h-3 mx-auto stroke-2 stroke-current" />
          <span
            class="w-4 h-2 px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-[8px] text-success font-bold"
            >CSV</span
          >
        </button>
        <button
          class="inline-block hover:text-danger align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          title="Export PDF"
          onclick="exportData('pdf')"
        >
          <ShareIcon class="w-3 h-3 mx-auto stroke-2 stroke-current" />
          <span
            class="w-4 h-2 px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-[8px] text-danger font-bold"
            >PDF</span
          >
        </button>
        <button
          class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          title="Print Table"
          onclick="printData()"
        >
          <PrinterIcon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
        </button>
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
              <option value="idtrans">ID</option>
              <option value="TANGGAL">Tanggal</option>
              <option value="BUKTI">Bukti</option>
              <option value="NOPER">Noper</option>
              <option value="KETERANGAN">Keterangan</option>
              <option value="JUMLAH">Jumlah</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col h-[75vh] min-[1537px]:h-[80vh] shadow-md rounded-lg">
    <div class="flex-grow overflow-auto">
      <table class="relative w-full text-xs text-left text-gray-500" id="table_jurnal_transaksi">
        <thead class="text-xs font-bold text-gray-800 uppercase bg-blue-200 sticky top-0 z-10">
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
              @click="sorting('idtrans')"
            >
              ID
              <SortAscIcon
                v-if="sort_by === 'idtrans' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'idtrans' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('TANGGAL')"
            >
              Tanggal
              <SortAscIcon
                v-if="sort_by === 'TANGGAL' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'TANGGAL' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('BUKTI')"
            >
              Bukti
              <SortAscIcon
                v-if="sort_by === 'BUKTI' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'BUKTI' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('NOPER')"
            >
              Noper
              <SortAscIcon
                v-if="sort_by === 'NOPER' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'NOPER' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('KETERANGAN')"
            >
              Keterangan
              <SortAscIcon
                v-if="sort_by === 'KETERANGAN' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'KETERANGAN' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('JUMLAH')"
            >
              Jumlah
              <SortAscIcon
                v-if="sort_by === 'JUMLAH' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'JUMLAH' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th scope="col" class="text-center uppercase border">Actions</th>
          </tr>
        </thead>
        <tbody class="overflow-y-scroll" v-show="!isLoading">
          <tr v-for="(jurnal, index) in jurnalTransaksi.items" :key="index" :jurnal="jurnal">
            <td class="w-4 border-r border-b font-medium border-[#cbd5e9] p-0 pl-3">
              <div class="flex items-center">
                <span
                  class="hidden cursor-pointer -ml-[9px] mr-[1px] rotate-90 group-hover:block text-black"
                  >:::</span
                >
                <input
                  :value="jurnal.idtrans"
                  type="checkbox"
                  v-model="userIds"
                  @click="selectOne"
                  class="data-checkbox w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2"
                />
              </div>
            </td>
            <th
              @click="viewData(jurnal.NOPER)"
              scope="row"
              class="border-r border-b font-medium border-[#cbd5e9] whitespace-nowrap pl-2 w-20"
            >
              {{ jurnal.idtrans }}
            </th>
            <td
              @click="viewData(jurnal.NOPER)"
              class="min-w-max text-center border-r border-b font-medium border-[#cbd5e9] px-2 w-28"
            >
              {{ moment(jurnal.TANGGAL).format('DD-MM-YYYY') }}
            </td>
            <td
              @click="viewData(jurnal.NOPER)"
              class="min-w-max text-left border-r border-b font-medium border-[#cbd5e9] px-2 w-20"
            >
              {{ jurnal.BUKTI }}
            </td>
            <td
              @click="viewData(jurnal.NOPER)"
              class="min-w-max text-left border-r border-b font-medium border-[#cbd5e9] px-2 w-20"
            >
              {{ jurnal.NOPER }}
            </td>
            <td
              @click="viewData(jurnal.NOPER)"
              class="min-w-max text-left border-r border-b font-medium border-[#cbd5e9] px-2 w-max"
            >
              {{ jurnal.KETERANGAN }}
            </td>
            <td
              @click="viewData(jurnal.NOPER)"
              class="min-w-max text-right border-r border-b font-medium border-[#cbd5e9] px-2 w-max"
            >
              {{ currencyFormatter.format(jurnal.JUMLAH) }}
            </td>
            <td class="min-w-max border-r border-b font-medium border-[#cbd5e9] p-1 w-44">
              <div class="flex justify-center">
                <a
                  @click="editGet(jurnal.idtrans)"
                  class="flex items-center mr-4 hover:text-blue-700 text-sky-600"
                  href="javascript:;"
                >
                  <CheckSquareIcon class="w-3 h-3 mr-1" /> Edit
                </a>
                <a
                  @click="deleteGet(jurnal)"
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
  <div
    class="fixed right-0 bottom-0 z-[9999] bg-blue-600 px-10 flex h-10 w-full items-center justify-center"
  >
    <div class="w-1/12">
      <label
        class="block text-[15px] font-semibold text-left text-white uppercase"
        for="KETERANGAN"
      >
        Keterangan
      </label>
    </div>
    <div class="w-11/12">
      <input
        v-model="KETERANGAN"
        name="KETERANGAN"
        type="text"
        placeholder=""
        disabled
        class="w-full pl-3 text-left bg-white text-black rounded-md"
      />
    </div>
  </div>
  <Modal backdrop="static" size="modal-xl" :show="modal_utama" @hidden="modal_utama = false">
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">
        <span v-if="isAdd">Tambah </span><span v-if="isEdit">Edit </span
        ><span v-if="isView">Data </span> Anggota
        <span v-if="isEdit || isView">{{ id_anggota }}</span>
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
    <ModalBody> sdefsdf </ModalBody>
    <ModalFooter class="text-right">
      <button type="button" class="btn btn-outline-secondary w-32 mr-1" @click="resetForm">
        Cancel
      </button>
      <button type="submit" form="daftarAnggotaForm" class="btn btn-primary w-32">Simpan</button>
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
        <button type="button" @click="resetForm" class="btn btn-outline-secondary w-24 mr-1">
          Batal
        </button>
        <button
          type="button"
          class="btn btn-danger w-24"
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
<style scoped></style>
