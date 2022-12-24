import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  username: null,
  name: null,
  email: null,
  clubs: [],
  rides: [],
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    addUserDetails: (state, action) => {
      state.username = action.payload.username
      state.name = action.payload.name
      state.email = action.payload.email
      // Mongoose Populate uses clubId, rideId to populate
      state.clubs = action.payload.clubs.map((club) => club.clubId)
      state.rides = action.payload.rides.map((ride) => ride.rideId)
    },
    updateClubs: (state, action) => {
      state.clubs = action.payload
    },
    clearUserDetails: (state) => {
      state.username = null
      state.name = null
      state.email = null
      state.clubs = []
      state.rides = []
    },
  },
})

// Action creators are generated for each case reducer function
export const { addUserDetails, updateClubs, clearUserDetails } =
  userSlice.actions

export default userSlice.reducer
