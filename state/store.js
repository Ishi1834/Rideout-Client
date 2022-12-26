import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./authSlice"
import userReducer from "./userSlice"
import clubsReducer from "./clubsSlice"
import ridesReducer from "./ridesSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    clubs: clubsReducer,
    rides: ridesReducer,
  },
})
