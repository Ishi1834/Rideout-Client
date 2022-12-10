import { useContext, useState } from "react"
// UI
import { ScrollView, StyleSheet, View } from "react-native"
import { TextInput, Button, HelperText } from "react-native-paper"
// State
import { AuthContext } from "../../context/authContext"
// Other
import { Formik } from "formik"
import { signUpSchema } from "../../static/validationSchema"
import { signUpInitialValues } from "../../static/formValues"

export const SignUpScreen = () => {
  const { signUp } = useContext(AuthContext)

  return (
    <ScrollView>
      <View style={styles.container}>
        <Formik
          onSubmit={(values) => console.log(values)}
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
              <View style={styles.buttonContainer}>
                <Button mode="contained" onPress={handleSubmit}>
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
    paddingVertical: 25,
  },
})
