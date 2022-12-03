import { useContext, useState } from "react"
// UI
import { StyleSheet, View } from "react-native"
import { TextInput, Button } from "react-native-paper"
// State
import { AuthContext } from "../../context/authContext"

export const SignInScreen = ({ navigation }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const { signIn } = useContext(AuthContext)

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={[styles.buttonContainer, { marginTop: 50 }]}>
        <Button mode="contained" onPress={() => signIn({ username, password })}>
          Sign in
        </Button>
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="outlined" onPress={() => navigation.navigate("SignUp")}>
          Sign up
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputContainer: {
    paddingTop: 15,
  },
  buttonContainer: {
    paddingVertical: 10,
  },
})
