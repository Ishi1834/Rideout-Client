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
import { CreateAClubScreen } from "./clubs/CreateAClubScreen"
// Context
import { AuthContext } from "../../context/authContext"
import { MaterialCommunityIcons } from "@expo/vector-icons"

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

export const DrawerScreens = ({ navigation }) => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
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
