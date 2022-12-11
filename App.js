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

const Stack = createStackNavigator()

export default function App({ navigation }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken

      try {
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: "RESTORE_TOKEN", token: userToken })
    }

    bootstrapAsync()
  }, [])

  const authContext = useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" })
      },
      signOut: () => dispatch({ type: "SIGN_OUT" }),
      signUp: async (data) => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token

        dispatch({ type: "SIGN_IN", token: "dummy-auth-token" })
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
              ) : state.userToken == null ? (
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
