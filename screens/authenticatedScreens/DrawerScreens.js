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
import { resetAuth } from "../../state/authSlice"
import { resetUserDetails } from "../../state/userSlice"
import { resetClubs } from "../../state/clubsSlice"
import { resetRides } from "../../state/ridesSlice"
// Other
import * as SecureStore from "expo-secure-store"
import * as MailComposer from "expo-mail-composer"

const Drawer = createDrawerNavigator()

const CustomDrawerContent = (props) => {
  const dispatch = useDispatch()

  const logout = async () => {
    await SecureStore.deleteItemAsync("refreshToken")
    dispatch(resetUserDetails())
    dispatch(resetClubs())
    dispatch(resetRides())
    dispatch(resetAuth())
  }

  const openMail = () => {
    MailComposer.composeAsync({ recipients: ["clubrideout@gmail.com"] })
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem label="Contact us" onPress={() => openMail()} />
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
