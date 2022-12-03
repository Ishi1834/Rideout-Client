import { useContext } from "react"
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer"
// Screens
import { ProfileScreen } from "./user/ProfileScreen"
import { TabScreens } from "./TabScreens"
import { FindAClubScreen } from "./clubs/FindAClubScreen"
import { FindARideScreen } from "./rides/FindARideScreen"
import { CreateAClubScreen } from "./clubs/CreateAClubScreen"
// Context
import { AuthContext } from "../../context/authContext"

const Drawer = createDrawerNavigator()

const CustomDrawerContent = (props) => {
  const { signOut } = useContext(AuthContext)

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Log out" onPress={() => signOut()} />
    </DrawerContentScrollView>
  )
}

export const AutheticatedScreens = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={TabScreens}
        options={{ headerTitle: "" }}
      />
      <Drawer.Screen
        name="FindAClub"
        options={{
          title: "Find A Club",
        }}
        component={FindAClubScreen}
      />
      <Drawer.Screen
        name="FindARide"
        options={{
          title: "Find A Ride",
        }}
        component={FindARideScreen}
      />
      <Drawer.Screen
        name="CreateAClub"
        options={{
          title: "Create A Club",
        }}
        component={CreateAClubScreen}
      />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  )
}
