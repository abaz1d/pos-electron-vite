<script setup>
import { RouterLink } from 'vue-router'
import LOGO from '@renderer/assets/icons.svg'
import { ref } from 'vue'
const props = defineProps({
  title: String
})
const listMenu = {
  setting: ref(),
  transaksi: ref(),
  laporan: ref(),
  proses: ref(),
  utility: ref()
}
const openMenu = (e) => {
  var menu = listMenu[e]?.value

  let title = menu.getElementsByTagName('a')[0]
  let svg = menu.getElementsByTagName('svg')[0]
  let child = menu.getElementsByTagName('ul')[0]
  title.classList.add('text-primary')
  title.classList.add('bg-slate-200')
  svg.classList.add('-rotate-180')
  child.classList.remove('scale-0')
  child.classList.add('scale-100')
}
const closeMenu = (e) => {
  setTimeout(() => {
    var menu = listMenu[e]?.value

    let title = menu.getElementsByTagName('a')[0]
    let svg = menu.getElementsByTagName('svg')[0]
    let child = menu.getElementsByTagName('ul')[0]
    title.classList.remove('text-primary')
    title.classList.remove('bg-slate-200')
    svg.classList.remove('-rotate-180')
    child.classList.add('scale-0')
    child.classList.remove('scale-100')
  }, 500)
}
defineExpose({ openMenu, closeMenu })
</script>

