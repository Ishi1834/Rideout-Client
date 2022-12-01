import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
// Screens
import { MyClubsScreen } from "./clubs/MyClubsScreen"
import { MyRidesScreen } from "./rides/MyRidesScreen"
import { CreateARideScreen } from "./rides/CreateARideScreen"

const Tab = createBottomTabNavigator()

export const TabScreens = () => {
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
