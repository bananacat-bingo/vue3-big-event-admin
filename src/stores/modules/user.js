import { defineStore } from 'pinia'
import { ref } from 'vue'
import { userGetInfoService } from '@/api/user'

export const useUserStore = defineStore(
  'user',
  () => {
    const token = ref('')
    const user = ref({})
    const getUser = async () => {
      const res = await userGetInfoService()
      user.value = res.data
    }
    const setUser = () => {
      token.value = ''
      user.value = ''
    }
    return {
      token,
      user,
      getUser,
      setUser
    }
  },
  {
    persist: {
      paths: ['token', 'user']
    }
  }
)
