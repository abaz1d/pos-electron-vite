import { useAuthStore } from '@renderer/stores/auth'
import { createRouter, createWebHashHistory } from 'vue-router'
import Swal from 'sweetalert2'
import HomeView from '@renderer/views/HomeView.vue'
import Auth from '@renderer/views/Auth.vue'
//Settings
import ProdukPinjaman from '@renderer/views/SettingView/Pinjaman/ProdukPinjaman/ProdukPinjaman.vue'
import CaraHitungPinjaman from '@renderer/views/SettingView/Pinjaman/CaraHitungPinjaman/CaraHitungPinjaman.vue'
//Transaksi
import DaftarAnggota from '@renderer/views/TransaksiView/Keanggotaan/DaftarAnggota/DaftarAnggota.vue'
import HistoryAnggota from '@renderer/views/TransaksiView/Keanggotaan/HistoryAnggota/HistoryAnggota.vue'
import JurnalTransaksi from '@renderer/views/TransaksiView/Akuntansi/JurnalTransaksi/JurnalTransaksi.vue'
import PerkiraanAkuntansi from '@renderer/views/TransaksiView/Akuntansi/PerkiraanAkuntansi/PerkiraanAkuntansi.vue'
//Laporan
import PrintDaftarAnggota from '@renderer/views/LaporanView/Keanggotaan/DaftarAnggota/PrintDaftarAnggota.vue'
//Proses
import ProsesHarian from '@renderer/views/ProsesView/Harian/ProsesHarian.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { authorize: [] }
  },
  //Settings
  {
    path: '/produk-pinjaman',
    name: 'produk-pinjaman',
    component: ProdukPinjaman,
    meta: { authorize: [] }
  },
  {
    path: '/cara-hitung-pinjaman',
    name: 'cara-hitung-pinjaman',
    component: CaraHitungPinjaman,
    meta: { authorize: [] }
  },
  //Transaksi
  {
    path: '/daftar-anggota-koperasi',
    name: 'daftar-anggota-koperasi',
    component: DaftarAnggota,
    meta: { authorize: [] }
  },
  {
    path: '/history-anggota-koperasi',
    name: 'history-anggota-koperasi',
    component: HistoryAnggota,
    meta: { authorize: [] }
  },
  {
    path: '/jurnal-transaksi',
    name: 'jurnal-transaksi',
    component: JurnalTransaksi,
    meta: { authorize: [] }
  },
  {
    path: '/daftar-perkiraan-akuntansi',
    name: 'daftar-perkiraan-akuntansi',
    component: PerkiraanAkuntansi,
    meta: { authorize: [] }
  },
  //Laporan
  {
    path: '/laporan-daftar-anggota',
    name: 'laporan-daftar-anggota',
    component: PrintDaftarAnggota,
    meta: { authorize: [] }
  },
  //Proses
  {
    path: '/proses-harian',
    name: 'proses-harian',
    component: ProsesHarian,
    meta: { authorize: [] }
  },
  {
    path: '/auth',
    name: 'auth',
    component: Auth
  },
  {
    path: '/tentang-aplikasi',
    name: 'tentang-aplikasi',
    component: () => import('../views/AboutView/AboutAplikasi.vue'),
    meta: { authorize: [] }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const { authorize } = to.meta
  const publicPages = ['/auth']
  const authRequired = !publicPages.includes(to.path)
  const auth = useAuthStore()
  const currentUser = auth.items
  if (authorize) {
    //console.log('authorize', currentUser, from)
    if (
      (authRequired && !auth.user) ||
      (authRequired && currentUser.token == null && from.name !== 'auth')
    ) {
      auth.returnUrl = to.fullPath
      return next({ path: '/auth' })
    }
    if (authorize.length && !authorize.includes(currentUser.role)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Role Akun Anda, Tidak Bisa Mengakses Halaman ini !'
      }).then((data) => {
        return next({ path: '/' })
      })
    }
  }
  next()
})

export default router
