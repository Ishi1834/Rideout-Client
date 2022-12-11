import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
// Screens
import { MyClubsScreen } from "./clubs/MyClubsScreen"
import { MyRidesScreen } from "./rides/MyRidesScreen"
// UI
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { FindARideScreen } from "./rides/FindARideScreen"

const Tab = createBottomTabNavigator()

export const TabScreens = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="MyClubs"
        options={{
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons
              name="account-group-outline"
              size={22}
              color={tintColor}
            />
          ),
          title: "Clubs",
        }}
        component={MyClubsScreen}
      />
      <Tab.Screen
        name="FindARide"
        options={{
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons name="bike" size={22} color={tintColor} />
          ),
          title: "Find A Ride",
        }}
        component={FindARideScreen}
      />
      <Tab.Screen
        name="MyRides"
        options={{
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons
              name="bike-fast"
              size={22}
              color={tintColor}
            />
          ),
          title: "My Rides",
        }}
        component={MyRidesScreen}
      />
    </Tab.Navigator>
  )
}
