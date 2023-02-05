import { useState } from "react"
// UI
import { View, StyleSheet } from "react-native"
import { Button, HelperText, TextInput } from "react-native-paper"
// Other
import { Formik } from "formik"
import { changePasswordInitialValues } from "../../../static/formValues"
import { changePasswordSchema } from "../../../static/validationSchema"
import axios from "../../../axiosConfig"
import { SummaryText } from "../../../components/SummaryText"

export const ChangePasswordScreen = ({ navigation }) => {
  const [isMakingApiRequest, setIsMakingApiRequest] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  const changePasswordRequest = async (values) => {
    setIsMakingApiRequest(true)
    setErrorMessage("")
    setSuccessMessage("")
    try {
      const res = await axios.post("/account/changePassword", values)
      if (res.status === 200) {
        setSuccessMessage(res.data.message)
        setTimeout(() => {
          navigation.goBack()
        }, 2000)
      }
    } catch (error) {
      setErrorMessage(error?.response?.data?.message)
    }
    setIsMakingApiRequest(false)
  }

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
          {errorMessage && <SummaryText message={errorMessage} />}
          {successMessage && (
            <SummaryText message={successMessage} isInfo={true} />
          )}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => handleSubmit()}
              disabled={isMakingApiRequest && true}
              loading={isMakingApiRequest && true}
            >
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
