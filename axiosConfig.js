import axiosBase from "axios"
import * as SecureStore from "expo-secure-store"

const axios = axiosBase.create({
  baseURL: "http://192.168.1.14:3500/",
})

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    /* const originalRequest = error.config

    if (error.response.status === 403 && !originalRequest._retry) {
      // set to true to not causes infinite loop
      originalRequest._retry = true
      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken")
        const res = await axios.post("auth/refresh", { refreshToken })
        const { authToken } = res.data
        axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`
        // Set token for retry request
        originalRequest.headers["Authorization"] = `Bearer ${authToken}`

        return axios.request(originalRequest)
      } catch (error) {
        console.log("Error - axiosConfig.js")
        console.log(error)
      }
    }*/
    return Promise.reject(error)
  }
)
export default axios
