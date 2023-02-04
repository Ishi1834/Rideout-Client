import { useState } from "react"
// UI
import { View, StyleSheet } from "react-native"
import { TextInput, Button, HelperText } from "react-native-paper"
// Other
import * as yup from "yup"
import { Formik } from "formik"

const usernameSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
})

export const ForgotPasswordScreen = ({ navigation }) => {
  const [isMakingApiRequest, setIsMakingApiRequest] = useState(null)

  const sendPasswordResetEmail = async (values) => {
    const { username } = values
    navigation.navigate("ChangePassword")
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
            <View style={styles.buttonContainer}>
              <Button mode="contained" onPress={handleSubmit}>
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
