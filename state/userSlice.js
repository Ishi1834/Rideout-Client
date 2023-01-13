import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  username: null,
  name: null,
  email: null,
  userId: null,
  pendingJoinRequests: [],
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUpUserDetails: (state, action) => {
      state.username = action.payload.username
      state.name = action.payload.name
      state.email = action.payload.email
      state.userId = action.payload.userId
      state.pendingJoinRequests = action.payload.pendingJoinRequests
    },
    addPendingClubRequest: (state, action) => {
      const clubInfo = action.payload
      state.pendingJoinRequests.push(clubInfo)
    },
    resetUserDetails: () => initialState,
  },
})

// Action creators are generated for each case reducer function
export const { setUpUserDetails, resetUserDetails, addPendingClubRequest } =
  userSlice.actions

export default userSlice.reducer
