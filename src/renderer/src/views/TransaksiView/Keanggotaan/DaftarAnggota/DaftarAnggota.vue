<script setup>
import { useDaftarAnggotaStore } from '@renderer/stores/daftarAnggota.js'
import { onMounted, ref, watch, inject } from 'vue'
import moment from 'moment'
import Breadcrumbs from '@renderer/components/Breadcrumbs/Breadcrumbs.vue'
import PP from '@renderer/assets/images/pp-placeholder.svg'
import { list_jenis_kelamin, list_agama, list_resort } from '@renderer/utils/json'
import { currencyFormatter } from '@renderer/utils/helper'
import TRANSAKSI from '@renderer/assets/images/menu/transaksi.svg'

const swal = inject('$swal')
const daftarAnggota = useDaftarAnggotaStore()
const isLoading = ref(false)
const isAdd = ref(false)
const isEdit = ref(false)
const isView = ref(false)
const modal_utama = ref(false)
const modal_delete = ref(false)
const sort_by = ref('iddata')
const sort_mode = ref(true)
const search_data = ref('')
const search_type = ref('iddata')
const page_number = ref(1)
const total_pages = ref(0)
const row_per_page = ref(50)
const allSelected = ref(false)
const userIds = ref([])
const id_anggota = ref('')
const foto_profile = ref()
const previewFoto = ref(null)
const fileFoto = ref(null)
const imageFoto = ref(null)
const foto_ttd = ref()
const previewTTD = ref(null)
const fileTTD = ref(null)
const imageTTD = ref(null)
const foto_pa = ref()
const previewPA = ref(null)
const filePA = ref(null)
const imagePA = ref(null)
const tanggal = ref(moment(Date.now()).format('DD-MM-YYYY'))
const no_anggota = ref('')
const no_ktp = ref('')
const no_kk = ref('')
const nama_lengkap = ref('')
const tempat_lahir = ref('')
const tanggal_lahir = ref('')
const jenis_kelamin = ref('')
const agama = ref('')
const alamat = ref('')
const rt = ref('')
const rw = ref('')
const kelurahan = ref('')
const kecamatan = ref('')
const kota = ref('')
const pendamping = ref('')
const pekerjaan = ref('')
const no_telepon = ref('')
const resort = ref('')
const tanggal_bht = ref('')
const simpanan_pokok = ref('')
const simpanan_swk = ref('')
const simpanan_wajib = ref('')
const simpanan_lain = ref('')
const total_simpanan = ref('')

const addGet = () => {
  isAdd.value = true
  modal_utama.value = true
}
const editGet = async (e) => {
  isEdit.value = true
  modal_utama.value = true
  const anggota = await daftarAnggota.getItem(e)
  id_anggota.value = anggota.iddata
  tanggal.value = moment(anggota.tanggal).format('DD-MM-YYYY')
  no_anggota.value = anggota.cif
  no_ktp.value = anggota.noktp
  no_kk.value = anggota.nokK
  nama_lengkap.value = anggota.nama
  tempat_lahir.value = anggota.tempatlhr
  tanggal_lahir.value = moment(anggota.tanggallhr).format('YYYY-MM-DD')
  jenis_kelamin.value =
    anggota.jeniskl == 'L'
      ? 'L'
      : anggota.jeniskl == 'LAKI-LAKI    '
      ? 'L'
      : anggota.jeniskl == 'PEREMPUAN'
      ? 'P'
      : 'P'
  agama.value = anggota.agama
  alamat.value = anggota.alamat
  rt.value = anggota.rt.split('/') ? anggota.rt.split('/')[0] : anggota.rt
  rw.value = anggota.rt.split('/') ? anggota.rt.split('/')[1] : anggota.rt
  kelurahan.value = anggota.desa
  kecamatan.value = anggota.kecamatan
  kota.value = anggota.kota
  pendamping.value = 'nama pendamping'
  pekerjaan.value = anggota.pekerjaan
  no_telepon.value = anggota.phone
  resort.value = anggota.resort
  tanggal_bht.value = moment(anggota.tanggalbht).format('YYYY-MM-DD')
  simpanan_pokok.value = currencyFormatter.format(anggota.simpokok).replace('Rp', '').trim()
  simpanan_swk.value = currencyFormatter.format(anggota.simsuka).replace('Rp', '').trim()
  simpanan_wajib.value = currencyFormatter.format(anggota.simwajib).replace('Rp', '').trim()
  simpanan_lain.value = currencyFormatter.format(anggota.lain).replace('Rp', '').trim()
  total_simpanan.value = currencyFormatter.format(anggota.simshu).replace('Rp', '').trim()
}
const deleteGet = (e) => {
  const anggota = e

  if (anggota.iddata) {
    userIds.value = []
    userIds.value.push(anggota.iddata)
    console.log('delete get 1', userIds.value)
    modal_delete.value = true
  } else {
    if (userIds.value.length > 0) {
      console.log('delete get 1+', userIds.value)
      modal_delete.value = true
    }
  }
}

