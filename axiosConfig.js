import axiosBase from "axios"
import * as SecureStore from "expo-secure-store"

const axios = axiosBase.create({
  baseURL: "http://192.168.1.14:3500/",
})

const getNewToken = async () => {
  let refreshToken = null
  try {
    refreshToken = await SecureStore.getItemAsync("refreshToken")
  } catch (error) {
    // if error getting refresh token
    return null
  }

  try {
    const res = await axios.post("auth/refresh", { refreshToken })
    if (res.status === 200) {
      const { authToken, refreshToken } = res.data
      // set RefreshToken here
      await SecureStore.setItemAsync("refreshToken", refreshToken)
      return authToken
    }
  } catch (error) {
    console.log("Error using refreshToken")
    return null
  }
}

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 403 && !originalRequest._retry) {
      // set to true to not causes infinite loop
      originalRequest._retry = true

      const authToken = await getNewToken()

      if (authToken) {
        axiosBase.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${authToken}`
        originalRequest.headers["Authorization"] = `Bearer ${authToken}`
        return axios(originalRequest)
      }
    }
    return Promise.reject(error)
  }
)
export default axios
