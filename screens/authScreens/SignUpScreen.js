import { useContext, useState } from "react"
// UI
import { StyleSheet, View } from "react-native"
import { TextInput, Button } from "react-native-paper"
// State
import { AuthContext } from "../../context/authContext"

export const SignUpScreen = () => {
  const [data, setData] = useState({
    name: null,
    username: null,
    email: null,
    password: null,
    confirmPassword: null,
  })

  const { signUp } = useContext(AuthContext)

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          label="Name"
          value={data.name}
          onChangeText={(val) => setData({ ...data, name: val })}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Username"
          value={data.username}
          onChangeText={(val) => setData({ ...data, username: val })}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Email"
          keyboardType="email-address"
          value={data.email}
          onChangeText={(val) => setData({ ...data, email: val })}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Password"
          value={data.password}
          onChangeText={(val) => setData({ ...data, password: val })}
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          label="Confirm Password"
          value={data.confirmPassword}
          onChangeText={(val) => setData({ ...data, confirmPassword: val })}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => signUp({ data })}>
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
    paddingVertical: 25,
  },
})
