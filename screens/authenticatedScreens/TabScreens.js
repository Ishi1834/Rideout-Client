import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
// Screens
import { MyClubsScreen } from "./clubs/MyClubsScreen"
import { MyRidesScreen } from "./rides/MyRidesScreen"
import { CreateARideScreen } from "./rides/CreateARideScreen"
// UI
import { MaterialCommunityIcons } from "@expo/vector-icons"

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
        name="CreateARide"
        options={{
          tabBarIcon: ({ tintColor }) => (
            <MaterialCommunityIcons name="bike" size={22} color={tintColor} />
          ),
          title: "Create A Ride",
        }}
        component={CreateARideScreen}
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
          title: "Rides",
        }}
        component={MyRidesScreen}
      />
    </Tab.Navigator>
  )
}
