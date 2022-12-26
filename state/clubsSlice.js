import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  clubs: [],
  authorization: [],
}

export const clubsSlice = createSlice({
  name: "clubs",
  initialState,
  reducers: {
    setUpClubs: (state, action) => {
      const { clubs, authorization } = action.payload
      state.clubs = clubs
      state.authorization = authorization
    },
    addAClub: (state, action) => {
      const club = action.payload
      state.clubs.push(club)
      state.authorization.push({
        clubName: club.name,
        authorization: "admin",
        clubId: club._id,
      })
    },
    removeAClub: (state, action) => {
      const clubId = action.payload
      state.clubs = state.clubs.filter((club) => clubId !== club._id)
      state.authorization = state.authorization.filter(
        (club) => clubId !== club.clubId
      )
    },
  },
})

export const { setUpClubs, addAClub, removeAClub } = clubsSlice.actions

export default clubsSlice.reducer
