import { useContext, useState } from "react"
// UI
import { ScrollView, StyleSheet, View } from "react-native"
import {
  TextInput,
  Button,
  HelperText,
  ActivityIndicator,
} from "react-native-paper"
// State
import { AuthContext } from "../../context/authContext"
// Other
import { Formik } from "formik"
import { signInSchema } from "../../static/validationSchema"
import { signInInitialValues } from "../../static/formValues"
import axios from "../../axiosConfig"
import { ErrorText } from "../../components/ErrorText"

export const SignInScreen = ({ navigation }) => {
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmittingApi, setIsSubmittingApi] = useState(false)
  const { signIn } = useContext(AuthContext)

  const loginApiCall = async (data) => {
    setIsSubmittingApi(true)
    setErrorMessage("")
    try {
      const res = await axios.post("/auth", data)
      if (res?.data?.authToken) {
        signIn(res.data)
      }
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.message)
      } else if (error.request) {
        // Request made but no response is received from the server.
      } else {
        // Error occured while setting up the request
      }
    }
    setIsSubmittingApi(false)
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <Formik
          onSubmit={(values) => loginApiCall(values)}
          initialValues={signInInitialValues}
          validationSchema={signInSchema}
        >
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            values,
            errors,
            touched,
          }) => (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Username"
                  value={values.username}
                  onChangeText={handleChange("username")}
                  onBlur={handleBlur("username")}
                  error={touched.username && errors.username}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={touched.username && errors.username ? true : false}
                >
                  {errors.username}
                </HelperText>
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Password"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  secureTextEntry
                  onBlur={handleBlur("password")}
                  error={touched.password && errors.password}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={touched.password && errors.password ? true : false}
                >
                  {errors.password}
                </HelperText>
              </View>
              {errorMessage && <ErrorText errorMessage={errorMessage} />}

              {isSubmittingApi ? (
                <ActivityIndicator animating={true} />
              ) : (
                <>
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
