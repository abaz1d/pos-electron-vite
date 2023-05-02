import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '@renderer/views/HomeView.vue'
import DaftarAnggota from '@renderer/views/TransaksiView/Keanggotaan/DaftarAnggota/DaftarAnggota.vue'
import HistoryAnggota from '@renderer/views/TransaksiView/Keanggotaan/HistoryAnggota/HistoryAnggota.vue'
import JurnalTransaksi from '@renderer/views/TransaksiView/Akuntansi/JurnalTransaksi/JurnalTransaksi.vue'
import PerkiraanAkuntansi from '@renderer/views/TransaksiView/Akuntansi/PerkiraanAkuntansi/PerkiraanAkuntansi.vue'
import PrintDaftarAnggota from '@renderer/views/LaporanView/Keanggotaan/DaftarAnggota/PrintDaftarAnggota.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/daftar-anggota-koperasi',
    name: 'daftar-anggota-koperasi',
    component: DaftarAnggota
  },
  {
    path: '/history-anggota-koperasi',
    name: 'history-anggota-koperasi',
    component: HistoryAnggota
  },
  {
    path: '/jurnal-transaksi',
    name: 'jurnal-transaksi',
    component: JurnalTransaksi
  },
  {
    path: '/daftar-perkiraan-akuntansi',
    name: 'daftar-perkiraan-akuntansi',
    component: PerkiraanAkuntansi
  },
  {
    path: '/print-daftar-anggota',
    name: 'print-daftar-anggota',
    component: PrintDaftarAnggota
  },
  {
    path: '/tentang-aplikasi',
    name: 'tentang-aplikasi',
    component: () => import('../views/About/AboutAplikasi.vue')
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
  // const { authorize } = to.meta;
  // const publicPages = ["/login"];
  // const authRequired = !publicPages.includes(to.path);
  // const auth = useAuthStore();
  // const currentUser = auth.items;
  // if (authorize) {
  //   if (authRequired && !auth.user) {
  //     auth.returnUrl = to.fullPath;
  //     return next({ path: "/login" });
  //   }
  //   if (authorize.length && !authorize.includes(currentUser.role)) {
  //     alert("Role Akun Anda, Tidak Bisa Mengakses Halaman ini !");
  //     return next({ path: "/" });
  //   }
  // }
  next()
})

export default router
