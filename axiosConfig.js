import axiosBase from "axios"
import * as SecureStore from "expo-secure-store"

const axios = axiosBase.create({
  baseURL: "http://10.0.2.2:3500/",
})

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 403) {
      const refreshToken = await SecureStore.getItemAsync("refreshToken")
      const res = await axios.post("auth/refresh", { refreshToken })
      const { authToken } = res.data
      axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`
    }
    return Promise.reject(error)
  }
)
export default axios
