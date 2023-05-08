import { useAuthStore } from '@renderer/stores/auth'
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@renderer/views/HomeView.vue'
import Auth from '@renderer/views/Auth.vue'
import ProdukPinjaman from '@renderer/views/SettingView/Pinjaman/ProdukPinjaman/ProdukPinjaman.vue'
import DaftarAnggota from '@renderer/views/TransaksiView/Keanggotaan/DaftarAnggota/DaftarAnggota.vue'
import HistoryAnggota from '@renderer/views/TransaksiView/Keanggotaan/HistoryAnggota/HistoryAnggota.vue'
import JurnalTransaksi from '@renderer/views/TransaksiView/Akuntansi/JurnalTransaksi/JurnalTransaksi.vue'
import PerkiraanAkuntansi from '@renderer/views/TransaksiView/Akuntansi/PerkiraanAkuntansi/PerkiraanAkuntansi.vue'
import PrintDaftarAnggota from '@renderer/views/LaporanView/Keanggotaan/DaftarAnggota/PrintDaftarAnggota.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { authorize: [] }
  },
  {
    path: '/produk-pinjaman',
    name: 'produk-pinjaman',
    component: ProdukPinjaman,
    meta: { authorize: [] }
  },
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
  {
    path: '/laporan-daftar-anggota',
    name: 'laporan-daftar-anggota',
    component: PrintDaftarAnggota,
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
    component: () => import('../views/About/AboutAplikasi.vue'),
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
      alert('Role Akun Anda, Tidak Bisa Mengakses Halaman ini !')
      return next({ path: '/' })
    }
  }
  next()
})

export default router
