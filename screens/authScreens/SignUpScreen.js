import { useContext, useState } from "react"
// UI
import { StyleSheet, View } from "react-native"
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
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Name"
          value={userData.name}
          onChangeText={(val) => setUserData({ ...userData, name: val })}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          value={userData.username}
          onChangeText={(val) => setUserData({ ...userData, username: val })}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={userData.email}
          onChangeText={(val) => setUserData({ ...userData, email: val })}
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Password"
          value={userData.password}
          onChangeText={(val) => setUserData({ ...userData, password: val })}
          secureTextEntry
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Confirm Password"
          value={userData.confirmPassword}
          onChangeText={(val) =>
            setUserData({ ...userData, confirmPassword: val })
          }
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" onPress={() => signUp({ userData })}>
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
