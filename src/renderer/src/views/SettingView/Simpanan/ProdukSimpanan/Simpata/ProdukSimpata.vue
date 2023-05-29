<script setup>
import { useProdukSimpataStore } from '@renderer/stores/produkSimpata.js'
import { onMounted, ref, watch, inject } from 'vue'
import moment from 'moment'
import Breadcrumbs from '@renderer/components/Breadcrumbs/Breadcrumbs.vue'
import SETTING from '@renderer/assets/images/menu/setting.svg'

const swal = inject('$swal')
const produkSimpata = useProdukSimpataStore()
const Perkiraan_list = ref('')
const isLoading = ref(false)
const isAdd = ref(false)
const isEdit = ref(false)
const isView = ref(false)
const modal_utama = ref(false)
const modal_detail = ref(false)
const detail_jurnal = ref(false)
const detail_lain = ref(false)
const detail_aktif = ref(false)
const detail_pasif = ref(false)
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
const opthari = ref('')
const versi_perhitungan = ref('')
const a_bunga = ref('')
const a_optadm = ref('')
const a_adm = ref('')
const a_adm1 = ref('')
const a_nomi_adm1 = ref('')
const p_bunga = ref('')
const p_optadm = ref('')
const p_adm = ref('')
const p_adm1 = ref('')
const p_nomi_adm1 = ref('')
const saldo_minimal = ref('')
const batas_bunga = ref('')
const optpasif1 = ref(true)
const haripasif = ref('')
const optpasif2 = ref(false)
const nomipasif = ref('')
const batas_pajak = ref('')
const pajak = ref('')
const antar_bank = ref('')
const jurnaltab = ref('')
const jurnalutangbg = ref('')
const jurnalbunga = ref('')
const jurnaladm = ref('')
const jurnaladmtutup = ref('')
const jurnalpajak = ref('')
const jurnalksd = ref('')
const dapat_shu = ref('')
const metode_shu = ref('')

