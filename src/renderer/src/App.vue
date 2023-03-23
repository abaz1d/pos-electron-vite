<script setup>
import { RouterView } from 'vue-router'
import NavbarView from '@renderer/components/Navbar/NavbarView.vue'
</script>

<template class="main-class">
  <NavbarView v-if="$route.name !== 'home'" />
  <RouterView />
</template>

<style>
.main-class {
  scroll-behavior: smooth;
}
::-webkit-scrollbar {
  display: none;
}
</style>
