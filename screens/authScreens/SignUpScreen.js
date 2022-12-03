import { useContext, useState } from "react"
// UI
import { View } from "react-native"
import { TextInput, Button } from "react-native-paper"
// State
import { AuthContext } from "../../context/authContext"

export const SignUpScreen = () => {
  const [userData, setUserData] = useState({
    name: null,
    username: null,
    email: null,
    password: null,
    confirmPassword: null,
  })

  const { signUp } = useContext(AuthContext)

  return (
    <View>
      <TextInput
        placeholder="Name"
        value={userData.name}
        onChangeText={(val) => setUserData({ ...userData, name: val })}
      />
      <TextInput
        placeholder="Username"
        value={userData.username}
        onChangeText={(val) => setUserData({ ...userData, username: val })}
      />
      <TextInput
        placeholder="Email"
        value={userData.email}
        onChangeText={(val) => setUserData({ ...userData, email: val })}
      />
      <TextInput
        placeholder="Password"
        value={userData.password}
        onChangeText={(val) => setUserData({ ...userData, password: val })}
        secureTextEntry
      />
      <TextInput
        placeholder="Confirm Password"
        value={userData.confirmPassword}
        onChangeText={(val) =>
          setUserData({ ...userData, confirmPassword: val })
        }
        secureTextEntry
      />
      <Button mode="contained" onPress={() => signUp({ userData })}>
        Sign up
      </Button>
    </View>
  )
}