const addGet = () => {
  isAdd.value = true
  modal_utama.value = true
}
const editGet = async (e) => {
  modal_utama.value = true
  isEdit.value = true
  const anggota = await produkSimpata.getItem(e)
  id_produk.value = anggota.id
  kode_produk.value = anggota.SANDI
  nama_produk.value = anggota.KETERANGAN
  opthari.value = anggota.OPTHARI
  versi_perhitungan.value = anggota.VER
  a_bunga.value = anggota.A_RATE
  a_optadm.value = anggota.A_OPTADM
  a_adm.value = anggota.A_ADM
  a_adm1.value = anggota.A_ADM1
  a_nomi_adm1.value = anggota.A_NOMI_ADM1
  p_bunga.value = anggota.P_RATE
  p_optadm.value = anggota.P_OPTADM
  p_adm.value = anggota.P_ADM
  p_adm1.value = anggota.P_ADM1
  p_nomi_adm1.value = anggota.P_NOMI_ADM1
  saldo_minimal.value = anggota.SALDOMINIMAL
  batas_bunga.value = anggota.BATASBUNGA
  optpasif1.value = anggota.OPTPASIF == '1' || anggota.OPTPASIF == '3' ? true : false
  haripasif.value = anggota.HARIPASIF
  optpasif2.value = anggota.OPTPASIF == '2' || anggota.OPTPASIF == '3' ? true : false
  nomipasif.value = anggota.NOMIPASIF
  batas_pajak.value = anggota.BATASPAJAK
  pajak.value = anggota.PAJAK
  antar_bank.value = anggota.ANTARBANK
  jurnaltab.value = anggota.JURNALTAB
  jurnalutangbg.value = anggota.JURNALUTANGBG
  jurnalbunga.value = anggota.JURNALBUNGA
  jurnaladm.value = anggota.JURNALADM
  jurnaladmtutup.value = anggota.JURNALADMTUTUP
  jurnalpajak.value = anggota.JURNALPAJAK
  jurnalksd.value = anggota.JURNALKSD
  dapat_shu.value = '1'
  metode_shu.value = '1'
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
  isView.value = true
  modal_utama.value = true
  const anggota = await produkSimpata.getItem(e)
  id_produk.value = anggota.id
  kode_produk.value = anggota.SANDI
  nama_produk.value = anggota.KETERANGAN
  opthari.value = anggota.OPTHARI
  versi_perhitungan.value = anggota.VER
  a_bunga.value = anggota.A_RATE
  a_optadm.value = anggota.A_OPTADM
  a_adm.value = anggota.A_ADM
  a_adm1.value = anggota.A_ADM1
  a_nomi_adm1.value = anggota.A_NOMI_ADM1
  p_bunga.value = anggota.P_RATE
  p_optadm.value = anggota.P_OPTADM
  p_adm.value = anggota.P_ADM
  p_adm1.value = anggota.P_ADM1
  p_nomi_adm1.value = anggota.P_NOMI_ADM1
  saldo_minimal.value = anggota.SALDOMINIMAL
  batas_bunga.value = anggota.BATASBUNGA
  optpasif1.value = anggota.OPTPASIF == '1' || anggota.OPTPASIF == '3' ? true : false
  haripasif.value = anggota.HARIPASIF
  optpasif2.value = anggota.OPTPASIF == '2' || anggota.OPTPASIF == '3' ? true : false
  nomipasif.value = anggota.NOMIPASIF
  batas_pajak.value = anggota.BATASPAJAK
  pajak.value = anggota.PAJAK
  antar_bank.value = anggota.ANTARBANK
  jurnaltab.value = anggota.JURNALTAB
  jurnalutangbg.value = anggota.JURNALUTANGBG
  jurnalbunga.value = anggota.JURNALBUNGA
  jurnaladm.value = anggota.JURNALADM
  jurnaladmtutup.value = anggota.JURNALADMTUTUP
  jurnalpajak.value = anggota.JURNALPAJAK
  jurnalksd.value = anggota.JURNALKSD
  dapat_shu.value = '1'
  metode_shu.value = '1'
}
const simpan_data = async (e) => {
  try {
    //if a_optadm.value == '1' ? a_adm1.value : '0'
    //if a_optadm.value == '1' ? a_nomi_adm1.value : '0'
    //if p_optadm.value == '1' ? p_adm1.value : '0'
    //if p_optadm.value == '1' ? p_nomi_adm1.value : '0'
    await produkSimpata.postItem(
      id_produk.value,
      kode_produk.value,
      nama_produk.value,
      opthari.value,
      versi_perhitungan.value,
      a_bunga.value,
      a_optadm.value,
      a_adm.value,
      a_optadm.value == '1' ? a_adm1.value : '0',
      a_optadm.value == '1' ? a_nomi_adm1.value : '0',
      // a_adm1.value
      // a_nomi_adm1.value
      p_bunga.value,
      p_optadm.value,
      p_adm.value,
      p_optadm.value == '1' ? p_adm1.value : '0',
      p_optadm.value == '1' ? p_nomi_adm1.value : '0',
      // p_adm1.value
      // p_nomi_adm1.value
      saldo_minimal.value,
      batas_bunga.value,
      optpasif1.value == true && optpasif2.value == true
        ? '3'
        : optpasif1.value == false && optpasif2.value == true
        ? '2'
        : optpasif1.value == true && optpasif2.value == false
        ? '1'
        : '0',
      //optpasif1.value,
      haripasif.value,
      //optpasif2.value,
      nomipasif.value,
      batas_pajak.value,
      pajak.value,
      antar_bank.value,
      jurnaltab.value,
      jurnalutangbg.value,
      jurnalbunga.value,
      jurnaladm.value,
      jurnaladmtutup.value,
      jurnalpajak.value,
      jurnalksd.value,
      // dapat_shu.value
      // metode_shu.value
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
      await produkSimpata.removeItem(userIds.value[idAnggota])
    }
  } else {
    console.log('delete post 1', userIds.value)
    await produkSimpata.removeItem(userIds.value[0])
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
  opthari.value = ''
  versi_perhitungan.value = ''
  a_bunga.value = ''
  a_optadm.value = ''
  a_adm.value = ''
  a_adm1.value = ''
  a_nomi_adm1.value = ''
  p_bunga.value = ''
  p_optadm.value = ''
  p_adm.value = ''
  p_adm1.value = ''
  p_nomi_adm1.value = ''
  saldo_minimal.value = ''
  batas_bunga.value = ''
  optpasif1.value = true
  haripasif.value = ''
  optpasif2.value = false
  nomipasif.value = ''
  batas_pajak.value = ''
  pajak.value = ''
  antar_bank.value = ''
  modal_utama.value = false
  modal_detail.value = false
  detail_jurnal.value = false
  detail_lain.value = false
  detail_aktif.value = false
  detail_pasif.value = false
  modal_delete.value = false
  isAdd.value = false
  isEdit.value = false
  isView.value = false
  dapat_shu.value = ''
  metode_shu.value = ''
}

const sorting = async (e) => {
  isLoading.value = true
  sort_by.value = e
  sort_mode.value = !sort_mode.value

  try {
    await produkSimpata.readItem(
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
    await produkSimpata.readItem(
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
    const data = await produkSimpata.readItem(
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
    const data = await produkSimpata.readItem(
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
    const data = await produkSimpata.readItem(
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
    for (let anggota = 0; anggota < produkSimpata.items.length; anggota++) {
      userIds.value.push(produkSimpata.items[anggota].id)
    }
  }
}
const selectOne = () => {
  allSelected.value = false
}

onMounted(async () => {
  try {
    isLoading.value = true
    const data = await produkSimpata.readItem(
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
  <Breadcrumbs title="Setting" subTitle="Simpata" :icon="SETTING" />
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
            v-for="produk in produkSimpata.items"
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
              {{ produk.SANDI }}
            </th>
            <td
              @dblclick="viewData(produk.id)"
              class="min-w-max text-center border-r border-b font-medium px-2"
            >
              {{ produk.KETERANGAN }}
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
      <form method="post" id="produkSimpataForm" @submit.prevent="simpan_data">
        <div class="bg-pink-100 p-3 rounded-t">
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Kode Produk</label>
            </div>

            <div class="w-8/12 flex-grow">
              <input
                class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                type="text"
                v-model="kode_produk"
                :readonly="isView"
                maxlength="4"
                required
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Nama Produk</label>
            </div>

            <div class="w-8/12 flex-grow">
              <input
                class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                type="text"
                v-model="nama_produk"
                :readonly="isView"
                maxlength="40"
                required
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Metode Perhitungan Bunga</label>
            </div>

            <div class="flex items-center w-8/12 px-2 h-7 rounded bg-white border mb-1">
              <div class="flex mx-auto justify-center items-center w-1/2">
                <input
                  id="365-radio"
                  type="radio"
                  value="1"
                  v-model="opthari"
                  :disabled="isView"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="365-radio" class="ml-2 text-xs font-medium"
                  >Hari efektif (365 Hari)</label
                >
              </div>
              <div class="flex mx-auto justify-center items-center w-1/2">
                <input
                  :disabled="isView"
                  id="360-radio"
                  type="radio"
                  value="2"
                  v-model="opthari"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="360-radio" class="ml-2 text-xs font-medium"
                  >Rata - Rata (360 Hari)</label
                >
              </div>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Versi Perhitungan</label>
            </div>

            <div class="grid items-center mx-auto w-8/12 p-2 h-16 rounded bg-white border mb-1">
              <div class="flex items-center w-full">
                <div class="flex mx-[46.5px] justify-start items-center w-1/2">
                  <input
                    :disabled="isView"
                    id="harian-radio"
                    type="radio"
                    value="1"
                    v-model="versi_perhitungan"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="harian-radio" class="ml-2 text-xs font-medium">Harian</label>
                </div>
                <div class="flex mx-[46.5px] justify-start items-center w-1/2">
                  <input
                    :disabled="isView"
                    id="saldo-minimal-radio"
                    type="radio"
                    value="3"
                    v-model="versi_perhitungan"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="saldo-minimal-radio" class="ml-2 text-xs font-medium"
                    >Saldo Minimal</label
                  >
                </div>
              </div>
              <div class="flex items-center w-full">
                <div class="flex mx-[46.5px] justify-start items-center w-1/2">
                  <input
                    :disabled="isView"
                    id="rata-radio"
                    type="radio"
                    value="2"
                    v-model="versi_perhitungan"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="rata-radio" class="ml-2 text-xs font-medium">Rata - Rata</label>
                </div>
                <div class="flex mx-[46.5px] justify-start items-center w-1/2">
                  <input
                    :disabled="isView"
                    id="harian-berjenjang-radio"
                    type="radio"
                    value="4"
                    v-model="versi_perhitungan"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="harian-berjenjang-radio" class="ml-2 text-xs font-medium"
                    >Harian Berjenjang</label
                  >
                </div>
              </div>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Ketentuan Tabungan Aktif</label>
            </div>

            <div class="grid items-center mx-auto w-8/12 p-2 h-32 rounded bg-white border mb-1">
              <div class="flex justify-center items-center w-full mb-1 border bg-slate-50 p-1">
                <label for="prosen-bunga" class="text-xs font-medium pb-1">Prosen Bunga</label>
                <input
                  class="w-1/3 mx-5 h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                  type="number"
                  float="0.05"
                  v-model="a_bunga"
                  name="prosen-bunga"
                  :readonly="isView"
                  required
                />
                <label for="prosen-bunga" class="text-xs font-medium pb-1">Prosen Per Tahun</label>
              </div>
              <div class="flex justify-center items-center w-full">
                <label for="admin-per-bulan" class="text-xs ml-2 w-1/4 font-medium pb-1"
                  >Admin Per Bulan</label
                >
                <div class="w-1/3 space-y-1 mx-auto border p-1">
                  <div class="flex ml-8 justify-start items-center">
                    <input
                      :disabled="isView"
                      id="flate-aktif-radio"
                      type="radio"
                      value="1"
                      v-model="a_optadm"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label for="flate-aktif-radio" class="ml-2 text-xs font-medium">Flate</label>
                  </div>
                  <div class="flex ml-8 justify-start items-center">
                    <input
                      :disabled="isView"
                      id="berjenjang-aktif-radio"
                      type="radio"
                      value="2"
                      v-model="a_optadm"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label for="berjenjang-aktif-radio" class="ml-2 text-xs font-medium"
                      >Berjenjang</label
                    >
                  </div>
                </div>
                <div class="w-1/3 space-y-1 mx-auto">
                  <input
                    v-if="a_optadm == '1'"
                    :readonly="isView"
                    class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                    type="number"
                    float="0.05"
                    v-model="a_adm"
                    name="admin-per-bulan"
                    required
                  />
                  <button
                    v-else
                    @click=";(modal_detail = true), (detail_aktif = true)"
                    type="button"
                    class="rounded h-7 text-xs bg-primary hover:bg-primary/80 text-white w-full"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Ketentuan Tabungan Pasif</label>
            </div>

            <div class="grid items-center mx-auto w-8/12 p-2 h-32 rounded bg-white border mb-1">
              <div class="flex justify-center items-center w-full mb-1 border bg-slate-50 p-1">
                <label for="prosen-bunga" class="text-xs font-medium pb-1">Prosen Bunga</label>
                <input
                  :readonly="isView"
                  class="w-1/3 mx-5 h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                  type="number"
                  float="0.05"
                  v-model="p_bunga"
                  name="prosen-bunga"
                  required
                />
                <label for="prosen-bunga" class="text-xs font-medium pb-1">Prosen Per Tahun</label>
              </div>
              <div class="flex justify-center items-center w-full">
                <label for="admin-per-bulan" class="text-xs ml-2 w-1/4 font-medium pb-1"
                  >Admin Per Bulan</label
                >
                <div class="w-1/3 space-y-1 mx-auto border p-1">
                  <div class="flex ml-8 justify-start items-center">
                    <input
                      :disabled="isView"
                      id="flate-pasif-radio"
                      type="radio"
                      value="1"
                      v-model="p_optadm"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label for="flate-pasif-radio" class="ml-2 text-xs font-medium">Flate</label>
                  </div>
                  <div class="flex ml-8 justify-start items-center">
                    <input
                      :disabled="isView"
                      id="berjenjang-pasif-radio"
                      type="radio"
                      value="2"
                      v-model="p_optadm"
                      class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label for="berjenjang-pasif-radio" class="ml-2 text-xs font-medium"
                      >Berjenjang</label
                    >
                  </div>
                </div>
                <div class="w-1/3 space-y-1 mx-auto">
                  <input
                    :readonly="isView"
                    v-if="p_optadm == '1'"
                    class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                    type="number"
                    float="0.05"
                    name="admin-per-bulan"
                    v-model="p_adm"
                    required
                  />
                  <button
                    v-else
                    type="button"
                    @click=";(modal_detail = true), (detail_pasif = true)"
                    class="rounded h-7 text-xs bg-primary hover:bg-primary/80 text-white w-full"
                  >
                    Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Saldo Minimal</label>
            </div>

            <div class="flex items-center w-8/12 h-9 rounded bg-slate-50 border mb-1">
              <div class="flex mx-auto justify-center items-center w-1/3">
                <input
                  :readonly="isView"
                  class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                  type="number"
                  float="0.05"
                  v-model="saldo_minimal"
                  required
                />
              </div>
              <label for="360-radio" class="mx-2 text-xs font-medium">Batas Bunga</label>
              <div class="flex mx-auto justify-center items-center w-1/3">
                <input
                  :readonly="isView"
                  class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                  type="number"
                  float="0.05"
                  v-model="batas_bunga"
                  required
                />
              </div>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Dasar Perhitungan Tabungan Pasif</label>
            </div>

            <div
              class="grid items-center mx-auto w-8/12 py-1 px-2 space-y-0.5 h-20 rounded bg-white border mb-1"
            >
              <div class="flex items-center w-full">
                <div class="flex ml-4 justify-start items-center w-[55%]">
                  <input
                    :disabled="isView"
                    id="harian-checkbox"
                    type="checkbox"
                    v-model="optpasif1"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="harian-checkbox" class="ml-2 text-xs font-medium"
                    >Berdasar Hari</label
                  >
                </div>
                <div class="flex mx-10 justify-start items-center w-[45%]">
                  <input
                    :readonly="isView"
                    v-if="optpasif1 == true"
                    class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                    type="number"
                    v-model="haripasif"
                    float="0.05"
                    required
                  />
                </div>
              </div>
              <div class="flex w-full">
                <div class="flex ml-4 justify-start items-center w-[55%]">
                  <input
                    :disabled="isView"
                    id="saldo-checkbox"
                    type="checkbox"
                    v-model="optpasif2"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="saldo-checkbox" class="ml-2 text-xs font-medium"
                    >Berdasar Saldo, Lebih Kecil Dari</label
                  >
                </div>
                <div class="flex mx-10 justify-start items-center w-[45%]">
                  <input
                    :readonly="isView"
                    v-if="optpasif2 == true"
                    class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                    type="number"
                    float="0.05"
                    v-model="nomipasif"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Batas Pajak</label>
            </div>

            <div class="flex items-center w-8/12 h-9 rounded bg-slate-50 border mb-1">
              <div class="flex mx-auto justify-center items-center w-[27%]">
                <input
                  :readonly="isView"
                  class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                  type="number"
                  float="0.05"
                  name="batas-pajak"
                  v-model="batas_pajak"
                  required
                />
              </div>
              <label class="mx-auto text-xs font-medium">Prosen Pajak</label>
              <div class="flex mx-auto justify-center items-center w-[27%]">
                <input
                  :readonly="isView"
                  class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                  type="number"
                  float="0.05"
                  name="batas-pajak"
                  v-model="pajak"
                  required
                />
              </div>
              <label class="mx-auto text-xs font-medium">% Per Tahun</label>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Antar Bank</label>
            </div>

            <div class="w-8/12 flex-grow">
              <input
                :readonly="isView"
                class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                type="text"
                maxlength="1"
                v-model="antar_bank"
                required
              />
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Jurnal</label>
            </div>

            <div class="w-8/12 flex-grow">
              <button
                @click=";(modal_detail = true), (detail_jurnal = true)"
                type="button"
                class="rounded bg-primary hover:bg-primary/80 mb-1 text-xs w-24 h-7 text-white justify-center flex items-center"
              >
                <BookIcon class="inline w-5 h-5 mr-1" /> Detail
              </button>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Ketentuan Lain - Lain</label>
            </div>

            <div class="w-8/12 flex-grow">
              <button
                @click=";(modal_detail = true), (detail_lain = true)"
                type="button"
                class="rounded bg-primary hover:bg-primary/80 mb-1 text-xs w-24 h-7 text-white justify-center flex items-center"
              >
                <InfoIcon class="inline w-5 h-5 mr-1" /> Detail
              </button>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Dapat SHU</label>
            </div>

            <div class="flex items-center w-8/12 px-2 h-7 rounded bg-white border mb-1">
              <div class="flex mx-auto justify-center items-center w-1/2">
                <input
                  :disabled="isView"
                  id="ya-shu"
                  type="radio"
                  value="1"
                  v-model="dapat_shu"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="ya-shu" class="ml-2 text-xs font-medium">Ya</label>
              </div>
              <div class="flex mx-auto justify-center items-center w-1/2">
                <input
                  :disabled="isView"
                  id="tidak-shu"
                  type="radio"
                  value="2"
                  v-model="dapat_shu"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="tidak-shu" class="ml-2 text-xs font-medium">Tidak</label>
              </div>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-full">
            <div class="mb-1 w-4/12 text-xs mr-3">
              <label class="float-right">Perhitungan SHU</label>
            </div>

            <div class="flex items-center w-8/12 px-2 h-7 rounded bg-white border mb-1">
              <div class="flex mx-auto justify-center items-center w-1/2">
                <input
                  :disabled="isView"
                  id="saldo-akhir-shu"
                  type="radio"
                  value="1"
                  v-model="metode_shu"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="saldo-akhir-shu" class="ml-2 text-xs font-medium">Saldo Akhir</label>
              </div>
              <div class="flex mx-auto justify-center items-center w-1/2">
                <input
                  :disabled="isView"
                  id="jumlah-mutasi-shu"
                  type="radio"
                  value="2"
                  v-model="metode_shu"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="jumlah-mutasi-shu" class="ml-2 text-xs font-medium"
                  >Jumlah Mutasi</label
                >
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
      <button v-if="!isView" type="submit" form="produkSimpataForm" class="btn btn-primary w-32">
        Simpan
      </button>
    </ModalFooter>
  </Modal>

  <Modal backdrop="static" size="modal-lg" :show="modal_detail" @hidden="modal_detail = false">
    <ModalHeader>
      <h2 v-if="detail_jurnal" class="font-medium text-base mr-auto">Rekening Jurnal</h2>
      <h2 v-else-if="detail_lain" class="font-medium text-base mr-auto">Ketentuan Lainya</h2>
      <h2 v-else-if="detail_aktif" class="font-medium text-base mr-auto">
        Admin Berjenjang Tabungan Aktif
      </h2>
      <h2 v-else class="font-medium text-base mr-auto">Admin Berjenjang Tabungan Pasif</h2>

      <a
        data-tw-dismiss="modal"
        href="javascript:;"
        @click="
          ;(modal_detail = false), (detail_jurnal = false)
          ;(detail_lain = false), (detail_aktif = false), (detail_pasif = false)
        "
        class="border bg-danger rounded-lg hover:bg-red-700 -my-5 -mr-3"
      >
        <XIcon class="lucide lucide-x w-7 h-7 text-white hover:text-slate-100" />
      </a>
    </ModalHeader>
    <ModalBody>
      <form method="post" v-if="detail_jurnal" id="rekening-jurnal" @submit.prevent="">
        <div class="text-gray-700 flex items-center mx-auto w-9/12">
          <div class="mb-1 w-2/12 text-xs mr-3">
            <label class="float-right">Kode Produk</label>
          </div>

          <div class="w-9/12 flex-grow">
            <input
              :readonly="isView"
              class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
              type="text"
              v-model="kode_produk"
              maxlength="4"
              readonly
            />
          </div>
        </div>
        <div class="text-gray-700 flex items-center mx-auto w-9/12">
          <div class="mb-1 w-2/12 text-xs mr-3">
            <label class="float-right">Nama Produk</label>
          </div>

          <div class="w-9/12 flex-grow">
            <input
              :readonly="isView"
              class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
              type="text"
              v-model="nama_produk"
              maxlength="40"
              readonly
            />
          </div>
        </div>
        <div class="bg-pink-100 p-3 rounded-b">
          <div class="text-gray-700 flex items-center mx-auto w-10/12 mb-1 space-x-3">
            <div class="mb-1 w-3/12 text-xs">
              <input
                :readonly="isView"
                v-model="jurnaltab"
                class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="text"
                readonly
              />
            </div>
            <div class="w-1/12 flex-grow">
              <select
                :disabled="isView"
                v-model="jurnaltab"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
            <div class="mb-1 w-8/12 text-xs">
              <label>SIMPANAN - Tabungan</label>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-10/12 mb-1 space-x-3">
            <div class="mb-1 w-3/12 text-xs">
              <input
                class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="text"
                v-model="jurnalutangbg"
                readonly
              />
            </div>
            <div class="w-1/12 flex-grow">
              <select
                :disabled="isView"
                v-model="jurnalutangbg"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
            <div class="mb-1 w-8/12 text-xs">
              <label>UTANG BUNGA - Beban Jasa Tabungan yang masih harus dibayar</label>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-10/12 mb-1 space-x-3">
            <div class="mb-1 w-3/12 text-xs">
              <input
                class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="text"
                v-model="jurnalbunga"
                readonly
              />
            </div>
            <div class="w-1/12 flex-grow">
              <select
                :disabled="isView"
                v-model="jurnalbunga"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
            <div class="mb-1 w-8/12 text-xs">
              <label>BEBAN BUNGA - Beban Jasa Tabungan</label>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-10/12 mb-1 space-x-3">
            <div class="mb-1 w-3/12 text-xs">
              <input
                class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="text"
                v-model="jurnaladm"
                readonly
              />
            </div>
            <div class="w-1/12 flex-grow">
              <select
                :disabled="isView"
                v-model="jurnaladm"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
            <div class="mb-1 w-8/12 text-xs">
              <label>PENDAPATAN LAIN-LAIN - Biaya Administrasi</label>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-10/12 mb-1 space-x-3">
            <div class="mb-1 w-3/12 text-xs">
              <input
                class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="text"
                v-model="jurnaladmtutup"
                readonly
              />
            </div>
            <div class="w-1/12 flex-grow">
              <select
                :disabled="isView"
                v-model="jurnaladmtutup"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
            <div class="mb-1 w-8/12 text-xs">
              <label>PENDAPATAN LAIN-LAIN - Biaya Administrasi Penutupan Rekening</label>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-10/12 mb-1 space-x-3">
            <div class="mb-1 w-3/12 text-xs">
              <input
                class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="text"
                v-model="jurnalpajak"
                readonly
              />
            </div>
            <div class="w-1/12 flex-grow">
              <select
                :disabled="isView"
                v-model="jurnalpajak"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
            <div class="mb-1 w-8/12 text-xs">
              <label>KEWAJIBAN SEGERA - Potongan Pajak</label>
            </div>
          </div>
          <div class="text-gray-700 flex items-center mx-auto w-10/12 mb-1 space-x-3">
            <div class="mb-1 w-3/12 text-xs">
              <input
                class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="text"
                readonly
                v-model="jurnalksd"
              />
            </div>
            <div class="w-1/12 flex-grow">
              <select
                :disabled="isView"
                v-model="jurnalksd"
                class="w-full h-7 mb-1 px-0 text-xs border rounded focus:shadow-outline"
              >
                <option value="-" selected disabled>-</option>
                <option v-for="perkiraan in Perkiraan_list" :value="perkiraan.noper">
                  {{ perkiraan.noper }}
                  -
                  {{ perkiraan.nama }}
                </option>
              </select>
            </div>
            <div class="mb-1 w-8/12 text-xs">
              <label>KEWAJIBAN KEPADA NASABAH - Hadiah</label>
            </div>
          </div>
        </div>
      </form>
      <form method="post" v-else-if="detail_lain" id="ketentuan-lain" @submit.prevent="">
        <div class="text-gray-700 flex items-center mx-auto w-full">
          <div class="mb-1 w-4/12 text-xs mr-3">
            <label class="float-right">Pada Saat Buka Rekening</label>
          </div>

          <div class="grid items-center mx-auto w-8/12 p-2 h-32 rounded bg-white border-2 mb-1">
            <div class="flex justify-center items-center w-full mb-1 border bg-slate-50 p-1">
              <label for="max-tgl" class="text-xs font-medium pb-1">Maksimal Tgl</label>
              <input
                :readonly="isView"
                class="w-[10%] mx-5 h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="number"
                name="max-tgl"
                value="5"
                required
              />
              <label for="max-tgl" class="text-xs font-medium pb-1"
                >Bunga Diperhitungkan (Bunga Saldo Minimal)</label
              >
            </div>
            <div class="flex justify-center items-center w-full mb-1 border bg-slate-50 p-1">
              <label for="kupon" class="text-xs font-medium pb-1">Kupon</label>
              <input
                :readonly="isView"
                class="w-[10%] mx-5 h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="number"
                name="kupon"
                value="1"
                required
              />
              <label for="kupon" class="text-xs font-medium pb-1"
                >Tambahan Kupon untuk Rekening Baru</label
              >
            </div>
          </div>
        </div>
        <div class="text-gray-700 flex items-center mx-auto w-full">
          <div class="mb-1 w-4/12 text-xs mr-3">
            <label class="float-right">Perhitungan Kupon Undian</label>
          </div>

          <div
            class="grid items-center mx-auto w-8/12 py-1 px-2 space-y-0.5 h-60 rounded bg-white border-2 mb-1"
          >
            <div class="text-gray-700 flex items-center mx-auto w-full">
              <div class="mb-1 w-4/12 text-xs mr-3">
                <label class="float-right">Tabungan Berhadiah</label>
              </div>

              <div class="flex items-center w-8/12 px-2 h-7 rounded bg-white border mb-1">
                <div class="flex mx-auto justify-center items-center w-1/2">
                  <input
                    :disabled="isView"
                    id="ya-hadiah"
                    checked
                    type="radio"
                    value="1"
                    name="dapat_hadiah"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="ya-hadiah" class="ml-2 text-xs font-medium">Ya</label>
                </div>
                <div class="flex mx-auto justify-center items-center w-1/2">
                  <input
                    :disabled="isView"
                    id="tidak-hadiah"
                    type="radio"
                    value="2"
                    name="dapat_hadiah"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="tidak-hadiah" class="ml-2 text-xs font-medium">Tidak</label>
                </div>
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-full">
              <div class="mb-1 w-4/12 text-xs mr-3">
                <label class="float-right">Dasar Perhitungan Kupon</label>
              </div>

              <div class="w-8/12 p-3 h-20 rounded bg-white border mb-1">
                <div class="flex mx-2 justify-start mb-1 items-center w-full">
                  <input
                    :disabled="isView"
                    checked
                    id="saldo-minimal"
                    type="radio"
                    value="1"
                    name="saldo_perhitungan"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="saldo-minimal" class="ml-2 text-xs font-medium">Saldo Minimal</label>
                </div>
                <div class="flex mx-2 justify-start mb-1 items-center w-full">
                  <input
                    :disabled="isView"
                    id="saldo-rata"
                    type="radio"
                    value="2"
                    name="saldo_perhitungan"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="saldo-rata" class="ml-2 text-xs font-medium">Saldo Rata - Rata</label>
                </div>
                <div class="flex mx-2 justify-start mb-1 items-center w-full">
                  <input
                    :disabled="isView"
                    id="saldo-akhir"
                    type="radio"
                    value="3"
                    name="saldo_perhitungan"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="saldo-akhir" class="ml-2 text-xs font-medium">Saldo Akhir</label>
                </div>
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-full">
              <div class="text-gray-700 flex items-center mx-auto w-full">
                <div class="mb-1 w-4/12 text-xs mr-3">
                  <label class="float-right">Setiap Kelipatan</label>
                </div>

                <div class="w-8/12 flex-grow">
                  <input
                    :readonly="isView"
                    class="w-full h-7 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                    type="text"
                    required
                    value="10000"
                  />
                </div>
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-full">
              <div class="mb-1 w-4/12 text-xs mr-3">
                <label class="float-right">Penomoran Kupon</label>
              </div>

              <div class="w-8/12 p-3 h-14 rounded bg-white border mb-1">
                <div class="flex mx-2 justify-start mb-1 items-center w-full">
                  <input
                    :disabled="isView"
                    id="kupon-global"
                    type="radio"
                    checked
                    value="1"
                    name="penomoran-kupon"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="kupon-global" class="ml-2 text-xs font-medium">Global</label>
                </div>
                <div class="flex mx-2 justify-start mb-1 items-center w-full">
                  <input
                    :disabled="isView"
                    id="kupon-khusus"
                    type="radio"
                    value="2"
                    name="penomoran-kupon"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label for="kupon-khusus" class="ml-2 text-xs font-medium">Khusus</label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="text-gray-700 flex items-center mx-auto w-full">
          <div class="mb-1 w-4/12 text-xs mr-3">
            <label class="float-right">Penutupan Rekening Otomatis</label>
          </div>

          <div
            class="grid items-center mx-auto w-8/12 py-1 px-2 space-y-0.5 h-28 rounded bg-white border-2 mb-1"
          >
            <div class="flex items-center w-full">
              <div class="flex ml-4 justify-start items-center w-[55%]">
                <input
                  :disabled="isView"
                  checked
                  id="rekening-pasif"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="rekening-pasif" class="ml-2 text-xs font-medium">Rekening Pasif</label>
              </div>
            </div>
            <div class="flex items-center w-full">
              <div class="flex ml-4 justify-start items-center w-[55%]">
                <input
                  :disabled="isView"
                  id="no-actifity"
                  checked
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="no-actifity" class="ml-2 text-xs font-medium"
                  >Tidak Ada Aktifitas</label
                >
              </div>
              <div class="flex mx-10 justify-start items-center w-[45%]">
                <input
                  :readonly="isView"
                  class="w-9/12 h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                  type="number"
                  value="1"
                  required
                />
                <label for="no-actifity" class="ml-2 w-3/12 text-xs font-medium">Hari</label>
              </div>
            </div>
            <div class="flex w-full">
              <div class="flex ml-4 justify-start items-center w-[55%]">
                <input
                  :disabled="isView"
                  id="saldo-lebih"
                  type="checkbox"
                  checked
                  class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label for="saldo-lebih" class="ml-2 text-xs font-medium"
                  >Saldo Lebih Kecil Atau Sama Dengan</label
                >
              </div>
              <div class="flex mx-10 justify-start items-center w-[45%]">
                <input
                  :readonly="isView"
                  class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                  type="number"
                  value="1"
                  required
                />
              </div>
            </div>
          </div>
        </div>
      </form>
      <form
        method="post"
        v-else
        :id="detail_aktif ? 'tabungan-aktif' : 'tabungan-pasif'"
        @submit.prevent=""
      >
        <div class="border-2 px-[25px] py-1 rounded-t">
          <div class="text-gray-700 flex justify-center items-center mx-auto w-full space-x-2">
            <div class="w-10/12 text-sm font-semibold text-center">Range Saldo</div>
            <div class="w-2/12 font-semibold text-sm text-center">Administrasi</div>
          </div>
        </div>
        <div class="bg-pink-100 p-3 rounded-b">
          <div class="text-gray-700 flex justify-center items-center mx-auto w-full mb-1 space-x-3">
            <div class="mb-1 w-4/12 text-xs">
              <input
                :readonly="isView"
                v-if="detail_aktif"
                class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="text"
                v-model="a_nomi_adm1"
              />
              <input
                :readonly="isView"
                v-else
                class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="text"
                v-model="p_nomi_adm1"
              />
            </div>
            <div class="mb-1 w-1/12 text-xs text-center">
              <label>S / D</label>
            </div>
            <div class="mb-1 w-4/12 text-xs">
              <input
                :readonly="isView"
                v-if="detail_aktif"
                class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="text"
                v-model="a_nomi_adm1"
              />
              <input
                :readonly="isView"
                v-else
                class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="text"
                v-model="p_nomi_adm1"
              />
            </div>
            <div class="mb-1 w-2/12 text-xs">
              <input
                :readonly="isView"
                v-if="detail_aktif"
                class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="text"
                v-model="a_adm1"
              />
              <input
                :readonly="isView"
                v-else
                class="w-full h-7 px-0.5 text-xs border-2 rounded focus:shadow-outline"
                type="text"
                v-model="p_adm1"
              />
            </div>
          </div>
        </div>
      </form>
    </ModalBody>
    <ModalFooter class="text-right">
      <button
        type="button"
        class="btn btn-outline-secondary w-32 mr-1"
        @click="
          ;(modal_detail = false), (detail_jurnal = false)
          ;(detail_lain = false), (detail_aktif = false), (detail_pasif = false)
        "
      >
        Cancel
      </button>
      <button
        v-if="!isView"
        type="submit"
        :form="
          detail_jurnal
            ? 'rekening-jurnal'
            : detail_lain
            ? 'ketentuan-lain'
            : detail_aktif
            ? 'tabungan-aktif'
            : 'tabungan-pasif'
        "
        class="btn btn-primary w-32"
      >
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
