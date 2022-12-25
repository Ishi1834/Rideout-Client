import { useState } from "react"
// UI
import { View, StyleSheet, ScrollView } from "react-native"
import {
  Button,
  HelperText,
  TextInput,
  ActivityIndicator,
} from "react-native-paper"
import { RadioInput } from "../../../components/RadioInput"
import DateTimePicker from "@react-native-community/datetimepicker"
// Other
import { formatTime, formatDate } from "../../../utils/formatDate"
import { Formik } from "formik"
import { rideTypeArray } from "../../../static/multiSelectOptions"
import { rideSchema } from "../../../static/validationSchema"
import { createARideInitialValues } from "../../../static/formValues"
import axios from "../../../axiosConfig"
import { SummaryText } from "../../../components/SummaryText"

export const CreateARideScreen = ({ navigation, route }) => {
  const params = route.params
  const [isSubmittingApi, setIsSubmittingApi] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [mode, setMode] = useState("date")
  const [show, setShow] = useState(false)

  const createARideApiCall = async (data) => {
    setErrorMessage("")
    setIsSubmittingApi(true)
    const clubId = params?.clubId
    let endPoint = "/rides"
    if (clubId) {
      endPoint = `${endPoint}/${clubId}`
    }
    try {
      const res = await axios.post(endPoint, data)
      if (res.status === 201) {
        navigation.navigate("MyRides", { message: res?.data?.message })
      }
    } catch (error) {
      console.log("Error here ", error)
      setErrorMessage(error.response.data.message)
    }
    setIsSubmittingApi(false)
  }

  const showDatepicker = () => {
    setMode("date")
    setShow(true)
  }

  const showTimepicker = () => {
    setMode("time")
    setShow(true)
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Formik
          onSubmit={(values) => createARideApiCall(values)}
          initialValues={createARideInitialValues}
          validationSchema={rideSchema}
        >
          {({
            handleChange,
            handleSubmit,
            handleBlur,
            touched,
            values,
            errors,
            setFieldValue,
          }) => (
            <View style={styles.form}>
              <View style={styles.formInputs}>
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
              <View style={styles.formInputs}>
                <TextInput
                  label="Description"
                  value={values.description}
                  onChangeText={handleChange("description")}
                  onBlur={handleBlur("description")}
                  error={touched.description && errors.description}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={
                    touched.description && errors.description ? true : false
                  }
                >
                  {errors.description}
                </HelperText>
              </View>
              <View style={[styles.formInputs, styles.dateContainer]}>
                <Button
                  mode="contained"
                  style={styles.dateButton}
                  onPress={showDatepicker}
                  icon="calendar-outline"
                  disabled={isSubmittingApi && true}
                >
                  {formatDate(values.date)}
                </Button>
                <Button
                  mode="contained"
                  style={styles.dateButton}
                  onPress={showTimepicker}
                  icon="calendar-clock-outline"
                  disabled={isSubmittingApi && true}
                >
                  {formatTime(values.date)}
                </Button>
              </View>
              {show && (
                <DateTimePicker
                  value={values.date}
                  mode={mode}
                  is24Hour={true}
                  onChange={(e, date) => {
                    setShow(false)
                    setFieldValue("date", date)
                  }}
                />
              )}
              <View style={styles.formInputs}>
                <RadioInput
                  radioData={rideTypeArray}
                  radioLabel="Select Ride Type"
                  itemSelected={handleChange("rideType")}
                  onBlur={handleBlur("rideType")}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={touched.rideType && errors.rideType ? true : false}
                >
                  {errors.rideType}
                </HelperText>
              </View>
              <View style={styles.formInputs}>
                <TextInput
                  label="Start Location"
                  value={values.startLocation}
                  onChangeText={handleChange("startLocation")}
                  onBlur={handleBlur("startLocation")}
                  error={touched.startLocation && errors.startLocation}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={
                    touched.startLocation && errors.startLocation ? true : false
                  }
                >
                  {errors.startLocation}
                </HelperText>
              </View>
              <View style={styles.formInputs}>
                <TextInput
                  keyboardType="number-pad"
                  label="Distance"
                  value={values.distance}
                  onChangeText={handleChange("distance")}
                  onBlur={handleBlur("distance")}
                  error={touched.distance && errors.distance}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={touched.distance && errors.distance ? true : false}
                >
                  {errors.distance}
                </HelperText>
              </View>
              <View style={styles.formInputs}>
                <TextInput
                  keyboardType="number-pad"
                  label="Speed"
                  value={values.speed}
                  onChangeText={handleChange("speed")}
                  onBlur={handleBlur("speed")}
                  error={touched.speed && errors.speed}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={touched.speed && errors.speed ? true : false}
                >
                  {errors.speed}
                </HelperText>
              </View>
              <View style={styles.formInputs}>
                <TextInput
                  label="Cafe Stops"
                  value={values.cafeStops}
                  onChangeText={handleChange("cafeStops")}
                  onBlur={handleBlur("cafeStops")}
                  error={touched.cafeStops && errors.cafeStops}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={touched.cafeStops && errors.cafeStops ? true : false}
                >
                  {errors.cafeStops}
                </HelperText>
              </View>
              <View style={styles.formInputs}>
                <TextInput
                  label="Route"
                  value={values.route}
                  onChangeText={handleChange("route")}
                  onBlur={handleBlur("route")}
                  error={touched.route && errors.route}
                  disabled={isSubmittingApi && true}
                />
                <HelperText
                  type="error"
                  visible={touched.route && errors.route ? true : false}
                >
                  {errors.route}
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