const uint8ToBase64 = (arrayBuffer) => {
  var base64 = ''
  var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  var bytes = new Uint8Array(arrayBuffer)
  var byteLength = bytes.byteLength
  var byteRemainder = byteLength % 3
  var mainLength = byteLength - byteRemainder

  var a, b, c, d
  var chunk

  // Main loop deals with bytes in chunks of 3
  for (var i = 0; i < mainLength; i = i + 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63 // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder == 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4 // 3   = 2^2 - 1

    base64 += encodings[a] + encodings[b] + '=='
  } else if (byteRemainder == 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2 // 15    = 2^4 - 1

    base64 += encodings[a] + encodings[b] + encodings[c] + '='
  }

  return base64
}
const viewData = async (e) => {
  isView.value = true
  modal_utama.value = true
  const anggota = await daftarAnggota.getItem(e)
  id_anggota.value = anggota.iddata
  tanggal.value = moment(anggota.tanggal).format('DD-MM-YYYY')
  no_anggota.value = anggota.cif
  no_ktp.value = anggota.noktp
  no_kk.value = anggota.nokK
  nama_lengkap.value = anggota.nama
  tempat_lahir.value = anggota.tempatlhr
  tanggal_lahir.value = moment(anggota.tanggallhr).format('YYYY-MM-DD')
  jenis_kelamin.value =
    anggota.jeniskl == 'L'
      ? 'L'
      : anggota.jeniskl == 'LAKI-LAKI    '
      ? 'L'
      : anggota.jeniskl == 'PEREMPUAN'
      ? 'P'
      : 'P'
  agama.value = anggota.agama
  alamat.value = anggota.alamat
  rt.value = anggota.rt
  rw.value = anggota.rt
  kelurahan.value = anggota.desa
  kecamatan.value = anggota.kecamatan
  kota.value = anggota.kota
  pendamping.value = 'nama pendamping'
  pekerjaan.value = anggota.pekerjaan
  no_telepon.value = anggota.phone
  resort.value = anggota.resort
  tanggal_bht.value = moment(anggota.tanggalbht).format('YYYY-MM-DD')
  simpanan_pokok.value = currencyFormatter.format(anggota.simpokok).replace('Rp', '').trim()
  simpanan_swk.value = currencyFormatter.format(anggota.simsuka).replace('Rp', '').trim()
  simpanan_wajib.value = currencyFormatter.format(anggota.simwajib).replace('Rp', '').trim()
  simpanan_lain.value = currencyFormatter.format(anggota.lain).replace('Rp', '').trim()
  total_simpanan.value = currencyFormatter.format(anggota.shu).replace('Rp', '').trim()
  //previewFoto.value = anggota.foto.buffer
  // var urlCreator = window.URL || window.webkitURL
  // previewFoto.value = uint8ToBase64(anggota.foto.buffer)

  console.log(
    anggota.foto
    // URL.createObjectURL(new Blob([anggota.foto.buffer], { type: 'image/png' } /* (1) */))
  )
}

const getImgUrl = (gambar_varian) => {
  if (gambar_varian) {
    var images = gambar_varian.data.map((b) => String.fromCharCode(b)).join('')
    gambar_lama_preview.value = new URL(`${publicPath}gambar/${images}`).href
    if (isEdit.value) {
      url.value = gambar_lama_preview.value
    }
    return gambar_lama_preview.value
  } else {
    return `${new URL(window.location.origin)}` + ' 404.png'
  }
}
const convertDataURIToBinary = (dataURI) => {
  var BASE64_MARKER = ';base64,'
  var base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length
  var base64 = dataURI.substring(base64Index)
  var raw = window.atob(base64)
  var rawLength = raw.length
  var array = new Uint8Array(new ArrayBuffer(rawLength))

  for (let i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i)
  }
  return array
}

