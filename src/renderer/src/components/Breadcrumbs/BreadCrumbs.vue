<script setup>
const props = defineProps({
  title: String,
  subTitle: String,
  icon: String
})
</script>
<template>
  <header class="mx-5 my-2 p-2 rounded-lg bg-slate-100">
    <h1 class="text-xs font-bold capitalize">{{ $route.name.replace(/-/gi, ' ') }}</h1>
    <nav class="relative -top-5 float-right" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <a
            href="javascript:void(0);"
            class="inline-flex items-center text-xs font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white"
          >
            <img :src="icon" alt="transaksi" class="w-4 h-4 mx-2" />
            {{ title }}
          </a>
        </li>
        <li>
          <div class="flex items-center">
            <ChevronRightIcon class="w-4 h-4 stroke-2 stroke-current text-gray-400" />
            <a
              href="javascript:void(0);"
              class="ml-1 text-xs font-medium text-gray-700 hover:text-blue-600 md:ml-2 dark:text-gray-400 dark:hover:text-white"
              >{{ subTitle }}</a
            >
          </div>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <ChevronRightIcon class="w-4 h-4 stroke-2 stroke-current text-gray-400" />
            <span
              class="ml-1 text-xs font-medium text-gray-500 md:ml-2 dark:text-gray-400 capitalize hover:text-blue-600 cursor-pointer"
            >
              {{ $route.name.replace(/-/gi, ' ') }}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  </header>
</template>
