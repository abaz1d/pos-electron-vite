<script setup>
import Breadcrumbs from '@renderer/components/Breadcrumbs/Breadcrumbs.vue'
import TRANSAKSI from '@renderer/assets/images/menu/transaksi.svg'
import { onBeforeMount, ref, watch, inject } from 'vue'
import { usePerkiraanAkuntansiStore } from '@renderer/stores/perkiraanAkuntansi.js'

const swal = inject('$swal')
const perkiraanAkuntansi = usePerkiraanAkuntansiStore()
const isLoading = ref(false)
const sort_by = ref('noper')
const sort_mode = ref(true)
const search_data = ref('')
const search_type = ref('noper')
const page_number = ref(1)
const total_pages = ref(0)
const row_per_page = ref(50)
const allSelected = ref(false)
const userIds = ref([])

const isAdd = ref(false)
const isEdit = ref(false)
const isView = ref(false)
const modal_utama = ref(false)
const modal_delete = ref(false)

const noper = ref('')
const nama = ref('')
const level = ref('')
const bukubantu = ref('')
const kelompok = ref('')
const kelompok_data = ref('')
const detail = ref('')

const addGet = () => {
  isAdd.value = true
  modal_utama.value = true
}
const editGet = async (e) => {
  if (e !== '') {
    noper.value = e
    const perkiraan = await perkiraanAkuntansi.readPerkiraan(e)
    nama.value = perkiraan.nama
    level.value = perkiraan.level
    bukubantu.value = perkiraan.bukubantu
    kelompok.value = perkiraan.kel
    kelompok_data.value = perkiraan.keldata
    detail.value = perkiraan.detail
    isEdit.value = true
    modal_utama.value = true
  }
}
const deleteGet = (e) => {
  const perkiraan = e
  if (perkiraan.noper) {
    userIds.value = []
    userIds.value.push(perkiraan.noper)
    modal_delete.value = true
  } else {
    if (userIds.value.length > 0) {
      modal_delete.value = true
    }
  }
}
const simpan_data = async (e) => {
  try {
    const data = await perkiraanAkuntansi.postItem(
      noper.value,
      nama.value,
      level.value,
      bukubantu.value,
      kelompok.value,
      kelompok_data.value,
      detail.value,
      isEdit.value
    )

    if (data) {
      resetForm()
    }
  } catch (error) {
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'ERROR ADD ITEM ' + error
    })
  }
}
const deletePerkiraan = async () => {
  if (userIds.value.length > 1) {
    for (let noper = 0; noper < userIds.value.length; noper++) {
      await perkiraanAkuntansi.removeItem(userIds.value[noper])
    }
  } else {
    await perkiraanAkuntansi.removeItem(userIds.value[0])
  }
  resetForm()
}
const viewData = async (e) => {
  isView.value = true
}
const resetForm = () => {
  if (modal_utama.value == false && isEdit.value == false && isView.value == false) {
    search_data.value = ''
    search_type.value = 'nama'
    sort_by.value = 'noper'
    sort_mode.value = true
    page_number.value = 1
    total_pages.value = 0
    row_per_page.value = 50
  }
  allSelected.value = false
  userIds.value = []

  modal_utama.value = false
  modal_delete.value = false
  isAdd.value = false
  isEdit.value = false
  isView.value = false

  noper.value = ''
  nama.value = ''
  level.value = ''
  bukubantu.value = ''
  kelompok.value = ''
  kelompok_data.value = ''
  detail.value = ''
}
const sorting = async (e) => {
  isLoading.value = true
  sort_by.value = e
  sort_mode.value = !sort_mode.value

  try {
    await perkiraanAkuntansi.readItem(
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
    await perkiraanAkuntansi.readItem(
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
    console.error(error)
  }
})
watch(row_per_page, async (e) => {
  try {
    isLoading.value = true
    if (page_number.value > total_pages.value || page_number.value == '') {
      page_number.value = 1
    }
    const data = await perkiraanAkuntansi.readItem(
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
    const data = await perkiraanAkuntansi.readItem(
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
      text: 'Gagal search page ' + error
    })
  }
})
watch(search_type, async (e) => {
  try {
    isLoading.value = true
    const data = await perkiraanAkuntansi.readItem(
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
      text: 'Gagal search page ' + error
    })
  }
})

