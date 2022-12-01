import { useMemo, useReducer, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { SafeAreaProvider } from "react-native-safe-area-context"
// Screens
import { SignInScreen } from "./screens/authScreens/SignInScreen"
import { SignUpScreen } from "./screens/authScreens/SignUpScreen"
import { HomeScreen } from "./screens/authenticatedScreens/HomeScreen"
import { FindAClubScreen } from "./screens/authenticatedScreens/FindAClubScreen"
import { MyRidesScreen } from "./screens/authenticatedScreens/MyRidesScreen"
import { SplashScreen } from "./screens/SplashScreen"
// State
import { AuthContext } from "./context/authContext"
import { authReducer } from "./context/authReducer"
import { initialState } from "./context/state"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

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
              // User is signed in
              <Stack.Screen name="Home" component={HomeScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthContext.Provider>
  )
}
