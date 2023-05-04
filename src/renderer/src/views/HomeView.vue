<script setup>
import { ref } from 'vue'
import NavbarView from '@renderer/components/Navbar/NavbarView.vue'
const navbarRef = ref()
const openMenu = (e) => {
  navbarRef.value.openMenu(e)
}

const closeMenu = (e) => {
  navbarRef.value.closeMenu(e)
}
</script>

<template class="main-class">
  <NavbarView ref="navbarRef" title="home" />
  <div class="container my-auto flex h-[90vh]">
    <div
      class="grid m-auto p-10 overflow-hidden grid-rows-3 grid-flow-col gap-8 h-[575px] w-[1100px]"
    >
      <div
        @click="openMenu('setting')"
        @mouseleave="closeMenu('setting')"
        class="col-span-1 transition duration-500 ease-in-out hover:scale-105 bg-white hover:bg-blue-300 backdrop-blur-[2px] bg-no-repeat bg-center border-[9px] border-primary rounded-lg cursor-pointer"
      >
        <span
          class="relative -top-5 text-center items-center left-3 text-sm tracking-widest font-bold px-2 py-1 rounded-lg bg-white border-[5px] border-primary"
          >Setting</span
        >
        <div
          class="transition duration-700 ease-in-out -mt-6 bg-[url('@renderer/assets/images/menu/setting.svg')] bg-[length:65px_65px] bg-no-repeat bg-center min-h-full hover:scale-125"
        ></div>
      </div>
      <div
        @click="openMenu('transaksi')"
        @mouseleave="closeMenu('transaksi')"
        class="row-span-2 transition duration-500 ease-in-out hover:scale-105 col-span-1 bg-white hover:bg-blue-300 backdrop-blur-[2px] border-[9px] border-primary rounded-lg cursor-pointer"
      >
        <span
          class="relative -top-5 text-center items-center left-3 text-sm tracking-widest font-bold px-2 py-1 rounded-lg bg-white border-[5px] border-primary"
          >Transaksi</span
        >
        <div
          class="transition duration-700 ease-in-out -mt-6 bg-[url('@renderer/assets/images/menu/transaksi.svg')] bg-[length:85px_85px] bg-no-repeat bg-center min-h-full hover:scale-125"
        ></div>
      </div>
      <div
        @click="openMenu('proses')"
        @mouseleave="closeMenu('proses')"
        class="row-span-2 transition duration-500 ease-in-out hover:scale-105 col-span-1 bg-white hover:bg-blue-300 backdrop-blur-[2px] border-[9px] border-primary rounded-lg cursor-pointer"
      >
        <span
          class="relative -top-5 text-center items-center left-3 text-sm tracking-widest font-bold px-2 py-1 rounded-lg bg-white border-[5px] border-primary"
          >Proses</span
        >
        <div
          class="transition duration-700 ease-in-out -mt-6 bg-[url('@renderer/assets/images/menu/proses.svg')] bg-[length:85px_85px] bg-no-repeat bg-center min-h-full hover:scale-125"
        ></div>
      </div>
      <div
        @click="openMenu('utility')"
        @mouseleave="closeMenu('utility')"
        class="col-span-1 transition duration-500 ease-in-out hover:scale-105 bg-white hover:bg-blue-300 backdrop-blur-[2px] border-[9px] border-primary rounded-lg cursor-pointer"
      >
        <span
          class="relative -top-5 text-center items-center left-3 text-sm tracking-widest font-bold px-2 py-1 rounded-lg bg-white border-[5px] border-primary"
          >Utility</span
        >
        <div
          class="transition duration-700 ease-in-out -mt-6 bg-[url('@renderer/assets/images/menu/utility.svg')] bg-[length:65px_65px] bg-no-repeat bg-center min-h-full hover:scale-125"
        ></div>
      </div>
      <div
        @click="openMenu('laporan')"
        @mouseleave="closeMenu('laporan')"
        class="row-span-3 transition duration-500 ease-in-out hover:scale-105 bg-white hover:bg-blue-300 backdrop-blur-[2px] border-[9px] border-primary rounded-lg cursor-pointer"
      >
        <span
          class="relative -top-5 text-center items-center left-3 text-sm tracking-widest font-bold px-2 py-1 rounded-lg bg-white border-[5px] border-primary"
          >Laporan</span
        >
        <div
          class="transition duration-700 ease-in-out -mt-6 bg-[url('@renderer/assets/images/menu/laporan.svg')] bg-[length:100px_100px] bg-no-repeat bg-center min-h-full hover:scale-125"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.main-class {
  scroll-behavior: smooth;
}
::-webkit-scrollbar {
  display: none;
}
</style>
