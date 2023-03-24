<script setup>
import { useDaftarAnggotaStore } from '@renderer/stores/daftarAnggota.js'
import { onMounted, ref } from 'vue'
import moment from 'moment'
import KeanggotaanBC from '@renderer/components/Breadcrumbs/Transaksi/KeanggotaanBC.vue'

const daftarAnggota = useDaftarAnggotaStore()
const isLoading = ref(false)
const modal_utama = ref(false)

onMounted(async () => {
  try {
    isLoading.value = true
    await daftarAnggota.readItem()
    isLoading.value = false
  } catch (error) {
    isLoading.value = false
    alert('Error Mounted')
  }
})
</script>
<template>
  <KeanggotaanBC />
  <div class="relative top-0 bg-white w-full border-y-2 border-[#d0d3d4]">
    <div class="flex space-x-4 w-full justify-center m-auto px-5">
      <div class="grid grid-cols-77 xl:grid-cols-10 w-full h-10">
        <button
          class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          @click="modal_utama = true"
          id="delete-multiple-data"
          data-bs-toggle="tooltip"
          title="Hapus Data"
        >
          <PlusIcon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
        </button>
        <button
          class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          onclick="deleteAction()"
          id="delete-multiple-data"
          data-bs-toggle="tooltip"
          title="Hapus Data"
        >
          <TrashIcon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
        </button>
        <button
          class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          title="Export CSV"
          onclick="exportData('csv')"
        >
          <FileIcon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
        </button>
        <button
          class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          title="Export PDF"
          onclick="exportData('pdf')"
        >
          <FileIcon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
        </button>
        <button
          class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          title="Print Table"
          onclick="printData()"
        >
          <PrinterIcon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
        </button>
        <button
          class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          onclick="selectAll()"
          id="select-all"
          title="Select All"
        >
          <CheckIcon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
          <i class="fa-solid fa-check"></i>
        </button>
        <button
          class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          onclick="unSelectAll()"
          id="unselect-all"
          title="Unselect All"
        >
          <XIcon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
        </button>
        <!-- <button
          class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap rounded no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
          id="unselect-all"
          title="Unselect All"
          @click="this.$router.go(this.$router.currentRoute)"
        >
          <RefreshCwIcon class="w-4 h-4 mx-auto my-[5px] stroke-2 stroke-current" />
        </button> -->
      </div>
      <div class="flex order-2 w-full h-10">
        <div id="pagination" class="mx-auto">
          <div class="inline-flex align-middle leading-tight text-xs">
            <div class="relative inline-flex align-middle py-1 leading-tight text-xs">
              <a
                href="#"
                class="inline-block align-middle text-center rounded-l-lg select-none border font-normal whitespace-no-wrap h-9 -mt-1 py-1 px-3 leading-normal no-underline bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
                id="next-page"
                ><RewindIcon class="w-4 h-4 mx-auto my-[5px]"
              /></a>
              <a
                href="#"
                class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap h-9 -mt-1 py-1 px-3 leading-normal no-underline bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
                id="last-page"
              >
                <SkipBackIcon class="w-4 h-4 mx-auto my-[5px]"
              /></a>
            </div>
            <div class="flex items-stretch w-full">
              <input
                type="text"
                class="block appearance-none w-full mb-1 px-2 bg-white text-gray-800 border border-gray-200 text-xs leading-normal"
                id="page_number"
                value="1"
              />
              <input
                type="text"
                class="block appearance-none w-full px-2 mb-1 bg-gray-200 text-gray-800 border border-gray-200 text-xs leading-normal"
                id="total_pages"
                required
              />
            </div>
            <div class="relative inline-flex align-middle py-1 leading-tight text-xs">
              <a
                href="#"
                class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap h-9 -mt-1 py-1 px-3 leading-normal no-underline bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
                id="next-page"
                ><FastForwardIcon class="w-4 h-4 mx-auto my-[5px]"
              /></a>
              <a
                href="#"
                class="inline-block align-middle text-center select-none border font-normal whitespace-no-wrap h-9 -mt-1 rounded-r-lg py-1 px-3 leading-normal no-underline bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
                id="last-page"
              >
                <SkipForwardIcon class="w-4 h-4 mx-auto my-[5px]"
              /></a>
            </div>
          </div>
        </div>
      </div>
      <div class="items-center justify-center w-full flex h-10">
        <select
          name=""
          id="row_per_page"
          class="bg-gray-50 border border-gray-300 text-gray-900 pl-1 mr-2 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block -mt-1 w-[70px] h-9"
        >
          <option value="2">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="75">75</option>
          <option value="100">100</option>
        </select>

        <div class="relative flex items-stretch w-full" id="search-input-group">
          <input
            type="text"
            class="block appearance-none rounded-l-lg w-full mb-1 bg-white text-gray-800 border border-gray-200 px-2 text-xs leading-normal h-9"
            id="search-data"
            :placeholder="'Cari ' + $route.name.replace(/-/gi, ' ')"
            name="search-data"
          />
          <div class="input-group-append">
            <button
              class="inline-block align-middle text-center select-none border w-14 font-normal whitespace-no-wrap rounded-r-lg no-underline h-9 mx-auto px-2 leading-tight text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 btn-light-bordered"
              id="search-btn"
            >
              <SearchIcon class="w-4 h-4 mx-auto my-[5px]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="flex flex-col max-h-[81vh] shadow-md rounded-lg">
    <div class="flex-grow overflow-auto">
      <table class="relative w-full text-xs text-left text-gray-500">
        <thead class="text-xs font-bold text-gray-800 uppercase bg-blue-200 sticky top-0">
          <tr>
            <th scope="col" class="p-2 border pl-4">
              <div class="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-blue-200 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label for="checkbox-all-search" class="sr-only">checkbox</label>
              </div>
            </th>
            <th scope="col" class="text-center uppercase border">No. Anggota</th>
            <th scope="col" class="text-center uppercase border">Tanggal</th>
            <th scope="col" class="text-center uppercase border">Resort</th>
            <th scope="col" class="text-center uppercase border">Nomor KTP</th>
            <th scope="col" class="text-center uppercase border">Kartu Keluarga</th>
            <th scope="col" class="text-center uppercase border">Nama</th>
            <th scope="col" class="text-center uppercase border">Alamat</th>
            <th scope="col" class="text-center uppercase border">Desa</th>
            <th scope="col" class="text-center uppercase border">Kecamatan</th>
            <th scope="col" class="text-center uppercase border">Kota</th>
            <th scope="col" class="text-center uppercase border">Nama Pendamping</th>
            <th scope="col" class="text-center uppercase border">Kantor</th>
            <th scope="col" class="text-center uppercase border">Actions</th>
          </tr>
        </thead>
        <tbody class="overflow-y-scroll" v-show="!isLoading">
          <tr
            class="bg-white hover:bg-gray-200"
            v-for="anggota in daftarAnggota.items"
            :key="anggota.iddata"
            :anggota="anggota"
            :value="anggota.iddata"
          >
            <td class="w-4 border-r border-b font-medium p-2 pl-4">
              <div class="flex items-center">
                <input
                  :id="anggota.iddata"
                  type="checkbox"
                  class="data-checkbox w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
              </div>
            </td>
            <th scope="row" class="p-2 border-r border-b font-medium whitespace-nowrap">
              {{ anggota.cif }}
            </th>
            <td class="min-w-max text-left border-r border-b font-medium px-2">
              {{ moment(anggota.tanggal).format('DD-MM-YYYY') }}
            </td>
            <td class="min-w-max text-left border-r border-b font-medium px-2">
              {{ anggota.resort }}
            </td>
            <td class="min-w-max text-left border-r border-b font-medium px-2">
              {{ anggota.noktp }}
            </td>
            <td class="min-w-max text-left border-r border-b font-medium px-2">
              {{ anggota.nokk }}
            </td>
            <td class="min-w-max text-left border-r border-b font-medium px-2">
              {{ anggota.nama }}
            </td>
            <td class="min-w-max text-left border-r border-b font-medium px-2">
              {{ anggota.alamat }}
            </td>
            <td class="min-w-max text-left border-r border-b font-medium px-2">
              {{ anggota.desa }}
            </td>
            <td class="min-w-max text-left border-r border-b font-medium px-2">
              {{ anggota.kecamatan }}
            </td>
            <td class="min-w-max text-left border-r border-b font-medium px-2">
              {{ anggota.kota }}
            </td>
            <td class="min-w-max text-left border-r border-b font-medium px-2">
              {{ anggota.namapendamping }}
            </td>
            <td class="min-w-max text-left border-r border-b font-medium px-2">
              {{ anggota.kantor }}
            </td>
            <td class="flex justify-center border-r border-b font-medium p-2">
              <a id="edit" class="flex items-center mr-4 text-blue-700" href="javascript:;">
                <CheckSquareIcon class="w-4 h-4 mr-1" /> Edit
              </a>
              <a id="delete" class="flex items-center text-danger" href="javascript:;">
                <Trash2Icon class="w-4 h-4 mr-1" /> Hapus
              </a>
            </td>
          </tr>
        </tbody>
        <tbody v-show="isLoading">
          <div
            class="fixed intleft-2 right-0 top-0 bottom-0 w-full h-[100vh] z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center"
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
      <h2 class="font-medium text-base mr-auto">Anggota</h2>
    </ModalHeader>
    <ModalBody class="-mx-4">
      <form id="daftarAnggotaForm" class="grid grid-cols-12 gap-4 pl-2">
        <div class="border-r-2 mx-auto col-span-3 overflow-hidden mt-3">
          <div
            class="border-4 relative rounded-md border-dashed p-2 m-2 text-sm mx-auto text-center mb-5 w-2/3 h-[35%]"
          >
            Ini Tempat Upload foto Lorem ipsum dolor sit amet consectetur adipisicing elit. Facilis
            molestiae possimus numquam repudiandae amet aliquid accusantium tempora unde reiciendis
            fugit.
            <label
              for="foto"
              class="font-medium text-base rounded-lg bg-white px-2 absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >Foto Anggota</label
            >
          </div>
          <div class="border-4 relative rounded-md border-dashed p-2 m-2 text-sm text-center mb-5">
            Ini Tempat Upload foto Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ut,
            est. Omnis atque obcaecati ea inventore?
            <label
              for="foto"
              class="font-medium text-base rounded-lg bg-white px-2 absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >Tanda Tangan Anggota</label
            >
          </div>
          <div class="border-4 relative rounded-md border-dashed p-2 m-2 text-sm text-center mb-5">
            Ini Tempat Upload foto Lorem ipsum dolor, sit amet consectetur adipisicing elit.
            Consequatur, distinctio.
            <label
              for="foto"
              class="font-medium text-base rounded-lg bg-white px-2 absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
              >Paraf Anggota</label
            >
          </div>
        </div>
        <div class="col-span-9 flex max-h-[64vh]">
          <div class="flex-grow overflow-auto pr-2">
            <div class="grid grid-cols-2 gap-4">
              <div class="relative z-0 w-full mb-5 mt-2 group">
                <input
                  type="text"
                  name="tanggal"
                  id="tanggal"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  disabled
                />
                <label
                  for="tanggal"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Tanggal</label
                >
              </div>
              <div class="relative z-0 w-full mb-5 mt-2 group">
                <input
                  type="text"
                  name="no_anggota"
                  id="no_anggota"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="no_anggota"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >No. Anggota</label
                >
              </div>
            </div>
            <hr class="mb-3 border-1 border-gray-300 bg-gray-300" />
            <div class="grid grid-cols-2 gap-6">
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="no_ktp"
                  id="no_ktp"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="no_ktp"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >No. KTP/ NIK</label
                >
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="no_kk"
                  id="no_kk"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="no_kk"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >No. Kartu Keluarga</label
                >
              </div>
            </div>
            <div class="relative z-0 w-full mb-6 group">
              <input
                type="text"
                name="nama_lengkap"
                id="nama_lengkap"
                class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              />
              <label
                for="nama_lengkap"
                class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Nama Lengkap</label
              >
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="tempat_lahir"
                  id="tempat_lahir"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="tempat_lahir"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Tempat Lahir</label
                >
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="floating_last_name"
                  id="floating_last_name"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="floating_last_name"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Tanggal Lahir</label
                >
              </div>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div class="relative z-0 w-full mb-6 group">
                <select
                  type="text"
                  name="jenis_kelamin"
                  id="jenis_kelamin"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                >
                  <option class="text-xs" selected disabled>Pilihlah Salah Satu</option>
                  <option class="text-xs" value="Laki-Laki">Laki - Laki</option>
                  <option class="text-xs" value="Perempuan">Perempuan</option>
                </select>
                <label
                  for="jenis_kelamin"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 peer-focus:top-2.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Jenis Kelamin</label
                >
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <select
                  type="text"
                  name="floating_last_name"
                  id="floating_last_name"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                >
                  <option class="text-xs" selected disabled>Pilihlah Salah Satu</option>
                  <option class="text-xs" value="Islam">Islam</option>
                  <option class="text-xs" value="Kristen">Kristen</option>
                  <option class="text-xs" value="Katolik">Katolik</option>
                  <option class="text-xs" value="Hindu">Hindu</option>
                  <option class="text-xs" value="Buddha">Buddha</option>
                  <option class="text-xs" value="Konghucu">Konghucu</option>
                </select>
                <label
                  for="floating_last_name"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Agama</label
                >
              </div>
            </div>
            <div class="relative z-0 w-full mb-6 group">
              <textarea
                type="text"
                name="alamat"
                id="alamat"
                class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                placeholder=" "
                required
              ></textarea>
              <label
                for="alamat"
                class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Alamat</label
              >
            </div>

            <div class="grid grid-cols-4 gap-6">
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="rt"
                  id="rt"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="rt"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >RT</label
                >
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="rw"
                  id="rw"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="rw"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >RW</label
                >
              </div>
              <div class="relative z-0 w-full col-span-2 mb-6 group">
                <input
                  type="text"
                  name="kelurahan"
                  id="kelurahan"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="kelurahan"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Kelurahan/ Desa</label
                >
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="kecamatan"
                  id="kecamatan"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="kecamatan"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Kecamatan</label
                >
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="kota"
                  id="kota"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="kota"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Kabupaten/ Kota</label
                >
              </div>
            </div>

            <div class="grid grid-cols-3 gap-6">
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="pendamping"
                  id="pendamping"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="pendamping"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Pendamping</label
                >
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="text"
                  name="pekerjaan"
                  id="pekerjaan"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="pekerjaan"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Pekerjaan</label
                >
              </div>
              <div class="relative z-0 w-full mb-6 group">
                <input
                  type="tel"
                  pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  name="telepon"
                  id="telepon"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="telepon"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >No. Telepon</label
                >
              </div>
            </div>

            <div class="grid grid-cols-2 gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <select
                  type="text"
                  name="resort"
                  id="resort"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                >
                  <option class="text-xs" selected disabled>Pilihlah Salah Satu</option>
                  <option class="text-xs" value="050 - SMB">050 - SMB</option>
                  <option class="text-xs" value="101 - KRESNA">101 - KRESNA</option>
                  <option class="text-xs" value="102 - RAMA">102 - RAMA</option>
                  <option class="text-xs" value="103 - SADEWA">103 - SADEWA</option>
                  <option class="text-xs" value="104 - NAKULA">104 - NAKULA</option>
                  <option class="text-xs" value="105 - SRIKANDI">105 - SRIKANDI</option>
                  <option class="text-xs" value="106 - ARIMBI">106 - ARIMBI</option>
                  <option class="text-xs" value="107 - ANJANI">107 - ANJANI</option>
                  <option class="text-xs" value="108 - ABIMANYU">108 - ABIMANYU</option>
                  <option class="text-xs" value="109 - BANOWATI">109 - BANOWATI</option>
                  <option class="text-xs" value="110 - DRUPADI">109 - DRUPADI</option>
                  <option class="text-xs" value="111 - GONDOMONO">110 - GONDOMONO</option>
                  <option class="text-xs" value="112 - KUNTHI">112 - KUNTHI</option>
                  <option class="text-xs" value="113 - LARASATI">113 - LARASATI</option>
                  <option class="text-xs" value="114 - BALADEWA">114 - BALADEWA</option>
                  <option class="text-xs" value="115 - ANTAREJA">115 - ANTAREJA</option>
                  <option class="text-xs" value="116 - LESMANA">116 - LESMANA</option>
                  <option class="text-xs" value="117 - SUBALI">117 - SUBALI</option>
                  <option class="text-xs" value="118 - SUGRIWA">118 - SUGRIWA</option>
                  <option class="text-xs" value="119 - PERMADI">119 - PERMADI</option>
                  <option class="text-xs" value="120 - PERGIWO">120 - PERGIWO</option>
                  <option class="text-xs" value="121 - UTARI">121 - UTARI</option>
                  <option class="text-xs" value="122 - JATAYU">122 - JATAYU</option>
                </select>
                <label
                  for="resort"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Resort</label
                >
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <input
                  type="date"
                  name="tanggal_bht"
                  id="tanggal_bht"
                  class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <label
                  for="tanggal_bht"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 peer-focus:top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Tanggal BHT</label
                >
              </div>
            </div>
            <hr class="mb-3 border-1 border-gray-300 bg-gray-300" />
            <div class="grid grid-cols-2 gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="simpanan_pokok"
                  id="simpanan_pokok"
                  class="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <div
                  class="absolute rounded-l-md top-0 left-0 bottom-0 text-black p-2 bg-gray-300 peer-focus:bg-blue-600"
                >
                  Rp
                </div>
                <label
                  for="simpanan_pokok"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Simpanan Pokok</label
                >
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="simpanan_swk"
                  id="simpanan_swk"
                  class="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <div
                  class="absolute rounded-l-md top-0 left-0 bottom-0 text-black p-2 bg-gray-300 peer-focus:bg-blue-600"
                >
                  Rp
                </div>
                <label
                  for="simpanan_swk"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Simpanan SWK</label
                >
              </div>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div class="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="simpanan_wajib"
                  id="simpanan_wajib"
                  class="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <div
                  class="absolute rounded-l-md top-0 left-0 bottom-0 text-black p-2 bg-gray-300 peer-focus:bg-blue-600"
                >
                  Rp
                </div>
                <label
                  for="simpanan_wajib"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Simpanan Wajib</label
                >
              </div>
              <div class="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="simpanan_lain"
                  id="simpanan_lain"
                  class="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <div
                  class="absolute rounded-l-md top-0 left-0 bottom-0 text-black p-2 bg-gray-300 peer-focus:bg-blue-600"
                >
                  Rp
                </div>
                <label
                  for="simpanan_lain"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Simpanan Lain - Lain</label
                >
              </div>
            </div>
            <div class="grid grid-cols-2 gap-6">
              <div class="relative z-0 w-full mb-5 col-start-2 group">
                <input
                  type="text"
                  name="total_simpanan"
                  id="total_simpanan"
                  class="block py-2.5 px-10 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  required
                />
                <div
                  class="absolute rounded-l-md top-0 left-0 bottom-0 text-black p-2 bg-gray-300 peer-focus:bg-blue-600"
                >
                  Rp
                </div>
                <label
                  for="total_simpanan"
                  class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 peer-focus:top-3.5 z-10 origin-[0] left-10 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                  >Total Simpanan</label
                >
              </div>
            </div>
          </div>
        </div>
      </form>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        class="btn btn-outline-secondary w-32 mr-1"
        @click="modal_utama = false"
      >
        Cancel
      </button>
      <button type="submit" form="daftarAnggotaForm" class="btn btn-primary w-32">Simpan</button>
    </ModalFooter>
  </Modal>
</template>

<style scoped>
.btn-light-bordered {
  border: 1px solid #d0d3d4;
}

.btn-light-bordered:hover {
  border: 1px solid #d0d3d4;
  background-color: #e5e7e9;
}
table {
  border-collapse: collapse;
}

tr:nth-child(even) {
  @apply bg-slate-100 hover:bg-gray-200;
}
tr:nth-child(od) {
  @apply bg-white hover:bg-gray-200;
}
</style>