const previewImage = (event) => {
  // console.log(event.target.id)
  var input = event.target
  if (input.files) {
    var reader = new FileReader()
    reader.onload = (e) => {
      var base64Img = e.target.result
      if (event.target.id == 'foto_anggota') {
        previewFoto.value = base64Img
        imageFoto.value = convertDataURIToBinary(base64Img)
      } else if (event.target.id == 'foto_ttd') {
        previewTTD.value = base64Img
        imageTTD.value = convertDataURIToBinary(base64Img)
      } else if (event.target.id == 'foto_pa') {
        previewPA.value = base64Img
        imagePA.value = convertDataURIToBinary(base64Img)
      }
    }
    if (event.target.id == 'foto_anggota') {
      fileFoto.value = input.files[0]
    } else if (event.target.id == 'foto_ttd') {
      fileTTD.value = input.files[0]
    } else if (event.target.id == 'foto_pa') {
      filePA.value = input.files[0]
    }

    reader.readAsDataURL(input.files[0])
  }
}
const simpan_data = async (e) => {
  try {
    await daftarAnggota.postItem(
      //console.log(
      id_anggota.value,
      fileFoto.value,
      fileTTD.value,
      filePA.value,

      // imageFoto.value,
      // imageTTD.value,
      // imagePA.value,
      moment(Date.now(tanggal.value)).format('YYYY-MM-DD'),
      no_anggota.value,
      no_ktp.value,
      no_kk.value,
      nama_lengkap.value,
      tempat_lahir.value,
      tanggal_lahir.value,
      jenis_kelamin.value,
      agama.value,
      alamat.value,
      rt.value,
      rw.value,
      kelurahan.value,
      kecamatan.value,
      kota.value,
      pendamping.value,
      pekerjaan.value,
      no_telepon.value,
      resort.value
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
const deleteAnggota = async () => {
  if (userIds.value.length > 1) {
    for (let idAnggota = 0; idAnggota < userIds.value.length; idAnggota++) {
      console.log('delete post 1+', userIds.value[idAnggota])
      await daftarAnggota.removeItem(userIds.value[idAnggota])
    }
  } else {
    console.log('delete post 1', userIds.value)
    await daftarAnggota.removeItem(userIds.value[0])
  }
  resetForm()
}
const resetForm = () => {
  if (modal_utama.value == false && isEdit.value == false && isView.value == false) {
    search_data.value = ''
    search_type.value = 'iddata'
    sort_by.value = 'iddata'
    sort_mode.value = true
    page_number.value = 1
    total_pages.value = 0
    row_per_page.value = 50
  }
  allSelected.value = false
  userIds.value = []
  id_anggota.value = ''
  foto_profile.value = null
  fileFoto.value = null
  imageFoto.value = null
  previewFoto.value = null
  foto_pa.value = null
  filePA.value = null
  imagePA.value = null
  previewPA.value = null
  foto_ttd.value = null
  fileTTD.value = null
  imageTTD.value = null
  previewTTD.value = null
  tanggal.value = moment(Date.now()).format('DD-MM-YYYY')
  no_anggota.value = ''
  no_ktp.value = ''
  no_kk.value = ''
  nama_lengkap.value = ''
  tempat_lahir.value = ''
  tanggal_lahir.value = ''
  jenis_kelamin.value = ''
  agama.value = ''
  alamat.value = ''
  rt.value = ''
  rw.value = ''
  kelurahan.value = ''
  kecamatan.value = ''
  kota.value = ''
  pendamping.value = ''
  pekerjaan.value = ''
  no_telepon.value = ''
  resort.value = ''
  tanggal_bht.value = ''
  simpanan_pokok.value = ''
  simpanan_swk.value = ''
  simpanan_wajib.value = ''
  simpanan_lain.value = ''
  total_simpanan.value = ''
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
    await daftarAnggota.readItem(
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
    await daftarAnggota.readItem(
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
    const data = await daftarAnggota.readItem(
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
    const data = await daftarAnggota.readItem(
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
    const data = await daftarAnggota.readItem(
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
    for (let anggota = 0; anggota < daftarAnggota.items.length; anggota++) {
      userIds.value.push(daftarAnggota.items[anggota].iddata)
    }
  }
}
const selectOne = () => {
  allSelected.value = false
}

onMounted(async () => {
  try {
    isLoading.value = true
    const data = await daftarAnggota.readItem(
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
  <Breadcrumbs title="Transaksi" subTitle="Keanggotaan" :icon="TRANSAKSI" />
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
              <option value="nama">Nama</option>
              <option value="iddata">ID</option>
              <option value="cif">No Anggota</option>
              <option value="noktp">No KTP</option>
              <option value="alamat">Alamat</option>
              <option value="desa">Desa</option>
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
              class="text-center uppercase border cursor-pointer hover:bg-blue-300 w-[60px]"
              @click="sorting('iddata')"
            >
              ID
              <SortAscIcon
                v-if="sort_by === 'iddata' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'iddata' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('cif')"
            >
              No. Anggota
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
              @click="sorting('resort')"
            >
              Resort
              <SortAscIcon
                v-if="sort_by === 'resort' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'resort' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('noktp')"
            >
              Nomor KTP
              <SortAscIcon
                v-if="sort_by === 'noktp' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'noktp' && !sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
            </th>
            <th
              scope="col"
              class="text-center uppercase border cursor-pointer hover:bg-blue-300"
              @click="sorting('nokK')"
            >
              Kartu Keluarga
              <SortAscIcon
                v-if="sort_by === 'nokK' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'nokK' && !sort_mode"
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
              @click="sorting('desa')"
            >
              Desa
              <SortAscIcon
                v-if="sort_by === 'desa' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'desa' && !sort_mode"
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
              @click="sorting('statuskawin')"
            >
              Nama Pendamping
              <SortAscIcon
                v-if="sort_by === 'statuskawin' && sort_mode"
                class="inline ml-2 -pr-3 mr-1 w-5 h-4"
              />
              <SortDescIcon
                v-if="sort_by === 'statuskawin' && !sort_mode"
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
            v-for="anggota in daftarAnggota.items"
            :key="anggota.iddata"
            :anggota="anggota"
            :value="anggota.iddata"
          >
            <td class="w-4 border-r border-b font-medium p-0 pl-3">
              <div class="flex items-center">
                <span
                  class="hidden cursor-pointer -ml-[9px] mr-[1px] rotate-90 group-hover:block text-black"
                  >:::</span
                >
                <input
                  :value="anggota.iddata"
                  type="checkbox"
                  v-model="userIds"
                  @click="selectOne"
                  class="data-checkbox w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-lg focus:ring-blue-500 focus:ring-2"
                />
              </div>
            </td>
            <th
              @dblclick="viewData(anggota.iddata)"
              scope="row"
              class="border-r border-b font-medium whitespace-nowrap pl-2"
            >
              {{ anggota.iddata }}
            </th>
            <td
              @dblclick="viewData(anggota.iddata)"
              class="min-w-max text-center border-r border-b font-medium px-2"
            >
              {{ anggota.cif }}
            </td>
            <td
              @dblclick="viewData(anggota.iddata)"
              class="min-w-max text-center border-r border-b font-medium px-2"
            >
              {{ moment(anggota.tanggal).format('DD-MM-YYYY') }}
            </td>
            <td
              @dblclick="viewData(anggota.iddata)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ anggota.resort }}
            </td>
            <td
              @dblclick="viewData(anggota.iddata)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ anggota.noktp }}
            </td>
            <td
              @dblclick="viewData(anggota.iddata)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ anggota.nokK }}
            </td>
            <td
              @dblclick="viewData(anggota.iddata)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ anggota.nama }}
            </td>
            <td
              @dblclick="viewData(anggota.iddata)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ anggota.alamat }}
            </td>
            <td
              @dblclick="viewData(anggota.iddata)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ anggota.desa }}
            </td>
            <td
              @dblclick="viewData(anggota.iddata)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ anggota.kecamatan }}
            </td>
            <td
              @dblclick="viewData(anggota.iddata)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ anggota.kota }}
            </td>
            <td
              @dblclick="viewData(anggota.iddata)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ anggota.statuskawin }}
            </td>
            <td
              @dblclick="viewData(anggota.iddata)"
              class="min-w-max text-left border-r border-b font-medium px-2"
            >
              {{ anggota.kantor }}
            </td>
            <td class="min-w-max border-r border-b font-medium p-1">
              <div class="flex justify-center">
                <a
                  @click="editGet(anggota.iddata)"
                  class="flex items-center mr-4 hover:text-blue-700 text-sky-600"
                  href="javascript:;"
                >
                  <CheckSquareIcon class="w-3 h-3 mr-1" /> Edit
                </a>
                <a
                  @click="deleteGet(anggota)"
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
    <ModalBody>
      <div
        v-if="isView || isEdit"
        class="flex space-x-4 -mx-5 py-2 justify-center -mt-5 mb-3 bg-gray-100"
      >
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-amber-800 bg-white hover:bg-slate-200"
          title="Fasilitas"
        >
          <BookIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Fasilitas</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-slate-600 bg-white hover:bg-slate-200"
          title="Simpanan Pokok"
        >
          <BanknoteIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Simp. Pokok</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-amber-400 bg-white hover:bg-slate-200"
          title="Simpanan Wajib"
        >
          <CoinsIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Simp. Wajib</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-amber-700 bg-white hover:bg-slate-200"
          title="Simpanan SWK"
        >
          <ScaleIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Simp. SWK</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-red-300 bg-white hover:bg-slate-200"
          title="Simpanan Lain - Lain"
        >
          <PiggyBankIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Simp. Lain</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-primary bg-white hover:bg-slate-200"
          title="Simpanan SHU"
        >
          <LandmarkIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Simp. SHU</span
          >
        </button>
        <button
          class="px-2 h-10 border rounded-md box flex items-center text-green-600 bg-white hover:bg-slate-200"
          title="Simpanan Saldo"
        >
          <WalletIcon class="w-5 h-5 mr-1 mx-auto stroke-2 stroke-current" />
          <span class="px-0.5 mx-auto my-[2px] stroke-2 stroke-current text-xs text-black font-bold"
            >Simp. Saldo</span
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
      </div>
      <div class="-mx-4">
        <form
          id="daftarAnggotaForm"
          class="grid grid-cols-12 gap-4 pl-2"
          @submit.prevent="simpan_data"
        >
          <div class="border-r-2 mx-auto col-span-3 overflow-y-auto mt-0">
            <div
              class="border-4 relative rounded-md border-dashed p-2 m-2 text-sm mx-auto text-center mb-4 max-w-max h-[40%] bg-gray-100"
            >
              <div class="border p-1">
                <img
                  :src="PP"
                  v-if="!previewFoto"
                  class="h-[135px] mx-auto items-center my-5 hover:scale-110 transition duration-500 ease-in-out"
                />
                <template v-if="previewFoto">
                  <img
                    :src="previewFoto"
                    class="h-[125px] mx-auto mb-2 hover:scale-110 transition duration-500 ease-in-out"
                  />
                  <p class="mb-0 text-xs rounded-t-md border-b bg-white">{{ fileFoto.name }}</p>
                  <p class="mb-1 text-xs rounded-b-md bg-white">
                    {{ fileFoto.size / 1024 }}<span class="font-semibold"> KB</span>
                  </p>
                </template>
              </div>

              <input
                type="file"
                accept="image/*"
                @change="previewImage"
                class="text-[10px] w-full cursor-pointer"
                id="foto_anggota"
                ref="foto_profile"
              />

              <label
                for="foto"
                class="font-medium text-base rounded-lg bg-white px-2 absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Foto Anggota</label
              >
            </div>
            <div
              class="border-4 relative rounded-md border-dashed p-2 m-2 text-sm text-center mb-4 bg-gray-100"
            >
              <div class="border p-1">
                <PointerIcon
                  v-if="!previewTTD"
                  class="h-[90px] mx-auto items-center hover:scale-150 opacity-40 transition duration-500 ease-in-out"
                  title="Tanda Tangan"
                />
                <template v-if="previewTTD">
                  <img
                    :src="previewTTD"
                    class="h-[60px] mx-auto mb-2 hover:scale-110 hover:opacity-60 transition duration-500 ease-in-out"
                  />
                  <p class="mb-0 text-xs rounded-t-md border-b bg-white">{{ fileTTD.name }}</p>
                  <p class="mb-1 text-xs rounded-b-md bg-white">
                    {{ fileTTD.size / 1024 }}<span class="font-semibold"> KB</span>
                  </p>
                </template>
              </div>

              <input
                type="file"
                accept="image/*"
                @change="previewImage"
                class="text-[10px] w-full cursor-pointer"
                id="foto_ttd"
                ref="foto_ttd"
              />
              <label
                for="foto"
                class="font-medium text-base rounded-lg bg-white px-2 absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Tanda Tangan Anggota</label
              >
            </div>
            <div
              class="border-4 relative rounded-md border-dashed p-2 m-2 text-sm text-center mb-4 bg-gray-100"
            >
              <div class="border p-1">
                <PenToolIcon
                  v-if="!previewPA"
                  class="h-[90px] mx-auto items-center hover:scale-150 opacity-40 hover:opacity-60 transition duration-500 ease-in-out"
                />
                <template v-if="previewPA">
                  <img
                    :src="previewPA"
                    class="h-[60px] mx-auto mb-2 hover:scale-110 transition duration-500 ease-in-out"
                  />
                  <p class="mb-0 text-xs rounded-t-md border-b bg-white">{{ filePA.name }}</p>
                  <p class="mb-1 text-xs rounded-b-md bg-white">
                    {{ filePA.size / 1024 }}<span class="font-semibold"> KB</span>
                  </p>
                </template>
              </div>

              <input
                type="file"
                accept="image/*"
                @change="previewImage"
                class="text-[10px] w-full cursor-pointer"
                id="foto_pa"
                ref="foto_pa"
              />
              <label
                for="foto"
                class="font-medium text-base rounded-lg bg-white px-2 absolute text-gray-500 duration-300 transform -translate-y-6 scale-75 top-2.5 z-10 origin-[0] left-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >Paraf Anggota</label
              >
            </div>
          </div>
          <div class="col-span-9 flex max-h-[600px]">
            <div class="flex-grow overflow-auto pr-2">
              <div class="grid grid-cols-2 gap-4">
                <div class="relative z-0 w-full mb-5 mt-2 group">
                  <input
                    type="text"
                    name="tanggal"
                    id="tanggal"
                    class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    v-model="tanggal"
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
                    v-model="no_anggota"
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
                    v-model="no_ktp"
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
                    v-model="no_kk"
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
                  v-model="nama_lengkap"
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
                    v-model="tempat_lahir"
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
                    type="date"
                    name="tanggal_lahir"
                    id="tanggal_lahir"
                    class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    v-model="tanggal_lahir"
                    required
                  />
                  <label
                    for="tanggal_lahir"
                    class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >Tanggal Lahir</label
                  >
                </div>
              </div>
              <div class="grid grid-cols-2 gap-6">
                <div class="relative z-0 w-full mb-6 group">
                  <select
                    name="jenis_kelamin"
                    id="jenis_kelamin"
                    class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    v-model="jenis_kelamin"
                    required
                  >
                    <option class="text-xs" value="" disabled>Pilihlah Salah Satu</option>
                    <option v-for="jenis in list_jenis_kelamin" :value="jenis.value">
                      {{ jenis.nama }}
                    </option>
                  </select>
                  <label
                    for="jenis_kelamin"
                    class="peer-focus:font-medium rounded-lg bg-white px-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3.5 peer-focus:top-2.5 z-10 origin-[0] left-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                    >Jenis Kelamin</label
                  >
                </div>
                <div class="relative z-0 w-full mb-6 group">
                  <select
                    name="agama"
                    id="agama"
                    class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    v-model="agama"
                    required
                  >
                    <option class="text-xs" value="" disabled>Pilihlah Salah Satu</option>
                    <option v-for="agama in list_agama" :value="agama.value">
                      {{ agama.nama }}
                    </option>
                  </select>
                  <label
                    for="agama"
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
                  v-model="alamat"
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
                    v-model="rt"
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
                    v-model="rw"
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
                    v-model="kelurahan"
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
                    v-model="kecamatan"
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
                    v-model="kota"
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
                    v-model="pendamping"
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
                    v-model="pekerjaan"
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
                    name="telepon"
                    id="telepon"
                    class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    v-model="no_telepon"
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
                    name="resort"
                    id="resort"
                    class="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-2 rounded-md border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                    placeholder=" "
                    v-model="resort"
                    required
                  >
                    <option class="text-xs" value="" disabled>Pilihlah Salah Satu</option>
                    <option v-for="resort in list_resort" :value="resort.value">
                      {{ resort.nama }}
                    </option>
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
                    v-model="tanggal_bht"
                    disabled
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
                    v-model="simpanan_pokok"
                    disabled
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
                    v-model="simpanan_swk"
                    disabled
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
                    v-model="simpanan_wajib"
                    disabled
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
                    v-model="simpanan_lain"
                    disabled
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
                    v-model="total_simpanan"
                    disabled
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
      </div>
    </ModalBody>
    <ModalFooter class="text-right">
      <button type="button" class="btn btn-outline-secondary w-32 mr-1" @click="resetForm">
        Cancel
      </button>
      <button v-if="!isView" type="submit" form="daftarAnggotaForm" class="btn btn-primary w-32">
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
