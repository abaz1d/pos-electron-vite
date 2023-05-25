<script setup>
import { useDaftarAnggotaStore } from '@renderer/stores/daftarAnggota.js'
import Breadcrumbs from '@renderer/components/Breadcrumbs/Breadcrumbs.vue'
import PROSES from '@renderer/assets/images/menu/proses.svg'
import { onMounted, ref, inject } from 'vue'
import { list_resort, list_kantor } from '@renderer/utils/json'
import { useRouter } from 'vue-router'
import moment from 'moment'

const swal = inject('$swal')
const daftarAnggota = useDaftarAnggotaStore()
const router = useRouter()
const modal_utama = ref(false)
const isLoading = ref(false)
const limit = ref(100)
const kantor = ref('0001')
const tanggal = ref(moment(Date.now()).format('YYYY-MM-DD'))
const resort = ref('resort')
const tableRef = ref()
const tabulator = ref()

// const initTabulator = () => {
//   tabulator.value = new Tabulator(tableRef.value, {
//     data: daftarAnggota.items,
//     printHeader: `<div class="h-full w-full mx-auto">
//     <div class="border border-black flex">
//       <div class="w-3/12 border-black flex justify-center items-center py-1">
//         <img src=${LOGO} alt="logo" class="m-auto h-16" />
//       </div>
//       <div class="w-9/12 border-black text-center align-middle">
//         <span class="uppercase text-md font-bold -mb-1">koperasi simpan pinjam bina niaga</span>
//         <p class="text-xs mb-1 font-medium">
//           Jl. Diponegoro 134, Pati, Jawa Tengah - Indonesia
//         </p>
//         <p class="text-xs mb-1 font-medium">
//           Telp. (6221) 225 66288, (+6221) 226 08887 Fax: (+6221) 225 66399
//         </p>
//         <p class="text-xs mb-1 font-medium">
//           Website: hubud.dephub.go.id; e-mail: daao_dgca@dephub.go.id
//         </p>
//       </div>
//     </div>
//     <p class="w-full text-sm font-bold text-center border-b border-x border-black p-1">
//       DAFTAR ANGGOTA KOPERASI
//     </p>
//     <div class="flex border-x border-black text-sm">
//       <div class="w-6/12 border-b border-black p-1">Resort: all</div>
//       <div class="w-6/12 border-b border-l border-black p-1">Date of Inspection: ${moment(
//         tanggal.value
//       ).format('DD MMM YYYY')}</div>
//     </div>`,
//     printFooter: `<h2 class='p-2 m-2 text-center text-xs mt-4'>${moment(Date.now()).format(
//       'DD-MMM-YYYY HH:SS'
//     )}<h2>`,
//     printAsHtml: true,
//     printStyled: true,
//     layout: 'fitColumns',
//     responsiveLayout: 'collapse',
//     placeholder: 'Tida ada Data di temukan',
//     columns: [
//       // For print format
//       {
//         title: 'ID',
//         field: 'iddata',
//         width: 75,
//         visible: true,
//         print: true,
//         download: true
//       },
//       {
//         title: 'NO. ANGG',
//         field: 'cif',
//         width: 150,
//         visible: true,
//         print: true,
//         download: true
//       },
//       {
//         title: 'TANGGAL',
//         field: 'tanggal',
//         width: 150,
//         vertAlign: 'middle',
//         hozAlign: 'center',
//         visible: true,
//         print: true,
//         download: true,
//         formatter(cell) {
//           return `<div>
//                 ${moment(cell.getData().tanggal).format('DD-MM-YYYY')}
//               </div>`
//         }
//       },
//       {
//         title: 'RESORT',
//         field: 'resort',
//         visible: true,
//         print: true,
//         width: 100,
//         vertAlign: 'middle',
//         hozAlign: 'center',
//         download: true
//       },
//       {
//         title: 'NAMA NASABAH',
//         field: 'nama',
//         visible: true,
//         print: true,
//         download: true
//       },
//       {
//         title: 'ALAMAT',
//         field: 'alamat',
//         visible: true,
//         print: true,
//         download: true
//       }
//     ]
//   })
// }

