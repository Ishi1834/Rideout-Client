import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  clubs: [],
}

export const clubsSlice = createSlice({
  name: "clubs",
  initialState,
  reducers: {
    setUpClubs: (state, action) => {
      state.clubs = action.payload
    },
    addAClub: (state, action) => {
      state.clubs.push(action.payload)
    },
    removeAClub: (state, action) => {
      const clubId = action.payload
      state.clubs = state.clubs.filter((club) => clubId !== club._id)
    },
  },
})

export const { setUpClubs, addAClub, removeAClub } = clubsSlice.actions

export default clubsSlice.reducer
