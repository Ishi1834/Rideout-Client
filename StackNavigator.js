import { useEffect } from "react"
import { createStackNavigator } from "@react-navigation/stack"
// State
import { useSelector, useDispatch } from "react-redux"
import { restoreToken, resetAuth } from "./state/authSlice"
import { setUpUserDetails } from "./state/userSlice"
// Screens
import { SignInScreen } from "./screens/authScreens/SignInScreen"
import { SignUpScreen } from "./screens/authScreens/SignUpScreen"
import { SplashScreen } from "./screens/SplashScreen"
import { DrawerScreens } from "./screens/authenticatedScreens/DrawerScreens"
import { ClubDetailScreen } from "./screens/authenticatedScreens/clubs/ClubDetailScreen"
import { RideDetailScreen } from "./screens/authenticatedScreens/rides/RideDetailScreen"
import { CreateARideScreen } from "./screens/authenticatedScreens/rides/CreateARideScreen"
import { EditARideScreen } from "./screens/authenticatedScreens/rides/EditARideScreen"
import { EditAClubScreen } from "./screens/authenticatedScreens/clubs/EditAClubScreen"
// Other
import axios from "./axiosConfig"
import * as SecureStore from "expo-secure-store"
import { setUpClubs } from "./state/clubsSlice"
import { setUpUserRides } from "./state/ridesSlice"

const Stack = createStackNavigator()

export const StackNavigator = () => {
  const authState = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  useEffect(() => {
    getRefreshTokenFromSecureStore()
  }, [])

  useEffect(() => {
    if (authState?.userId && authState?.authToken) {
      getUserData(authState.userId, authState.authToken)
    }
  }, [authState?.authToken])

  const getRefreshTokenFromSecureStore = async () => {
    const refreshToken = await SecureStore.getItemAsync("refreshToken")
    if (refreshToken) {
      useRefreshToken(refreshToken)
    } else {
      dispatch(resetAuth())
    }
  }

  const useRefreshToken = async (refreshToken) => {
    try {
      const res = await axios.post("auth/refresh", { refreshToken })
      if (res.status === 200) {
        await SecureStore.setItemAsync("refreshToken", res.data.refreshToken)
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.authToken}`
        dispatch(
          restoreToken({
            authToken: res.data.authToken,
            userId: res.data.userId,
          })
        )
      }
    } catch (error) {
      console.log("Error - StackNavigator.js")
      console.log(error)
      dispatch(resetAuth())
    }
  }

  const getUserData = async (userId, authToken) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`
    try {
      const res = await axios.get(`users/${userId}`)
      if (res.status === 200) {
        const { name, email, _id, username } = res.data
        // Extract club and ride, populated by MongoDB
        const clubs = res.data.clubs.map((club) => club.clubId)
        const rides = res.data.rides.map((ride) => ride.rideId)
        // Get authorization for the clubs
        const authorization = res.data.clubs.map((club) => {
          return {
            clubName: club.name,
            authorization: club.authorization,
            clubId: club.clubId._id,
          }
        })
        // Set up redux state
        dispatch(
          setUpUserDetails({
            name,
            email,
            userId: _id,
            username,
          })
        )
        dispatch(setUpClubs({ clubs, authorization }))
        dispatch(setUpUserRides(rides))
      }
    } catch (error) {
      console.log("Error - StackNavigator.js")
      console.log(error)
      dispatch(resetAuth())
    }
  }

  return (
    <Stack.Navigator>
      {authState.isLoading ? (
        // We haven't finished checking for the token yet
        <Stack.Screen name="Splash" component={SplashScreen} />
      ) : authState.authToken == null ? (
        <>
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              title: "Sign in",
              // When logging out, a pop animation feels intuitive
              animationTypeForReplace: authState.isSignout ? "pop" : "push",
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              title: "Sign up",
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="DrawerScreens"
            component={DrawerScreens}
            options={{
              headerShown: false,
              title: "",
            }}
          />
          <Stack.Screen
            name="CreateARide"
            component={CreateARideScreen}
            options={({ route }) => ({
              title: route.params?.clubName
                ? `${route.params?.clubName}`
                : "Create an Open Ride",
            })}
          />
          <Stack.Screen
            name="EditAClub"
            component={EditAClubScreen}
            options={({ route }) => ({
              title: `${route.params?.clubName}`,
            })}
          />
          <Stack.Screen
            name="ClubDetail"
            component={ClubDetailScreen}
            options={({ route }) => ({
              title: `${route.params?.clubName}`,
            })}
          />
          <Stack.Screen
            name="EditARide"
            component={EditARideScreen}
            options={({ route }) => ({
              title: `${route.params?.rideName}`,
            })}
          />
          <Stack.Screen
            name="RideDetail"
            component={RideDetailScreen}
            options={({ route }) => ({
              title: `${route.params?.rideName}`,
            })}
          />
        </>
      )}
    </Stack.Navigator>
  )
}
