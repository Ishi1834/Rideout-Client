import { useState } from "react"
// UI
import { View, StyleSheet } from "react-native"
import { Button, HelperText, TextInput } from "react-native-paper"
// Other
import { Formik } from "formik"
import { changePasswordInitialValues } from "../../../static/formValues"
import { changePasswordSchema } from "../../../static/validationSchema"

export const ChangePasswordScreen = () => {
  const [isMakingApiRequest, setIsMakingApiRequest] = useState(false)

  const changePasswordRequest = async (values) => {
    console.log("values ", values)
  }
  console.log("re-render")
  return (
    <Formik
      onSubmit={(values) => changePasswordRequest(values)}
      initialValues={changePasswordInitialValues}
      validationSchema={changePasswordSchema}
    >
      {({
        handleChange,
        handleSubmit,
        handleBlur,
        values,
        errors,
        touched,
        setFieldValue,
      }) => (
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              label="Password"
              value={values.password}
              onChangeText={handleChange("password")}
              secureTextEntry
              onBlur={handleBlur("password")}
              error={touched.password && errors.password}
              disabled={isMakingApiRequest && true}
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
              label="New Password"
              value={values.newPassword}
              onChangeText={handleChange("newPassword")}
              secureTextEntry
              onBlur={handleBlur("newPassword")}
              error={touched.newPassword && errors.newPassword}
              disabled={isMakingApiRequest && true}
            />
            <HelperText
              type="error"
              visible={touched.newPassword && errors.newPassword ? true : false}
            >
              {errors.newPassword}
            </HelperText>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              label="Confirm New Password"
              value={values.confirmNewPassword}
              onChangeText={handleChange("confirmNewPassword")}
              secureTextEntry
              onBlur={handleBlur("confirmNewPassword")}
              error={touched.confirmNewPassword && errors.confirmNewPassword}
              disabled={isMakingApiRequest && true}
            />
            <HelperText
              type="error"
              visible={
                touched.confirmNewPassword && errors.confirmNewPassword
                  ? true
                  : false
              }
            >
              {errors.confirmNewPassword}
            </HelperText>
          </View>
          <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={() => handleSubmit()}>
              Submit
            </Button>
          </View>
        </View>
      )}
    </Formik>
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
