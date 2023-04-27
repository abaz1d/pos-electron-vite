<script setup>
import Breadcrumbs from '@renderer/components/Breadcrumbs/Breadcrumbs.vue'
import TRANSAKSI from '@renderer/assets/menu/transaksi.svg'
import { onBeforeMount, ref, watch } from 'vue'
import { usePerkiraanAkuntansiStore } from '@renderer/stores/perkiraanAkuntansi.js'

const perkiraanAkuntansi = usePerkiraanAkuntansiStore()
const sort_by = ref('idtrans')
const sort_mode = ref(true)
const search_data = ref('')
const search_type = ref('idtrans')
const page_number = ref(1)
const total_pages = ref(0)
const row_per_page = ref(50)
const allSelected = ref(false)
const userIds = ref([])
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
          <tr v-for="(jurnal, index) in perkiraanAkuntansi.items" :key="index" :jurnal="jurnal">
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
                  @click="editGet(jurnal.BUKTI)"
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
</template>