<template>
  <nav
    class="bg-slate-50 h-12 px-2 sm:px-4 py-2.5 dark:bg-gray-900 sticky w-full z-50 top-0 left-0 border-b border-gray-200 dark:border-gray-600"
  >
    <div class="container flex flex-wrap items-center justify-between -mt-2 mx-auto">
      <a
        href="javascript:void(0);"
        class="items-center hover:scale-125 transition duration-700 ease-in-out hidden xl:flex"
      >
        <img :src="LOGO" alt="logo" class="h-4 mr-3 sm:h-7" />
        <span
          class="self-center text-base font-bold tracking-wide font-mono whitespace-nowrap dark:text-white"
          >Binaniaga</span
        >
      </a>
      <div class="flex md:order-2 mt-[6px]">
        <Dropdown class="intro-x w-8 h-8">
          <DropdownToggle
            tag="div"
            role="button"
            aria-label="user"
            class="w-7 h-7 bg-[#00913E] hover:bg-primary transition duration-500 ease-in-out p-auto rounded-full overflow-hidden shadow-lg image-fit zoom-in scale-110"
          >
            <UserIcon
              class="w-5 h-5 object-fill stroke-1 border-1 border-dark stroke-white fill-white bg-[#00913E] hover:bg-primary transition duration-500 ease-in-out mt-1 mx-auto rounded-full"
            />
          </DropdownToggle>
          <DropdownMenu class="w-56">
            <DropdownContent
              class="duration-700 absolute z-10 origin-top-right transform rounded-md border-2 bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-primary dark:bg-dark dark:shadow-slate-500 translate-y-0"
            >
              <DropdownHeader tag="div" class="!font-normal">
                <div class="text-sm font-medium">Nama User</div>
                <div class="text-xs text-black/70 mt-0.5 dark:text-slate-500">Nama Lembaga</div>
              </DropdownHeader>
              <DropdownDivider class="border-slate-200" />
              <DropdownItem class="hover:bg-slate-200 text-sm">
                <InfoIcon class="w-4 h-4 mr-2" />
                Profil User & Lembaga
              </DropdownItem>
              <RouterLink to="/semua-akun">
                <DropdownItem class="hover:bg-slate-200 text-sm">
                  <UsersIcon class="w-4 h-4 mr-2" />Pengaturan Semua Akun
                </DropdownItem>
              </RouterLink>
              <DropdownItem class="hover:bg-slate-200 text-sm">
                <HelpCircleIcon class="w-4 h-4 mr-2 inline-block" /> Bantuan
              </DropdownItem>
              <DropdownDivider class="border-slate-200" />
              <DropdownItem
                class="hover:bg-slate-300 text-sm bg-danger justify-center text-white hover:text-danger"
              >
                <LogOutIcon class="w-4 h-4 mr-2" />
                Logout
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
      </div>
      <div
        class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 h-10"
        id="navbar-sticky"
      >
        <ul
          class="h-12 navbar-nav justify-center flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-slate-50 md:flex-row md:space-x-3 md:mt-0 md:text-sm md:font-medium md:border-0"
        >
          <li>
            <RouterLink to="/">
              <a
                href="javascript:void(0);"
                class="rounded text-sm hover:text-primary hover:bg-slate-200 p-2 -mt-3"
                :class="props.title == 'home' ? 'bg-slate-200' : 'bg-transparent'"
                aria-current="page"
                >Home</a
              >
            </RouterLink>
          </li>
          <li :ref="listMenu.setting">
            <!-- component -->
            <div class="group mx-2">
              <a
                href="javascript:void(0);"
                class="rounded text-sm bg-transparent hover:text-primary flex items-center hover:bg-slate-200 p-2 -m-2"
                aria-current="page"
                >Setting
                <ChevronDownIcon
                  class="ml-1 h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out stroke-[2.5px]"
                />
              </a>
              <ul
                class="shadow-lg space-y-1 p-2 ring-1 py-2 ring-opacity-5 focus:outline-none bg-white mt-2 border rounded transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-max"
              >
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Pinjaman
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/produk-pinjaman">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Produk Pinjaman</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/cara-hitung-pinjaman">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Cara Hitung Pinjaman</a
                        >
                      </RouterLink>
                    </li>
                    <li
                      class="px-2 hover:bg-slate-200 pb-1 rounded cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <span class="rounded text-sm bg-transparent text-secondary p-2 -mt-3"
                        >Jenis Pengunaan</span
                      >
                    </li>
                    <li
                      class="px-2 hover:bg-slate-200 pb-1 rounded cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <span class="rounded text-sm bg-transparent text-secondary p-2 -mt-3"
                        >Sektor Ekonomi</span
                      >
                    </li>
                    <li
                      class="px-2 hover:bg-slate-200 pb-1 rounded cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <span class="rounded text-sm bg-transparent text-secondary p-2 -mt-3"
                        >Sumber Pelunasan</span
                      >
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >SMB / Simpanan
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                      <a
                        class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                        href="javascript:void(0);"
                        >Produk Simpanan
                        <ChevronDownIcon
                          class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                      /></a>
                      <ul
                        class="shadow-lg space-y-1 ring-1 p-2 ring-[#00913E] ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                      >
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/produk-simpata">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Produk Simpata/ Tabungan</a
                            >
                          </RouterLink>
                        </li>
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/produk-simpanan-berjangka">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Produk Simpanan Berjangka</a
                            >
                          </RouterLink>
                        </li>
                        <li
                          class="px-2 hover:bg-slate-200 pb-1 rounded cursor-not-allowed"
                          aria-disabled="true"
                        >
                          <span class="rounded text-sm bg-transparent text-secondary p-2 -mt-3"
                            >Modal Penyertaan</span
                          >
                        </li>
                      </ul>
                    </li>
                    <li
                      class="px-2 hover:bg-slate-200 pb-1 rounded cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <span class="rounded text-sm bg-transparent text-secondary p-2 -mt-3"
                        >Cara Hitung Simpanan</span
                      >
                    </li>
                    <li
                      class="px-2 hover:bg-slate-200 pb-1 rounded cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <span class="rounded text-sm bg-transparent text-secondary p-2 -mt-3"
                        >Kelompok Simpanan</span
                      >
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/kode-perkiraan">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >kode Perkiraan</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Pengikatan
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/barang-bergerak">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Barang Bergerak</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/tanah-bangunan">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Tanah & Bangunan</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/jaminan-simpanan">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Jaminan Simpanan</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/jaminan-lain">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Jaminan Lain - Lain</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Lain - Lain
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/daftar-kolektor">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Daftar Kolektor</a
                        >
                      </RouterLink>
                    </li>
                    <li
                      class="px-2 hover:bg-slate-200 pb-1 rounded cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <span class="rounded text-sm bg-transparent text-secondary p-2 -mt-3"
                        >Daftar Resort</span
                      >
                    </li>
                    <li
                      class="px-2 hover:bg-slate-200 pb-1 rounded cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <span class="rounded text-sm bg-transparent text-secondary p-2 -mt-3"
                        >Daftar Notaris</span
                      >
                    </li>
                    <li
                      class="px-2 hover:bg-slate-200 pb-1 rounded cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <span class="rounded text-sm bg-transparent text-secondary p-2 -mt-3"
                        >Daftar Asuransi</span
                      >
                    </li>
                    <li
                      class="px-2 hover:bg-slate-200 pb-1 rounded cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <span class="rounded text-sm bg-transparent text-secondary p-2 -mt-3"
                        >Wilayah Pinjaman</span
                      >
                    </li>
                    <li
                      class="px-2 hover:bg-slate-200 pb-1 rounded cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <span class="rounded text-sm bg-transparent text-secondary p-2 -mt-3"
                        >Kode Kota</span
                      >
                    </li>
                    <li
                      class="px-2 hover:bg-slate-200 pb-1 rounded cursor-not-allowed"
                      aria-disabled="true"
                    >
                      <span class="rounded text-sm bg-transparent text-secondary p-2 -mt-3"
                        >Kode Marketing</span
                      >
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </li>
          <li :ref="listMenu.transaksi">
            <!-- component -->
            <div class="group mx-2">
              <a
                href="javascript:void(0);"
                class="rounded text-sm bg-transparent hover:text-primary flex items-center hover:bg-slate-200 p-2 -m-2"
                aria-current="page"
                >Transaksi
                <ChevronDownIcon
                  class="ml-1 h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out stroke-[2.5px]"
                />
              </a>
              <ul
                class="shadow-lg p-2 space-y-1 ring-1 py-2 ring-opacity-5 focus:outline-none bg-white mt-2 border rounded transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-max"
              >
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/transaksi-kas-nonkas">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Transaksi Kas dan Non Kas</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Pinjaman dan Pembiayaan
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/daftar-pinjaman-pembiyaan">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Daftar Pinjaman/ Pembiayaan</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/history-pinjaman">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Data History Pinjaman</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/debius-pinjaman">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Data Debius Pinjaman</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Keanggotaan
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/daftar-anggota-koperasi">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Daftar Anggota Koperasi</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/history-anggota-koperasi">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >History Anggota Koperasi</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Akuntansi
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/jurnal-transaksi">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Jurnal Transaksi</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/daftar-perkiraan-akuntansi">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Daftar Perkiraan Akuntansi</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/daftar-inventaris">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Daftar Inventaris</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/history-inventaris">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >History Inventaris</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/pembayaran-kolektor">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Pembayaran Kolektor</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Jaminan/ Agunan
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/agunan-bpkb">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Agunan BPKB</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/agunan-stpk">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Agunan STPK</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </li>
          <li :ref="listMenu.laporan">
            <!-- component -->
            <div class="group mx-2">
              <a
                href="javascript:void(0);"
                class="rounded text-sm bg-transparent hover:text-primary flex items-center hover:bg-slate-200 p-2 -m-2"
                aria-current="page"
                >Laporan
                <ChevronDownIcon
                  class="ml-1 h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out stroke-[2.5px]"
                />
              </a>
              <ul
                class="shadow-lg p-2 space-y-1 ring-1 py-2 ring-opacity-5 focus:outline-none bg-white mt-2 border rounded transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-max"
              >
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Keanggotaan
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/mutasi-simpanan-pokok">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Mutasi Simpanan Pokok</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/mutasi-simpanan-wajib">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Mutasi Simpanan Wajib</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/mutasi-simpanan-swk">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Mutasi Simpanan SWK</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/mutasi-simpanan-lain">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Mutasi Simpanan Lain - Lain</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/mutasi-simpanan-shu">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Mutasi Simpanan SHU</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/rician-shu">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Rician SHU</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/anggota-keluar">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Anggota Keluar</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/terima-shu">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Terima SHU</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/anggota-baru">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Anggota Baru</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/nominatif-simpanan-pokok">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nominatif Simpanan Pokok</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/nominatif-simpanan-wajib">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nominatif Simpanan Wajib</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/nominatif-simpanan-swk">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nominatif Simpanan SWK</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/nominatif-simpanan-lain">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nominatif Simpanan Lain - Lain</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/nominatif-simpanan-shu">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nominatif Simpanan SHU</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/nominatif-simpanan-Anggota">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nominatif Simpanan Anggota</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >SMB
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/pembukaan-rekening-baru-smb">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Pembukaan Rekening Baru</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/mutasi-smb">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Mutasi SMB</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/nominatif-smb">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nominatif SMB</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/penutupan-rekening-smb">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Penutupan Rekening</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/rekap-buku-besar">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Rekap Buku Besar</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                      <a
                        class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                        href="javascript:void(0);"
                        >SMB Tiap Resort
                        <ChevronDownIcon
                          class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                      /></a>
                      <ul
                        class="shadow-lg space-y-1 ring-1 p-2 ring-[#00913E] ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                      >
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/daftar-mutasi-pengambilan-simpanan">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Daftar Mutasi Pengambilan Simpanan</a
                            >
                          </RouterLink>
                        </li>
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/laporan-smb-resort">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Laporan SMB Tiap Resort</a
                            >
                          </RouterLink>
                        </li>
                      </ul>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/mutasi-saldo">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Mutasi Saldo</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/pengambilan-smb">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Pengambilan SMB</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Pinjaman
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-realisasi-pinjaman">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Realisasi Pinjaman</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-penerimaan-angsuran">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Penerimaan Angsuran</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-nominatif-pinjaman">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nominatif Pinjaman</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-pelunasan-pinjaman">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Pelunasan Pinjaman</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                      <a
                        class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                        href="javascript:void(0);"
                        >Tentang Agunan
                        <ChevronDownIcon
                          class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                      /></a>
                      <ul
                        class="shadow-lg space-y-1 ring-1 p-2 ring-[#00913E] ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                      >
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/laporan-agunan-masuk">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Agunan Masuk</a
                            >
                          </RouterLink>
                        </li>
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/laporan-agunan-keluar">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Agunan Keluar</a
                            >
                          </RouterLink>
                        </li>
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/laporan-saldo-agunan">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Saldo Agunan</a
                            >
                          </RouterLink>
                        </li>
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/laporan-jaminan-kosong">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Jaminan Kosong</a
                            >
                          </RouterLink>
                        </li>
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/laporan-jaminan-belum-diambil">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Jaminan Belum Diambil</a
                            >
                          </RouterLink>
                        </li>
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/laporan-agunan-titipan-masuk">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Agunan Titipan Masuk</a
                            >
                          </RouterLink>
                        </li>
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/laporan-agunan-titipan-keluar">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Agunan Titipan Keluar</a
                            >
                          </RouterLink>
                        </li>
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/laporan-saldo-agunan-titipan">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Saldo Agunan Titipan</a
                            >
                          </RouterLink>
                        </li>
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/laporan-rekap-agunan-harian">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Rekap Agunan Harian</a
                            >
                          </RouterLink>
                        </li>
                      </ul>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-tunggakan-angsuran">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Tunggakan Angsuran</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-angsuran-menurut-realisasi">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Angsuran Menurut Realisasi</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-pinjaman-belum-cair">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Pinjaman Belum Cair</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                      <a
                        class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                        href="javascript:void(0);"
                        >Non Performing Loan (NPL)
                        <ChevronDownIcon
                          class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                      /></a>
                      <ul
                        class="shadow-lg space-y-1 ring-1 p-2 ring-[#00913E] ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 -right-[1px] transition duration-150 ease-in-out origin-top-left min-w-max"
                      >
                        <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                          <RouterLink to="/rekapitulasi-npl">
                            <a
                              class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                              href="javascript:void(0);"
                              >Rekapitulasi NPL</a
                            >
                          </RouterLink>
                        </li>
                      </ul>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-nasabah-turun-bunga">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nasabah Turun Bunga</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-pinjaman-debius">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Pinjaman Debius</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-penerimaan-angsuran-debius">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Penerimaan Angsuran Debius</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-nominatif-pinjaman-debius">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nominatif Pinjaman Debius</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-pelunasan-pinjaman-debius">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Pelunasan Pinjaman Debius</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-nominatif-pinjaman-2">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nominatif Pinjaman 2</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-nominatif-pinjaman-3">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nominatif Pinjaman 3</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-kurang-lebih-jasa-lunas">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Kurang Lebih Jasa Lunas</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Kasir
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/penerimaan-kas">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Penerimaan Kas</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/mutasi-non-kas">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Mutasi Non Kas</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/rician-uang-kas">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Rician Uang Kas</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Akuntansi
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-neraca">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Neraca</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-laba-rugi">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Laba Rugi</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-neraca-perbandingan">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Neraca Perbandingan</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-laba-rugi-perbandingan">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Laba Rugi Perbandingan</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-neraca-harian">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Neraca Harian</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-laba-rugi-harian">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Laba Rugi Harian</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-rician-transaksi">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Rician Transaksi</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-rekap-buku-besar">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Rekap Buku Besar</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/daftar-inventaris">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Daftar Inventaris</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/rician-aktiva">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Rician Aktiva</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/rician-pasiva">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Rician Pasiva</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/rician-pendapatan">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Rician Pendapatan</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/rician-biaya">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Rician Biaya</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/cetak-jurnal-transaksi">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Cetak Jurnal Transaksi</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/cetak-neraca-laba-rugi">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Cetak Neraca & Laba/ Rugi</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-rekap-transaksi">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Rekap Transaksi</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Kolektor
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/daftar-tagihan-instansi">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Daftar Tagihan Instansi</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-rekap-transaksi">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Laporan Rekap Transaksi</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/laporan-daftar-transaksi">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Laporan Daftar Transaksi</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >SIMPATA
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/pembukaan-rekening-baru-simpata">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Pembukaan Rekening Baru</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/mutasi-simpata">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Mutasi SIMPATA</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/nominatif-simpata">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nominatif SIMPATA</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/penutupan-rekening-simpata">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Penutupan Rekening</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/simpata-keluar">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >SIMPATA Keluar</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/rbb-simpata">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >RBB SIMPATA</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/pengambilan-simpata">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Pengambilan SIMPATA</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >SMA
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-0 transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/pembukaan-rekening-baru-sma">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Pembukaan Rekening Baru</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/mutasi-sma">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Mutasi SMA</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/nominatif-sma">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Nominatif SMA</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/penutupan-rekening-sma">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Penutupan Rekening</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/sma-keluar">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >SMA Keluar</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/rbb-sma">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >RBB SMA</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/pengambilan-sma">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Pengambilan SMA</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </li>
          <li :ref="listMenu.proses">
            <!-- component -->
            <div class="group mx-2">
              <a
                href="javascript:void(0);"
                class="rounded text-sm bg-transparent hover:text-primary flex items-center hover:bg-slate-200 p-2 -m-2"
                aria-current="page"
                >Proses
                <ChevronDownIcon
                  class="ml-1 h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out stroke-[2.5px]"
                />
              </a>
              <ul
                class="shadow-lg p-2 space-y-1 ring-1 py-2 ring-opacity-5 focus:outline-none bg-white mt-2 border rounded transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-max"
              >
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/proses-harian">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Harian</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/proses-hitung-perbagian">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Hitung Perbagian</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/proses-perubahan-ketentuan">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Perubahan Ketentuan</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/proses-hitung-ulang-saldo-smb-simpata-sma">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Hitung Ulang Saldo SMB, SIMPATA, SMA</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/proses-hitung-ulang-simpanan-anggota">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Hitung Ulang Simpanan Anggota</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/proses-hitung-ulang-saldo-pinjaman">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Hitung Ulang Saldo Pinjaman</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/proses-hitung-ulang-saldo-inventaris">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Hitung Ulang Saldo Inventaris</a
                    >
                  </RouterLink>
                </li>
                <hr />
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/acc-pengeluaran">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >ACC Pengeluaran</a
                    >
                  </RouterLink>
                </li>
                <hr />
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/verifikasi-proses-harian">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Verifikasi Proses Harian</a
                    >
                  </RouterLink>
                </li>
                <hr />
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/proses-tutup-buku">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Tutup Buku</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/batal-proses-tutup-buku">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Batal Tutup Buku</a
                    >
                  </RouterLink>
                </li>
                <hr />
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/proses-perhitungan-shu">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Perhitungan SHU</a
                    >
                  </RouterLink>
                </li>
              </ul>
            </div>
          </li>
          <li :ref="listMenu.utility">
            <!-- component -->
            <div class="group mx-2">
              <a
                href="javascript:void(0);"
                class="rounded text-sm bg-transparent hover:text-primary flex items-center hover:bg-slate-200 p-2 -m-2"
                aria-current="page"
                >Utility
                <ChevronDownIcon
                  class="ml-1 h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out stroke-[2.5px]"
                />
              </a>
              <ul
                class="shadow-lg p-2 space-y-1 ring-1 py-2 ring-opacity-5 focus:outline-none bg-white mt-2 border rounded transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-max"
              >
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/pembatasan-tanggal">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Pembatasan Tanggal</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Setting Laporan
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-[395px] transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/setting-laporan">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Setting Laporan/ Cetakan</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/setting-posisi-laporan">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Setting Posisi Cetakan</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/sms-gateway">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Sms GateWay</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/cek-transaksi">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Cek Transaksi</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Perbaikan
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-[355px] transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/transaksi-simpanan">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Transaksi Simpanan</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/mutasi-anggota">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Mutasi Anggota</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/mutasi-pinjaman">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Mutasi pinjaman</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 relative rounded">
                  <a
                    class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                    href="javascript:void(0);"
                    >Pengaturan Lainya
                    <ChevronDownIcon
                      class="sub-menu inline h-4 w-4 transition duration-150 ease-in-out stroke-[2.5px]"
                  /></a>
                  <ul
                    class="shadow-lg space-y-1 ring-1 p-2 ring-black ring-opacity-50 focus:outline-none bg-white border rounded absolute transform top-0 right-[395px] transition duration-150 ease-in-out origin-top-left min-w-max"
                  >
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/setting-laporan">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Setting Laporan/ Cetakan</a
                        >
                      </RouterLink>
                    </li>
                    <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                      <RouterLink to="/setting-posisi-laporan">
                        <a
                          class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                          href="javascript:void(0);"
                          >Setting Posisi Cetakan</a
                        >
                      </RouterLink>
                    </li>
                  </ul>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/setting-default-printer">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Setting Default Printer</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/perbaikan-data">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Perbaikan Data</a
                    >
                  </RouterLink>
                </li>
                <hr />
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/backup-database">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Backup Database</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/restore-database">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Restore Database</a
                    >
                  </RouterLink>
                </li>
                <hr />
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/migrasi-data">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Migrasi Data</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/migrasi-inventaris">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Migrasi Inventaris</a
                    >
                  </RouterLink>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <!-- component -->
            <div class="group mx-2">
              <a
                href="javascript:void(0);"
                class="rounded text-sm bg-transparent hover:text-primary flex items-center hover:bg-slate-200 p-2 -m-2"
                aria-current="page"
                >About
                <ChevronDownIcon
                  class="ml-1 h-4 w-4 transform group-hover:-rotate-180 transition duration-150 ease-in-out stroke-[2.5px]"
                />
              </a>
              <ul
                class="shadow-lg p-2 space-y-1 ring-1 py-2 ring-opacity-5 focus:outline-none bg-white mt-2 border rounded transform scale-0 group-hover:scale-100 absolute transition duration-150 ease-in-out origin-top min-w-max"
              >
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/tentang-aplikasi">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Tentang Aplikasi</a
                    >
                  </RouterLink>
                </li>
                <li class="px-2 hover:bg-slate-200 pb-1 rounded">
                  <RouterLink to="/registrasi-aplikasi">
                    <a
                      class="rounded text-sm bg-transparent hover:text-primary p-2 -mt-3"
                      href="javascript:void(0);"
                      >Registrasi Aplikasi</a
                    >
                  </RouterLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
li > ul {
  transform: translatex(100%) scale(0);
}
li:hover > ul {
  transform: translatex(101%) scale(1);
}
li > a .sub-menu {
  transform: rotate(-90deg);
}
li:hover > a .sub-menu {
  transform: rotate(-270deg);
}
.group:hover .group-hover\:scale-100 {
  transform: scale(1);
}
.group:hover .group-hover\:-rotate-180 {
  transform: rotate(180deg);
}
.scale-0 {
  transform: scale(0);
}
</style>
