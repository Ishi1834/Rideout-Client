import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  clubs: [],
  authorization: [],
  pendingJoinRequests: [],
}

export const clubsSlice = createSlice({
  name: "clubs",
  initialState,
  reducers: {
    setUpClubs: (state, action) => {
      const { clubs, authorization, pendingJoinRequests } = action.payload
      state.clubs = clubs
      state.authorization = authorization
      state.pendingJoinRequests = pendingJoinRequests
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
    addPendingClubRequest: (state, action) => {
      const clubInfo = action.payload
      state.pendingJoinRequests.push(clubInfo)
    },
    updateAClub: (state, action) => {
      const updatedClub = action.payload
      state.clubs = state.clubs.map((club) => {
        if (club._id === updatedClub._id) {
          return updatedClub
        } else {
          return club
        }
      })
    },
    removeAClub: (state, action) => {
      const clubId = action.payload
      state.clubs = state.clubs.filter((club) => clubId !== club._id)
      state.authorization = state.authorization.filter(
        (club) => clubId !== club.clubId
      )
    },
    resetClubs: () => initialState,
  },
})

export const {
  setUpClubs,
  addAClub,
  addPendingClubRequest,
  updateAClub,
  removeAClub,
  resetClubs,
} = clubsSlice.actions

export default clubsSlice.reducer
