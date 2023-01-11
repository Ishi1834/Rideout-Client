import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer"
import { MaterialCommunityIcons } from "@expo/vector-icons"
// Screens
import { ProfileScreen } from "./user/ProfileScreen"
import { TabScreens } from "./TabScreens"
import { FindAClubScreen } from "./clubs/FindAClubScreen"
import { CreateAClubScreen } from "./clubs/CreateAClubScreen"
// State
import { useDispatch } from "react-redux"
import { signOut } from "../../state/authSlice"
// Other
import * as SecureStore from "expo-secure-store"
import { clearUserDetails } from "../../state/userSlice"
import { clearClubs } from "../../state/clubsSlice"
import { clearRides } from "../../state/ridesSlice"

const Drawer = createDrawerNavigator()

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch()

  const logout = async () => {
    await SecureStore.deleteItemAsync("refreshToken")
    dispatch(clearUserDetails())
    dispatch(clearClubs())
    dispatch(clearRides())
    dispatch(signOut())
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Log out" onPress={() => logout()} />
    </DrawerContentScrollView>
  )
}

export const DrawerScreens = ({ navigation }) => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={TabScreens}
        options={{
          headerTitle: "",
          headerRight: ({ tintColor }) => (
            <MaterialCommunityIcons
              name="plus"
              style={{ marginRight: 15 }}
              size={22}
              color={tintColor}
              onPress={() => navigation.navigate("CreateARide")}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="FindAClub"
        options={{
          title: "Find A Club",
        }}
        component={FindAClubScreen}
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
