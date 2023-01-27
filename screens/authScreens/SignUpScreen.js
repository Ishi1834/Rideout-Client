import { useState } from "react"
// UI
import { ScrollView, StyleSheet, View } from "react-native"
import {
  TextInput,
  Button,
  HelperText,
  ActivityIndicator,
} from "react-native-paper"
import { SummaryText } from "../../components/SummaryText"
// Other
import { Formik } from "formik"
import { signUpSchema } from "../../static/validationSchema"
import { signUpInitialValues } from "../../static/formValues"
import axios from "../../axiosConfig"
import { capitalizeFirstLetter } from "../../utils/generalUtils"

export const SignUpScreen = ({ navigation }) => {
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmittingApi, setIsSubmittingApi] = useState(false)

  const signupApiCall = async (data) => {
    setIsSubmittingApi(true)
    setErrorMessage("")
    try {
      const res = await axios.post("/users", data)
      navigation.navigate("SignIn", {
        hasRegistered: true,
        message: res?.data?.message,
      })
    } catch (error) {
      console.log("Error - SignUpScreen.js")
      if (error.response) {
        setErrorMessage(capitalizeFirstLetter(error?.response?.data?.message))
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
          onSubmit={(values) => signupApiCall(values)}
          initialValues={signUpInitialValues}
          validationSchema={signUpSchema}
        >
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            touched,
            values,
            errors,
          }) => (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Name"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  error={touched.name && errors.name}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={touched.name && errors.name ? true : false}
                >
                  {errors.name}
                </HelperText>
              </View>
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
                  label="Email"
                  keyboardType="email-address"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  error={touched.email && errors.email}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={touched.email && errors.email ? true : false}
                >
                  {errors.email}
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
              <View style={styles.inputContainer}>
                <TextInput
                  label="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  secureTextEntry
                  onBlur={handleBlur("confirmPassword")}
                  error={touched.confirmPassword && errors.confirmPassword}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={
                    touched.confirmPassword && errors.confirmPassword
                      ? true
                      : false
                  }
                >
                  {errors.confirmPassword}
                </HelperText>
              </View>

              {errorMessage && <SummaryText message={errorMessage} />}

              {isSubmittingApi ? (
                <ActivityIndicator animating={true} />
              ) : (
                <View style={styles.buttonContainer}>
                  <Button mode="contained" onPress={handleSubmit}>
                    Sign up
                  </Button>
                </View>
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
    paddingVertical: 25,
  },
  success: {
    fontSize: 16,
    textAlign: "center",
    color: "green",
  },
})
