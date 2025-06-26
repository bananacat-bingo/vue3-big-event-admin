import axios from 'axios'
import { useUserStore } from '@/stores'
import { ElMessage } from 'element-plus'
import router from '@/router'

const baseURL = 'https://big-event-vue-api-t.itheima.net'

const instance = axios.create({
  baseURL,
  timeout: 10000
})

// 添加请求拦截器，请求发送前执行
instance.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = userStore.token
    }
    return config
  },
  (err) => {
    // 请求错误时拒绝
    return Promise.reject(err)
  }
)
// 添加响应拦截器，收到响应后执行
instance.interceptors.response.use(
  (res) => {
    if (res.data.code === 0) {
      return res.data
    }

    ElMessage.error(res.data.message || '服务异常')
    return Promise.reject(res)
  },
  (err) => {
    if (err.response?.status === 401) {
      router.push('/login')
    }

    ElMessage.error(err.response?.data?.message || '服务异常')
    return Promise.reject(err)
  }
)

export default instance
export { baseURL }
