import { createDrawerNavigator } from "@react-navigation/drawer"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
// Screens
import { HomeScreen } from "./HomeScreen"
import { MyClubsScreen } from "./clubs/MyClubsScreen"
import { MyRidesScreen } from "./rides/MyRidesScreen"
import { CreateARideScreen } from "./rides/CreateARideScreen"

const Drawer = createDrawerNavigator()
const Tab = createBottomTabNavigator()

const TabScreens = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      <Tab.Screen name="MyClubs" component={MyClubsScreen} />
      <Tab.Screen name="CreateARide" component={CreateARideScreen} />
      <Tab.Screen name="MyRides" component={MyRidesScreen} />
    </Tab.Navigator>
  )
}

export const AutheticatedScreens = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen
        name="Home"
        component={TabScreens}
        options={{ headerTitle: "" }}
      />
    </Drawer.Navigator>
  )
}
