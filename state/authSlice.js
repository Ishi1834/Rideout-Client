import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  isLoading: true,
  isSignout: false,
  authToken: null,
  userId: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    restoreToken: (state, action) => {
      state.authToken = action.payload.authToken
      state.userId = action.payload.userId
      state.isLoading = false
    },
    signIn: (state, action) => {
      state.isSignout = false
      state.authToken = action.payload.authToken
      state.userId = action.payload.userId
      state.isLoading = false
    },
    resetAuth: () => {
      return { ...initialState, isLoading: false }
    },
  },
})

// Action creators are generated for each case reducer function
export const { restoreToken, signIn, resetAuth } = authSlice.actions

export default authSlice.reducer