const printData = async (e) => {
  try {
    modal_utama.value = false
    isLoading.value = true
    const data = await daftarAnggota.readLaporan(
      kantor.value,
      tanggal.value,
      resort.value,
      limit.value
    )
    initTabulator()
    reInitOnResizeWindow()
    setTimeout(() => {
      tabulator.value.print()
    }, 1000)
    isLoading.value = false
    modal_utama.value = true
  } catch (error) {
    isLoading.value = false
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'ERROR PRINT: ' + error
    })
  }
}
const exportCSV = async (e) => {
  try {
    modal_utama.value = false
    isLoading.value = true
    const data = await daftarAnggota.readLaporan(
      kantor.value,
      tanggal.value,
      resort.value,
      limit.value
    )
    initTabulator()
    reInitOnResizeWindow()
    setTimeout(() => {
      tabulator.value.download('csv', 'data.csv')
    }, 1000)
    isLoading.value = false
    modal_utama.value = true
  } catch (error) {
    isLoading.value = false
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'ERROR CSV: ' + error
    })
  }
}

const reInitOnResizeWindow = () => {
  window.addEventListener('resize', () => {
    tabulator.value.redraw()
    // createIcons({
    //   icons,
    //   "stroke-width": 1.5,
    //   nameAttr: "data-lucide",
    // });
  })
}