const selectAll = (e) => {
  userIds.value = []

  if (!allSelected.value || e) {
    for (let perkiraan = 0; perkiraan < perkiraanAkuntansi.items.length; perkiraan++) {
      userIds.value.push(perkiraanAkuntansi.items[perkiraan].noper)
    }
  }
}
const selectOne = () => {
  allSelected.value = false
}

onBeforeMount(async () => {
  try {
    isLoading.value = true
    const data = await perkiraanAkuntansi.readItem(
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
              <option value="noper">Noper</option>
              <option value="nama">Nama</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex flex-col h-[80vh] min-[1537px]:h-[80vh] shadow-md rounded-lg">
    <div class="flex-grow overflow-auto">
      <table class="relative w-full text-xs text-left text-gray-500 table-interval">
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
              @click="sorting('noper')"
            >
              Noper
              <SortAscIcon
                v-if="sort_by === 'noper' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'noper' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
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
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('kel')"
            >
              Kel
              <SortAscIcon
                v-if="sort_by === 'kel' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'kel' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('bukubantu')"
            >
              BK Bantu
              <SortAscIcon
                v-if="sort_by === 'bukubantu' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'bukubantu' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('keldata')"
            >
              KEL DATA
              <SortAscIcon
                v-if="sort_by === 'keldata' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'keldata' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('level')"
            >
              Level
              <SortAscIcon
                v-if="sort_by === 'level' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'level' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('font')"
            >
              Font
              <SortAscIcon
                v-if="sort_by === 'font' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'font' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('detail')"
            >
              Detail
              <SortAscIcon
                v-if="sort_by === 'detail' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'detail' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('saldo')"
            >
              Saldo
              <SortAscIcon
                v-if="sort_by === 'saldo' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'saldo' && !sort_mode"
                class="inline ml-2 -mr-2 w-5 h-4"
              />
            </th>
            <th scope="col" class="text-center uppercase border">Actions</th>
          </tr>
        </thead>
        <tbody class="overflow-y-scroll" v-show="!isLoading">
          <tr
            class="bg-white hover:bg-lime-300 hover:text-slate-700 drop-shadow-2xl group"
            v-for="(perkiraan, index) in perkiraanAkuntansi.items"
            :key="index"
            :perkiraan="perkiraan"
          >
            <td class="w-4 border-r border-b font-medium border-[#cbd5e9] p-0 pl-3">
              <div class="flex items-center">
                <span
                  class="hidden cursor-pointer -ml-[9px] mr-[1px] rotate-90 group-hover:block text-black"
                  >:::</span
                >
                <input
                  :value="perkiraan.noper"
                  type="checkbox"
                  v-model="userIds"
                  @click="selectOne"
                  class="data-checkbox w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2"
                />
              </div>
            </td>
            <th
              @click="viewData(perkiraan.noper)"
              scope="row"
              class="border-r border-b font-medium border-[#cbd5e9] whitespace-nowrap pl-2 w-20"
            >
              {{ perkiraan.noper }}
            </th>
            <td
              @click="viewData(perkiraan.noper)"
              class="min-w-max text-left border-r border-b font-medium border-[#cbd5e9] px-2"
            >
              {{ perkiraan.nama }}
            </td>
            <td
              @click="viewData(perkiraan.noper)"
              class="min-w-max text-center border-r border-b font-medium border-[#cbd5e9] px-2 w-20"
            >
              {{ perkiraan.kel }}
            </td>
            <td
              @click="viewData(perkiraan.noper)"
              class="min-w-max text-left border-r border-b font-medium border-[#cbd5e9] px-2 w-20"
            >
              {{ perkiraan.bukubantu }}
            </td>
            <td
              @click="viewData(perkiraan.noper)"
              class="min-w-max text-center border-r border-b font-medium border-[#cbd5e9] px-2 w-20"
            >
              {{ perkiraan.keldata }}
            </td>
            <td
              @click="viewData(perkiraan.noper)"
              class="min-w-max text-center border-r border-b font-medium border-[#cbd5e9] px-2 w-20"
            >
              {{ perkiraan.level }}
            </td>
            <td
              @click="viewData(perkiraan.noper)"
              class="min-w-max text-center border-r border-b font-medium border-[#cbd5e9] px-2 w-20"
            >
              {{ perkiraan.font }}
            </td>
            <td
              @click="viewData(perkiraan.noper)"
              class="min-w-max text-center border-r border-b font-medium border-[#cbd5e9] px-2 w-20"
            >
              {{ perkiraan.detail }}
            </td>
            <td
              @click="viewData(perkiraan.noper)"
              class="min-w-max text-right border-r border-b font-medium border-[#cbd5e9] px-2 w-max"
            >
              {{ perkiraan.saldo }}
            </td>
            <td class="min-w-max border-r border-b font-medium border-[#cbd5e9] p-1 w-44">
              <div class="flex justify-center">
                <a
                  @click="editGet(perkiraan.noper)"
                  class="flex items-center mr-4 hover:text-blue-700 text-sky-600"
                  href="javascript:;"
                >
                  <CheckSquareIcon class="w-3 h-3 mr-1" /> Edit
                </a>
                <a
                  @click="deleteGet(perkiraan)"
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
        ><span v-if="isView">Data </span> Perkiraan
        <span v-if="isEdit || isView">{{ noper }}</span>
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
      <form method="post">
        <div class="bg-slate-200 p-3 rounded-b">
          <div class="text-gray-700 flex items-center mx-auto w-1/2">
            <div class="mb-1 w-2/5 text-xs">
              <label>No. Perkiraan</label>
            </div>
            <span class="mr-3">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-10 mb-1 px-3 text-xs border rounded focus:shadow-outline"
                type="text"
                v-model="noper"
                maxlength="10"
                required
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-1/2 mt-0">
            <div class="mb-1 w-2/5 text-xs">
              <label>Nama</label>
            </div>
            <span class="mr-3">:</span>
            <div class="w-3/5 flex-grow">
              <textarea
                class="w-full h-12 -mb-[3px] p-3 text-xs border rounded focus:shadow-outline"
                type="text"
                v-model="nama"
                maxlength="40"
                required
              ></textarea>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-1/2 mt-0">
            <div class="mb-1 w-2/5 text-xs">
              <label>Level Laporan</label>
            </div>
            <span class="mr-3">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-10 mb-1 px-3 text-xs border rounded focus:shadow-outline"
                type="text"
                v-model="level"
                maxlength="1"
                required
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-1/2 mt-0">
            <div class="mb-1 w-2/5 text-xs">
              <label>Buku Bantu</label>
            </div>
            <span class="mr-3">:</span>
            <div class="w-3/5 flex-grow">
              <textarea
                class="w-full h-12 -mb-[3px] p-3 text-xs border rounded focus:shadow-outline"
                type="text"
                v-model="bukubantu"
                maxlength="5"
                required
              ></textarea>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-1/2 mt-0">
            <div class="mb-1 w-2/5 text-xs">
              <label>Kelompok</label>
            </div>
            <span class="mr-3">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-10 mb-1 px-3 text-xs border rounded focus:shadow-outline"
                type="text"
                maxlength="3"
                v-model="kelompok"
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-1/2 mt-0">
            <div class="mb-1 w-2/5 text-xs">
              <label>Kelomok Data</label>
            </div>
            <span class="mr-3">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-10 mb-1 px-3 text-xs border rounded focus:shadow-outline"
                type="text"
                maxlength="3"
                v-model="kelompok_data"
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-1/2 mt-0">
            <div class="mb-1 w-2/5 text-xs">
              <label>Detail</label>
            </div>
            <span class="mr-3">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-10 mb-1 px-3 text-xs border rounded focus:shadow-outline"
                type="text"
                maxlength="1"
                v-model="detail"
              />
            </div>
          </div>
        </div>
      </form>
    </ModalBody>
    <ModalFooter class="text-right">
      <button type="button" class="btn btn-outline-secondary w-32 text-xs mr-1" @click="resetForm">
        Cancel
      </button>
      <button class="btn btn-primary text-xs w-32" @click="simpan_data">Simpan</button>
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
              deletePerkiraan()
            }
          "
        >
          Hapus
        </button>
      </div>
    </ModalBody>
  </Modal>

  <Modal backdrop="static" size="modal-xl" :show="isView" @hidden="isView = false">
    <ModalHeader>
      <h2 class="font-medium text-base mr-auto">
        <!-- <span v-if="isAdd">Tambah </span><span v-if="isEdit">Edit </span
        ><span v-if="isView">Data </span> Jurnal
        <span v-if="isEdit || isView">{{ noper }}</span> -->
        BUKU BESAR
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
      <div class="flex flex-col h-40 shadow-md rounded-t-lg -mt-4 border-x border-slate-300">
        <div class="grid grid-cols-3 p-3 bg-green-200">
          <div class="text-gray-700 flex items-center col">
            <div class="mb-1 w-2/6 text-xs">
              <label>No Perkiraan</label>
            </div>
            <div class="w-4/6 flex-grow">
              <input
                class="w-full h-10 px-3 text-xs text-center placeholder-gray-400 border rounded focus:shadow-outline"
                type="text"
                placeholder="Nomor Perkiraan"
                readonly
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center col-start-3">
            <div class="mb-1 w-2/6 text-xs">
              <label>Nama</label>
            </div>
            <div class="w-4/6 flex-grow">
              <input
                class="w-full h-10 px-3 text-xs placeholder-gray-400 border rounded focus:shadow-outline"
                type="text"
                placeholder="Nama Perkiraan"
                readonly
              />
            </div>
          </div>
        </div>
        <div class="flex-grow overflow-auto">
          <table class="relative w-full text-xs text-left text-gray-500" id="table_input_jurnal">
            <thead class="text-xs font-bold text-gray-800 uppercase bg-blue-200 sticky top-0 z-10">
              <tr>
                <th
                  scope="col"
                  class="text-center uppercase border cursor-pointer hover:bg-blue-300 h-7"
                >
                  Tanggal
                </th>
                <th
                  scope="col"
                  class="text-center uppercase border cursor-pointer hover:bg-blue-300 h-7"
                >
                  Saldo Awal
                </th>
                <th
                  scope="col"
                  class="text-center uppercase border cursor-pointer hover:bg-blue-300 h-7"
                >
                  Mutasi Debet
                </th>
                <th
                  scope="col"
                  class="text-center uppercase border cursor-pointer hover:bg-blue-300 h-7"
                >
                  Mutasi Kredit
                </th>
                <th
                  scope="col"
                  class="text-center uppercase border cursor-pointer hover:bg-blue-300 h-7"
                >
                  Saldo Akhir
                </th>
                <th scope="col" class="text-center uppercase border">Actions</th>
              </tr>
            </thead>
            <tbody class="overflow-y-scroll" v-show="!isLoading">
              <!-- <TableDetail
                v-for="(jurnal, index) in jurnalTransaksi.jurnals"
                :key="index"
                :jurnal="jurnal"
                @updateData="update_data"
              /> -->
            </tbody>
          </table>
        </div>
      </div>
      <form @submit.prevent="add_data" method="post">
        <div class="bg-slate-200 p-3 rounded-b">
          <div class="text-gray-700 flex items-center mx-auto w-1/3">
            <div class="mb-1 w-2/5 text-xs">
              <label>Tanggal</label>
            </div>
            <span class="mr-3">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-10 mb-1 px-3 text-xs border rounded focus:shadow-outline"
                type="date"
                readonly
                required
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-1/3 mt-0">
            <div class="mb-1 w-2/5 text-xs">
              <label>Saldo Awal</label>
            </div>
            <span class="mr-3">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-10 mb-1 px-3 text-xs border rounded focus:shadow-outline"
                type="number"
                required
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-1/3 mt-0">
            <div class="mb-1 w-2/5 text-xs">
              <label>Mutasi Debet</label>
            </div>
            <span class="mr-3">:</span>
            <div class="w-3/5 flex-grow">
              <textarea
                class="w-full h-12 -mb-[3px] p-3 text-xs border rounded focus:shadow-outline"
                type="number"
                required
              ></textarea>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-1/3 mt-0">
            <div class="mb-1 w-2/5 text-xs">
              <label>Mutasi Kredit</label>
            </div>
            <span class="mr-3">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-10 mb-1 px-3 text-xs border rounded focus:shadow-outline"
                type="number"
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-1/3 mt-0">
            <div class="mb-1 w-2/5 text-xs">
              <label>Saldo Akhir</label>
            </div>
            <span class="mr-3">:</span>
            <div class="w-3/5 flex-grow">
              <input
                class="w-full h-10 mb-1 px-3 text-xs border rounded focus:shadow-outline"
                type="number"
              />
            </div>
          </div>
          <div class="flex w-1/3 mx-auto space-x-4">
            <a
              href="javascript:;"
              @click="miniReset"
              class="btn items-center flex mx-auto btn-danger text-xs w-3/12 mt-3"
            >
              <XIcon class="w-4 h-4 mr-1" /> Batal
            </a>
            <button
              v-if="!isView"
              type="submit"
              class="btn items-center flex mx-auto btn-primary text-xs w-9/12 mt-3"
            >
              <SaveIcon class="w-4 h-4 mr-1" /> Simpan
            </button>
          </div>
        </div>
      </form>
    </ModalBody>
  </Modal>
</template>
