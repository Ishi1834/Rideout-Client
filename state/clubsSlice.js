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
    incrementClubActivitiesCount: (state, action) => {
      const clubId = action.payload
      state.clubs = state.clubs.map((club) => {
        if (club._id === clubId) {
          return {
            ...club,
            activitiesCount: club.activitiesCount + 1,
          }
        } else {
          return club
        }
      })
    },
    decrementClubActivitiesCount: (state, action) => {
      const clubId = action.payload
      state.clubs = state.clubs.map((club) => {
        if (club._id === clubId) {
          return {
            ...club,
            activitiesCount: club.activitiesCount - 1,
          }
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
  updateAClub,
  incrementClubActivitiesCount,
  decrementClubActivitiesCount,
  removeAClub,
  resetClubs,
} = clubsSlice.actions

export default clubsSlice.reducer
