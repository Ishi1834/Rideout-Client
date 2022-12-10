import { useState } from "react"
// UI
import { View, StyleSheet, ScrollView } from "react-native"
import { Button, HelperText, Text, TextInput } from "react-native-paper"
import { RadioInput } from "../../../components/RadioInput"
import DateTimePicker from "@react-native-community/datetimepicker"
// Other
import { formatTime, formatDate } from "../../../utils/formatDate"
import { Formik } from "formik"
import { rideTypeArray } from "../../../static/multiSelectOptions"
import { rideSchema } from "../../../static/validationSchema"

export const CreateARideScreen = () => {
  const [mode, setMode] = useState("date")
  const [show, setShow] = useState(false)

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
        <Text style={styles.title} variant="headlineLarge">
          Create a Ride
        </Text>
        <Formik
          onSubmit={(values) => console.log(values)}
          initialValues={{ date: new Date() }}
          validationSchema={rideSchema}
        >
          {({ handleChange, handleSubmit, values, errors, setFieldValue }) => (
            <View style={styles.form}>
              <View style={styles.formInputs}>
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
              <View style={styles.formInputs}>
                <TextInput
                  label="Description"
                  value={values.description}
                  onChangeText={handleChange("description")}
                  error={errors.description}
                />
                <HelperText type="error" visible={errors.description}>
                  {errors.description}
                </HelperText>
              </View>
              <View style={[styles.formInputs, styles.dateContainer]}>
                <Button
                  mode="contained"
                  style={styles.dateButton}
                  onPress={showDatepicker}
                  icon="calendar-outline"
                >
                  {formatDate(values.date)}
                </Button>
                <Button
                  mode="contained"
                  style={styles.dateButton}
                  onPress={showTimepicker}
                  icon="calendar-clock-outline"
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
                />
                <HelperText type="error" visible={errors.rideType}>
                  {errors.rideType}
                </HelperText>
              </View>
              <View style={styles.formInputs}>
                <TextInput
                  label="Start Location"
                  value={values.startLocation}
                  onChangeText={handleChange("startLocation")}
                  error={errors.startLocation}
                />
                <HelperText type="error" visible={errors.startLocation}>
                  {errors.startLocation}
                </HelperText>
              </View>
              <View style={styles.formInputs}>
                <TextInput
                  keyboardType="number-pad"
                  label="Distance"
                  value={values.distance}
                  onChangeText={handleChange("distance")}
                  error={errors.distance}
                />
                <HelperText type="error" visible={errors.distance}>
                  {errors.distance}
                </HelperText>
              </View>
              <View style={styles.formInputs}>
                <TextInput
                  keyboardType="number-pad"
                  label="Speed"
                  value={values.speed}
                  onChangeText={handleChange("speed")}
                  error={errors.speed}
                />
                <HelperText type="error" visible={errors.speed}>
                  {errors.speed}
                </HelperText>
              </View>
              <View style={styles.formInputs}>
                <TextInput
                  label="Cafe Stops"
                  value={values.cafeStops}
                  onChangeText={handleChange("cafeStops")}
                  error={errors.cafeStops}
                />
                <HelperText type="error" visible={errors.cafeStops}>
                  {errors.cafeStops}
                </HelperText>
              </View>
              <View style={styles.formInputs}>
                <TextInput
                  label="Route"
                  value={values.route}
                  onChangeText={handleChange("route")}
                  error={errors.route}
                />
                <HelperText type="error" visible={errors.route}>
                  {errors.route}
                </HelperText>
              </View>
              <Button
                style={styles.button}
                mode="contained"
                onPress={handleSubmit}
              >
                Submit
              </Button>
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
  title: {
    textAlign: "center",
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
