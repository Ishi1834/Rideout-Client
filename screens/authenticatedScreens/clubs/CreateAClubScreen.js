import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
// UI
import { View, StyleSheet, ScrollView } from "react-native"
import {
  Button,
  HelperText,
  TextInput,
  ActivityIndicator,
} from "react-native-paper"
import { SummaryText } from "../../../components/SummaryText"
// Other
import { Formik } from "formik"
import { createAClubSchema } from "../../../static/validationSchema"
import { createAClubInitialValues } from "../../../static/formValues"
import axios from "../../../axiosConfig"

export const CreateAClubScreen = () => {
  const navigation = useNavigation()
  const [isSubmittingApi, setIsSubmittingApi] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")

  const createClubApiCall = async (data) => {
    setErrorMessage("")
    setIsSubmittingApi(true)

    try {
      const res = await axios.post("/clubs", data)
      if (res.status === 201) {
        navigation.navigate("MyClubs", {
          message: res?.data?.message,
        })
      }
    } catch (error) {
      setErrorMessage(error.response.data.message)
    }
    setIsSubmittingApi(false)
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Formik
          onSubmit={(values) => createClubApiCall(values)}
          initialValues={createAClubInitialValues}
          validationSchema={createAClubSchema}
        >
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            touched,
            values,
            errors,
          }) => (
            <View style={styles.form}>
              <View style={styles.formInputs}>
                <TextInput
                  label="Club Name"
                  value={values.clubName}
                  onChangeText={handleChange("clubName")}
                  onBlur={handleBlur("clubName")}
                  error={touched.clubName && errors.clubName}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={touched.clubName && errors.clubName ? true : false}
                >
                  {errors.clubName}
                </HelperText>
              </View>
              <View style={styles.formInputs}>
                <TextInput
                  label="City"
                  value={values.city}
                  onChangeText={handleChange("city")}
                  onBlur={handleBlur("city")}
                  error={touched.city && errors.city}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={touched.city && errors.city ? true : false}
                >
                  {errors.city}
                </HelperText>
              </View>
              <View style={styles.formInputs}>
                <TextInput
                  label="Club Location"
                  value={values.location}
                  onChangeText={handleChange("location")}
                  onBlur={handleBlur("location")}
                  error={touched.location && errors.location}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={touched.location && errors.location ? true : false}
                >
                  {errors.location}
                </HelperText>
              </View>

              {errorMessage && <SummaryText message={errorMessage} />}

              {isSubmittingApi ? (
                <ActivityIndicator animating={true} />
              ) : (
                <Button
                  style={styles.button}
                  mode="contained"
                  onPress={handleSubmit}
                >
                  Submit
                </Button>
              )}
            </View>
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
  form: {
    marginTop: 10,
  },
  formInputs: {
    marginBottom: 10,
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  dateButton: {
    width: "45%",
  },
  button: {
    marginTop: 10,
  },
})
