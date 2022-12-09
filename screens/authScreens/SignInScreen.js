import { useContext } from "react"
// UI
import { ScrollView, StyleSheet, View } from "react-native"
import { TextInput, Button, HelperText } from "react-native-paper"
// State
import { AuthContext } from "../../context/authContext"
// Other
import { Formik } from "formik"
import { signInSchema } from "../../static/validationSchema"

export const SignInScreen = ({ navigation }) => {
  const { signIn } = useContext(AuthContext)

  return (
    <ScrollView>
      <View style={styles.container}>
        <Formik
          onSubmit={(values) => signIn(values)}
          initialValues={{}}
          validationSchema={signInSchema}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Username"
                  value={values.username}
                  onChangeText={handleChange("username")}
                  error={errors.username}
                />
                <HelperText type="error" visible={errors.username}>
                  {errors.username}
                </HelperText>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  secureTextEntry
                  error={errors.password}
                />
                <HelperText type="error" visible={errors.password}>
                  {errors.password}
                </HelperText>
              </View>
              <View style={[styles.buttonContainer, { marginTop: 50 }]}>
                <Button mode="contained" onPress={handleSubmit}>
                  Sign in
                </Button>
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate("SignUp")}
                >
                  Sign up
                </Button>
              </View>
            </>
          )}
        </Formik>
      </View>
    </ScrollView>
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
