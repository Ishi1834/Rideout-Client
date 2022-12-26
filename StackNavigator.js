import { useEffect } from "react"
import { createStackNavigator } from "@react-navigation/stack"
// State
import { useSelector, useDispatch } from "react-redux"
import { restoreToken } from "./state/authSlice"
import { addUserDetails } from "./state/userSlice"
// Screens
import { SignInScreen } from "./screens/authScreens/SignInScreen"
import { SignUpScreen } from "./screens/authScreens/SignUpScreen"
import { SplashScreen } from "./screens/SplashScreen"
import { DrawerScreens } from "./screens/authenticatedScreens/DrawerScreens"
import { ClubDetailScreen } from "./screens/authenticatedScreens/clubs/ClubDetailScreen"
import { RideDetailScreen } from "./screens/authenticatedScreens/rides/RideDetailScreen"
import { CreateARideScreen } from "./screens/authenticatedScreens/rides/CreateARideScreen"
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
    // Fetch the token from storage then navigate to our appropriate place
    const checkTokenExists = async () => {
      let authToken
      let userId

      try {
        // Get refreshTokenfrom SecureStore
        refreshToken = await SecureStore.getItemAsync("refreshToken")
        // Get new authToken from backend
        const res = await axios.post("auth/refresh", { refreshToken })
        if (res.status === 200) {
          await SecureStore.setItemAsync("refreshToken", res.data.refreshToken)
          authToken = res.data.authToken
          userId = res.data.userId
          // Set Token header for all axios requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`
        }
      } catch (error) {
        console.log("Error ", error)
      }

      dispatch(restoreToken({ authToken, userId }))
    }

    checkTokenExists()
  }, [])

  useEffect(() => {
    if (authState.userId) {
      try {
        axios.get(`users/${authState.userId}`).then((res) => {
          if (res.status === 200) {
            dispatch(addUserDetails(res.data))
            // Extract club, ride populated by MongoDB
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
            dispatch(setUpClubs({ clubs, authorization }))
            dispatch(setUpUserRides(rides))
          }
        })
      } catch (error) {
        console.log("Error here ", error)
      }
    }
  }, [authState.authToken])

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
            }}
          />
          <Stack.Screen
            name="CreateARide"
            component={CreateARideScreen}
            options={({ route }) => ({
              title: route.params?.clubName
                ? `Create an ${route.params?.clubName} group ride`
                : "Create an Open Ride",
            })}
          />
          <Stack.Screen
            name="ClubDetail"
            component={ClubDetailScreen}
            options={{
              title: "Club",
            }}
          />
          <Stack.Screen name="RideDetail" component={RideDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  )
}