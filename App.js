import "react-native-gesture-handler"
import { useMemo, useReducer, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { SafeAreaProvider } from "react-native-safe-area-context"
// Screens
import { SignInScreen } from "./screens/authScreens/SignInScreen"
import { SignUpScreen } from "./screens/authScreens/SignUpScreen"
import { SplashScreen } from "./screens/SplashScreen"
import { DrawerScreens } from "./screens/authenticatedScreens/DrawerScreens"
import { ClubDetailScreen } from "./screens/authenticatedScreens/clubs/ClubDetailScreen"
import { RideDetailScreen } from "./screens/authenticatedScreens/rides/RideDetailScreen"
import { CreateARideScreen } from "./screens/authenticatedScreens/rides/CreateARideScreen"
// State
import { AuthContext } from "./context/authContext"
import { authReducer } from "./context/authReducer"
import { initialState } from "./context/state"
import { Provider } from "react-native-paper"
// Other
import axios from "./axiosConfig"
import * as SecureStore from "expo-secure-store"

const Stack = createStackNavigator()

export default function App() {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let authToken

      try {
        // Get refreshTokenfrom SecureStore
        refreshToken = await SecureStore.getItemAsync("refreshToken")
        // Get new authToken from backend
        const res = await axios.post("auth/refresh", { refreshToken })
        if (res.status === 200) {
          await SecureStore.setItemAsync("refreshToken", res.data.refreshToken)
          authToken = res.data.authToken
          // Set Token header for all axios requests
          axios.defaults.headers.common["Authorization"] = `Bearer ${authToken}`
        }
      } catch (error) {
        console.log("Error ", error)
      }

      dispatch({ type: "RESTORE_TOKEN", token: authToken })
    }

    bootstrapAsync()
  }, [])

  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        await SecureStore.setItemAsync("refreshToken", data.refreshToken)

        dispatch({ type: "SIGN_IN", token: data.authToken })
      },
      signOut: async () => {
        await SecureStore.deleteItemAsync("refreshToken")
        dispatch({ type: "SIGN_OUT" })
      },
    }),
    []
  )

  return (
    <AuthContext.Provider value={authContext}>
      <Provider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator>
              {state.isLoading ? (
                // We haven't finished checking for the token yet
                <Stack.Screen name="Splash" component={SplashScreen} />
              ) : state.authToken == null ? (
                <>
                  <Stack.Screen
                    name="SignIn"
                    component={SignInScreen}
                    options={{
                      title: "Sign in",
                      // When logging out, a pop animation feels intuitive
                      animationTypeForReplace: state.isSignout ? "pop" : "push",
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
                    options={{
                      title: "Create a Ride",
                    }}
                  />
                  <Stack.Screen
                    name="ClubDetail"
                    component={ClubDetailScreen}
                    options={{
                      title: "Club",
                    }}
                  />
                  <Stack.Screen
                    name="RideDetail"
                    component={RideDetailScreen}
                  />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </AuthContext.Provider>
  )
}
