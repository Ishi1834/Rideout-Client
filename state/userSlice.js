import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  username: null,
  name: null,
  email: null,
  userId: null,
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserDetails: (state, action) => {
      state.username = action.payload.username
      state.name = action.payload.name
      state.email = action.payload.email
      state.userId = action.payload._id
    },
    clearUserDetails: (state) => {
      state.username = null
      state.name = null
      state.email = null
      state.userId = null
    },
  },
})

// Action creators are generated for each case reducer function
export const { addUserDetails, clearUserDetails } = userSlice.actions

export default userSlice.reducer
