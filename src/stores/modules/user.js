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
    return {
      token,
      user,
      getUser
    }
  },
  {
    persist: {
      paths: ['token', 'user']
    }
  }
)
