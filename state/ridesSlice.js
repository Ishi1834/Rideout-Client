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
    updateAUserRide: (state, action) => {
      const updatedRide = action.payload
      state.userRides = state.userRides.filter(
        (ride) => ride._id !== updatedRide._id
      )
      state.userRides.push(updatedRide)
    },
    updateAClubRide: (state, action) => {
      const updatedRide = action.payload
      state.clubRides = state.clubRides.filter(
        (ride) => ride._id !== updatedRide._id
      )
      state.clubRides.push(updatedRide)
    },
    removeAUserRide: (state, action) => {
      const rideId = action.payload
      state.userRides = state.userRides.filter((ride) => ride._id !== rideId)
    },
    removeAClubRide: (state, action) => {
      const rideId = action.payload
      state.clubRides = state.clubRides.filter((ride) => ride._id !== rideId)
    },
    resetRides: () => initialState,
  },
})

export const {
  setUpUserRides,
  setUpClubRides,
  setUpOpenRides,
  addAUserRide,
  addAClubRide,
  updateAUserRide,
  updateAClubRide,
  removeAUserRide,
  removeAClubRide,
  resetRides,
} = ridesSlice.actions

export default ridesSlice.reducer
