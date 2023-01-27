import { useEffect, useState } from "react"
import * as SecureStore from "expo-secure-store"
// UI
import { ScrollView, StyleSheet, View } from "react-native"
import {
  TextInput,
  Button,
  HelperText,
  ActivityIndicator,
} from "react-native-paper"
import { SummaryText } from "../../components/SummaryText"
// State
import { useDispatch } from "react-redux"
import { signIn } from "../../state/authSlice"
// Other
import { Formik } from "formik"
import { signInSchema } from "../../static/validationSchema"
import { signInInitialValues } from "../../static/formValues"
import axios from "../../axiosConfig"
import { capitalizeFirstLetter } from "../../utils/generalUtils"

export const SignInScreen = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const [errorMessage, setErrorMessage] = useState("")
  const [isSubmittingApi, setIsSubmittingApi] = useState(false)
  const params = route.params

  useEffect(() => {
    setErrorMessage("")
  }, [params?.hasRegistered, params?.message])

  const loginApiCall = async (data) => {
    setIsSubmittingApi(true)
    setErrorMessage("")
    try {
      const res = await axios.post("/auth", data)
      if (res?.data?.authToken) {
        await SecureStore.setItemAsync("refreshToken", res?.data?.refreshToken)
        dispatch(
          signIn({
            authToken: res?.data?.authToken,
            userId: res?.data?.userId,
          })
        )
      }
    } catch (error) {
      console.log("Error - SignInScreen.js")
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
                {params?.hasRegistered && (
                  <SummaryText isInfo={true} message={params?.message} />
                )}

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
              {errorMessage && <SummaryText message={errorMessage} />}

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
