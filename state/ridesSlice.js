import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  userRides: [],
  clubRides: [],
  openRides: {
    range: null,
    rides: [],
  },
}

export const ridesSlice = createSlice({
  name: "rides",
  initialState,
  reducers: {
    setUpUserRides: (state, action) => {
      state.userRides = action.payload
    },
    setUpClubRides: (state, action) => {
      state.clubRides = action.payload
    },
    setUpOpenRides: (state, action) => {
      const { range, rides } = action.payload
      state.openRides = { range, rides }
    },
    addAUserRide: (state, action) => {
      state.userRides.push(action.payload)
    },
    addAClubRide: (state, action) => {
      state.clubRides.push(action.payload)
    },
    removeAUserRide: (state, action) => {
      const rideId = action.payload
      state.userRides = state.userRides.filter((ride) => ride._id !== rideId)
    },
    removeAClubRide: (state, action) => {
      const rideId = action.payload
      state.clubRides = state.clubRides.filter((ride) => ride._id !== rideId)
    },
  },
})

export const {
  setUpUserRides,
  setUpClubRides,
  setUpOpenRides,
  addAUserRide,
  addAClubRide,
  removeAUserRide,
  removeAClubRide,
} = ridesSlice.actions

export default ridesSlice.reducer
