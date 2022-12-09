import { useContext, useState } from "react"
// UI
import { ScrollView, StyleSheet, View } from "react-native"
import { TextInput, Button, HelperText } from "react-native-paper"
// State
import { AuthContext } from "../../context/authContext"
// Other
import { Formik } from "formik"
import { signUpSchema } from "../../static/validationSchema"

export const SignUpScreen = () => {
  const { signUp } = useContext(AuthContext)

  return (
    <ScrollView>
      <View style={styles.container}>
        <Formik
          onSubmit={(values) => console.log(values)}
          initialValues={{}}
          validationSchema={signUpSchema}
        >
          {({ handleChange, handleSubmit, values, errors }) => (
            <>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Name"
                  value={values.name}
                  onChangeText={handleChange("name")}
                  error={errors.name}
                />
                <HelperText type="error" visible={errors.name}>
                  {errors.name}
                </HelperText>
              </View>
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
                  label="Email"
                  keyboardType="email-address"
                  value={values.email}
                  onChangeText={handleChange("email")}
                  error={errors.email}
                />
                <HelperText type="error" visible={errors.email}>
                  {errors.email}
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
              <View style={styles.inputContainer}>
                <TextInput
                  label="Confirm Password"
                  value={values.confirmPassword}
                  onChangeText={handleChange("confirmPassword")}
                  secureTextEntry
                  error={errors.confirmPassword}
                />
                <HelperText type="error" visible={errors.confirmPassword}>
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
