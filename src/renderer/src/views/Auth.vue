<script setup>
import moment from 'moment'
import { createElement, Eye, EyeOff } from 'lucide'
import { useAuthStore } from '@renderer/stores/auth'
import { onMounted, ref, watch, inject } from 'vue'
import dom from '@left4code/tw-starter/dist/js/dom'
const swal = inject('$swal')
const Auth = useAuthStore()
const isLoading = ref(false)
const date = ref(Date.now())
const gagalLogin = ref(false)
const dataPopup = ref('')
const input_user = ref('')
const input_password = ref('')

const showPassword = () => {
  const password = document.querySelector('.js-password'),
    passwordLabel = document.querySelector('.js-password-label')

  if (password.type === 'password') {
    password.type = 'text'
    passwordLabel.replaceChild(createElement(EyeOff), passwordLabel.childNodes[0])
  } else {
    password.type = 'password'
    passwordLabel.replaceChild(createElement(Eye), passwordLabel.childNodes[0])
  }
  password.focus()
}

watch(isLoading, async (newValue) => {
  try {
    if (newValue === true) {
      setTimeout(() => onLogin(), 100)
    }
  } catch (error) {
    swal('Failed Login ' + error)
  }
})

const onLogin = () => {
  const nama = input_user.value
  const password = input_password.value
  if (nama.length > 0 && password.length > 0) {
    Auth.login(nama, password)
      .then((data) => {
        if (data.success == false) {
          dataPopup.value = data.data.message
          gagalLogin.value = true
          if (data.data.message == 'unregistered userid/e-mail') {
            input_user.value = ''
            input_password.value = ''
            swal({
              icon: 'error',
              title: 'Oops...',
              text: data.data.message
            })
          } else {
            input_password.value = ''
            swal({
              icon: 'error',
              title: 'Oops...',
              text: data.data.message
            })
          }
        }
        isLoading.value = false
      })
      .catch((error) => {
        console.error(error)
        swal({
          icon: 'error',
          title: 'Error !!!',
          text: 'Gagal Login ' + JSON.stringify(error)
        })
        isLoading.value = false
      })
  } else {
    dataPopup.value = 'Email/Username dan Password tidak boleh kosong !'
    swal({
      icon: 'error',
      title: 'Oops...',
      text: dataPopup.value
    })
    gagalLogin.value = true
    isLoading.value = false
  }
}
onMounted(() => {
  dom('body').removeClass('main').removeClass('error-page').addClass('login')
  setInterval(() => {
    date.value = Date.now()
  }, 1000)
})
</script>
<template>
  <div
    class="h-screen w-full flex justify-center items-center bg-[#DDFBDF] bg-no-repeat bg-cover bg-center bg-fixed"
  >
    <div
      class="shadow-2xl flex items-center rounded-3xl z-10 overflow-hidden w-8/12 xl:w-1/3 h-3/4 bg-white"
    >
      <div class="flex min-h-full mx-auto justify-center px-4">
        <div class="py-12 grid items-center">
          <div>
            <img
              class="mx-auto h-20 2xl:h-28 w-auto hover:scale-125 transition duration-700 ease-in-out"
              src="@renderer/assets/icons.svg"
              alt="Your Company"
            />
            <h1
              class="mt-4 w-96 mb-6 text-center text-lg 2xl:text-xl font-bold tracking-tight text-gray-900 uppercase"
            >
              Koperasi Binaniaga
            </h1>
            <h2 class="w-96 text-center text-sm text-slate-500">
              Silahkan Login untuk masuk aplikasi
            </h2>
          </div>
          <form class="space-y-5 2xl:space-y-10" action="#" method="POST">
            <input type="hidden" name="remember" value="true" />
            <div class="-space-y-px rounded-md shadow-sm">
              <div>
                <label for="email-address" class="sr-only">Email/ Username</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autocomplete="email"
                  required
                  v-model="input_user"
                  class="relative block w-full rounded-t-md p-2 h-12 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 sm:text-sm sm:leading-6"
                  placeholder="Email/ Username"
                />
              </div>
              <div class="intro-x relative w-full">
                <div class="absolute inset-y-0 right-0 flex items-center px-2">
                  <input
                    class="hidden js-password-toggle"
                    @click="showPassword()"
                    id="toggle"
                    type="checkbox"
                  />
                  <label
                    class="bg-gray-200 hover:bg-gray-300 rounded px-2 py-1 text-sm text-gray-600 font-mono cursor-pointer js-password-label"
                    for="toggle"
                  >
                    <EyeIcon />
                  </label>
                </div>
                <input
                  @keyup.enter="isLoading = true"
                  v-model="input_password"
                  class="w-full p-2 h-12 rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 sm:text-sm sm:leading-6 px-3 pr-16 js-password"
                  id="password"
                  type="password"
                  autocomplete="off"
                  placeholder="Password"
                />
              </div>
            </div>
            <div>
              <button
                v-if="isLoading"
                disabled
                class="group relative flex w-full justify-center rounded-md h-9 bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span class="absolute mx-auto text-center inset-y-0 flex items-center pl-3">
                  <Loader-2Icon class="w-4 h-4 mr-2 animate-spin" />
                  <p class="hidden xl:block ml-1">Loading ...</p>
                </span>
              </button>
              <button
                v-else
                @click="isLoading = true"
                type="submit"
                class="group relative flex w-full justify-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockIcon class="h-5 w-5 text-blue-500 group-hover:text-indigo-400" />
                </span>
                Sign in
              </button>
            </div>
          </form>
          <h5 class="w-96 text-center text-sm text-slate-400 mt-10 2xl:mt-20">
            {{ moment(date).format('DD MMMM YYYY, HH:mm:ss') }}
          </h5>
        </div>
      </div>
    </div>
  </div>
</template>