onMounted(async () => {
  try {
    //initTabulator()
    reInitOnResizeWindow()
  } catch (error) {
    console.error(error)
    swal({
      icon: 'error',
      title: 'Oops...',
      text: 'ERROR MOUNTED: ' + error
    })
    isLoading.value = false
  }
})
</script>
<template>
  <Breadcrumbs title="Laporan" subTitle="Keanggotaan" :icon="PROSES" />
  <div class="p-5">
    <h2 class="font-bold uppercase text-base border rounded-t py-2 text-center">Proses Harian</h2>
    <form method="post">
      <div class="bg-slate-200 rounded-t pt-1">
        <div class="text-gray-700 flex items-center mx-auto w-1/3">
          <div class="mb-1 w-2/5 text-xs">
            <label>Tanggal Proses</label>
          </div>
          <span class="mr-3 pb-2">:</span>
          <div class="w-3/5 flex-grow">
            <input
              class="w-full h-10 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
              type="date"
              v-model="tanggal"
              required
            />
          </div>
        </div>
      </div>
      <div class="bg-slate-200">
        <div class="text-gray-700 flex items-center mx-auto w-1/3">
          <div class="mb-1 w-2/5 text-xs">
            <label>S/D.</label>
          </div>
          <span class="mr-3 pb-2">:</span>
          <div class="w-3/5 flex-grow">
            <input
              class="w-full h-10 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
              type="date"
              v-model="tanggal"
              required
            />
          </div>
        </div>
      </div>
      <div class="bg-slate-200 mt-1 py-2 flex justify-center pl-28">
        <div class="flex mx-auto w-full">
          <div class="text-gray-700 items-center w-1/5">
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">bunga simp (akrual)</label>
            </div>
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">perpanjangan aro</label>
            </div>
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">autodebet simp.</label>
            </div>
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">jasa simpanan</label>
            </div>
          </div>
          <div class="text-gray-700 items-center w-1/5">
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">bunga akrual pinjaman</label>
            </div>
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">amortisasi prov. (akrual)</label>
            </div>
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">amortisasi biaya (akrual)</label>
            </div>
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">Remember me</label>
            </div>
          </div>
          <div class="text-gray-700 items-center w-1/5">
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">proses laba/rugi</label>
            </div>
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">amortisasi biaya (akrual)</label>
            </div>
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">penyusutan inv.</label>
            </div>
          </div>
          <div class="text-gray-700 items-center w-1/5">
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">cek catatan</label>
            </div>
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">cek validasi</label>
            </div>
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">ulang tahun</label>
            </div>
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">jt. angsuran</label>
            </div>
          </div>
          <div class="text-gray-700 items-center w-1/5">
            <div class="flex items-start mb-2 ml-2">
              <div class="flex items-center h-5">
                <input
                  id="remember"
                  type="checkbox"
                  value=""
                  class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                  required
                />
              </div>
              <label for="remember" class="ml-2 text-sm uppercase">jt. pinjaman</label>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-slate-200 mt-1 p-1">
        <div class="text-center">
          <button type="button" class="btn bg-white btn-outline-secondary w-32 mr-5 text-sm">
            <XIcon class="mr-1" />Batal
          </button>
          <button class="btn btn-primary w-32 text-sm space-x-3">
            <CheckIcon class="mr-1" />Proses
          </button>
        </div>
      </div>
      <h2 class="font-semibold uppercase text-sm border rounded-b py-2 text-center">
        Data Yang diProses
      </h2>
      <div class="border h-56"></div>
    </form>
  </div>
  <Modal size="modal-xl" backdrop="static" :show="modal_utama" @hidden="modal_utama = false">
    <ModalHeader>
      <h2 class="font-bold uppercase text-base mx-auto">Laporan Daftar Anggota</h2>

      <a
        data-tw-dismiss="modal"
        @click="router.back()"
        href="javascript:;"
        class="border bg-danger rounded-lg hover:bg-red-700 -my-5 -mr-3"
      >
        <XIcon class="lucide lucide-x w-7 h-7 text-white hover:text-slate-100" />
      </a>
    </ModalHeader>
    <ModalBody class="">
      <div class="">
        <h2 class="font-bold uppercase text-base mx-auto">Laporan Daftar Anggota</h2>
        <form method="post">
          <div class="bg-slate-200 p-3 rounded">
            <div class="text-gray-700 flex items-center mx-auto w-9/12 mb-1">
              <div class="mb-1 w-2/5 text-xs">
                <label>Jumlah Data</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <select
                  name="data_list"
                  id="data_list"
                  v-model="limit"
                  class="w-full h-10 mb-1 px-0 text-xs border rounded focus:shadow-outline"
                  required
                >
                  <option value="100">100</option>
                  <option value="200">200</option>
                  <option value="300">300</option>
                  <option value="400">400</option>
                  <option value="500">500</option>
                  <option value="1000">1.000</option>
                  <option value="5000">5.000</option>
                  <option value="10000">10.000</option>
                  <option value="0">Semua Data</option>
                </select>
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-9/12 mb-1">
              <div class="mb-1 w-2/5 text-xs">
                <label>Kantor</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <select
                  name="perkiraan_list"
                  id="perkiraan_list"
                  v-model="kantor"
                  class="w-full h-10 mb-1 px-0 text-xs border rounded focus:shadow-outline"
                  required
                >
                  <option value="kantor" selected disabled>Pilih Kantor</option>
                  <option v-for="kantor in list_kantor" :value="kantor.value">
                    {{ kantor.nama }}
                  </option>
                </select>
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-9/12">
              <div class="mb-1 w-2/5 text-xs">
                <label>Tanggal</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <input
                  class="w-full h-10 mb-1 px-0.5 text-xs border rounded focus:shadow-outline"
                  type="date"
                  v-model="tanggal"
                  required
                />
              </div>
            </div>
            <div class="text-gray-700 flex items-center mx-auto w-9/12 mt-1">
              <div class="mb-1 w-2/5 text-xs">
                <label>Resort</label>
              </div>
              <span class="mr-3 pb-2">:</span>
              <div class="w-3/5 flex-grow">
                <select
                  name="resort_list"
                  id="resort_list"
                  v-model="resort"
                  class="w-full h-10 mb-1 px-0 text-xs border rounded focus:shadow-outline"
                  required
                >
                  <option value="resort" selected disabled>Pilih Resort</option>
                  <option v-for="resort in list_resort" :value="resort.value">
                    {{ resort.nama }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </form>
      </div>
    </ModalBody>
    <ModalFooter class="text-center">
      <button type="button" class="btn btn-outline-secondary w-32 mr-5 text-sm" @click="exportCSV">
        <ExternalLinkIcon class="mr-1" />Export CSV
      </button>
      <button @click="printData" class="btn btn-primary w-32 text-sm space-x-3">
        <PrinterIcon class="mr-1" />Print
      </button>
    </ModalFooter>
  </Modal>
  <div
    v-show="isLoading"
    class="fixed intleft-2 right-0 top-0 bottom-0 w-full h-[100vh] z-50 overflow-hidden bg-gray-500 opacity-75 flex flex-col items-center justify-center"
  >
    <Loader2Icon class="motion-safe:animate-spin stroke-[5px] text-white h-12 w-12 mb-2" />
    <h2 class="text-center text-white text-xl font-semibold">Loading...</h2>
    <p class="w-1/3 text-center text-white">Sedang Memuat Data</p>
    <p class="w-1/3 text-center text-white">
      Ini mungkin memakan waktu beberapa saat, tolong jangan tutup halaman ini.
    </p>
  </div>
</template>
<style scoped>
.page {
  width: 215mm;
  height: 330mm;
}
td,
th {
  border: 1px solid #000;
  text-align: left;
  padding: 1px;
}
@media print {
  .pagebreak {
    clear: both;
    page-break-after: always;
  }
}
</style>
