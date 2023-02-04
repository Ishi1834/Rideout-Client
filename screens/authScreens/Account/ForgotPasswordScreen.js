import { useState } from "react"
// UI
import { View, StyleSheet } from "react-native"
import { TextInput, Button, HelperText } from "react-native-paper"
// Other
import * as yup from "yup"
import { Formik } from "formik"
import axios from "../../../axiosConfig"
import { SummaryText } from "../../../components/SummaryText"

const usernameSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
})

export const ForgotPasswordScreen = ({ navigation }) => {
  const [isMakingApiRequest, setIsMakingApiRequest] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const sendPasswordResetEmail = async (values) => {
    setIsMakingApiRequest(true)
    const { username } = values
    setErrorMessage("")
    try {
      const res = await axios.post("/account/resetPassword", { username })
      if (res.status === 200) {
        navigation.navigate("ChangePassword")
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.message)
    }
    setIsMakingApiRequest(false)
  }

  return (
    <View style={styles.container}>
      <Formik
        onSubmit={(values) => sendPasswordResetEmail(values)}
        initialValues={{ username: "" }}
        validationSchema={usernameSchema}
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
            <TextInput
              label="Username"
              value={values.username}
              onChangeText={handleChange("username")}
              onBlur={handleBlur("username")}
              error={touched.username && errors.username}
              disabled={isMakingApiRequest && true}
            />
            <HelperText
              type="error"
              visible={touched.username && errors.username ? true : false}
            >
              {errors.username}
            </HelperText>
            {errorMessage && <SummaryText message={errorMessage} />}
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleSubmit}
                disabled={isMakingApiRequest && true}
                loading={isMakingApiRequest && true}
              >
                Reset password
              </Button>
            </View>
          </>
        )}
      </Formik>
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
