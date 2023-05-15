import { defineStore } from 'pinia'
const request = window.api.oAuth
import router from '@renderer/router'

export const useAuthStore = defineStore({
  id: 'authorization',
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  getters: {
    items: (state) => state.user
  },
  actions: {
    async login(input_user, password) {
      try {
        const data = await request.auth(input_user, password)
        if (data.success) {
          this.user = data.data
          // return this.user

          // store user details and jwt in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(this.user))

          // redirect to previous url or default to home page
          router.push(this.returnUrl || '/')
          // window.location.reload()
        }
        return data
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    },

    async logout() {
      try {
        const data = await request.logOut()
        if (data.success) {
          router.push('/auth')
          this.user = null
          localStorage.removeItem('user')
        }
        window.location.reload()
      } catch (error) {
        console.error(error)
        throw new Error(error)
      }
    }
  }
})
