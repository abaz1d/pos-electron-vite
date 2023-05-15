<script setup>
import { RouterView } from 'vue-router'
import NavbarView from '@renderer/components/Navbar/NavbarView.vue'
</script>

<template>
  <NavbarView v-if="$route.name !== 'home' && $route.name !== 'auth'" />
  <RouterView />
</template>
