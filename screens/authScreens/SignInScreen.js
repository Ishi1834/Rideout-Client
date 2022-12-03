import { useContext, useState } from "react"
// UI
import { View } from "react-native"
import { TextInput, Button } from "react-native-paper"
// State
import { AuthContext } from "../../context/authContext"

export const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { signIn } = useContext(AuthContext)

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button mode="contained" onPress={() => signIn({ username, password })}>
        Sign in
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate("SignUp")}>
        Sign up
      </Button>
    </View>
  )
}
