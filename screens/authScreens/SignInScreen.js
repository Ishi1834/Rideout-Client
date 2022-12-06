import { useContext, useState } from "react"
// UI
import { StyleSheet, View } from "react-native"
import { TextInput, Button } from "react-native-paper"
// State
import { AuthContext } from "../../context/authContext"

export const SignInScreen = ({ navigation }) => {
  const [data, setData] = useState({
    username: "",
    password: "",
  })

  const { signIn } = useContext(AuthContext)

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          label="Username"
          value={data.username}
          onChangeText={(text) => setData({ ...data, username: text })}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Password"
          value={data.password}
          onChangeText={(text) => setPassword({ ...data, password: text })}
          secureTextEntry
        />
      </View>
      <View style={[styles.buttonContainer, { marginTop: 50 }]}>
        <Button mode="contained" onPress={() => signIn(data)}>
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
