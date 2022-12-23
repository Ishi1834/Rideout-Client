import "react-native-gesture-handler"
import { NavigationContainer } from "@react-navigation/native"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Provider } from "react-native-paper"
// State
import { store } from "./state/store"
import { Provider as ReduxProvider } from "react-redux"
import { StackNavigator } from "./StackNavigator"

export default function App() {
  return (
    <ReduxProvider store={store}>
      <Provider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StackNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    </ReduxProvider>
  )
}
