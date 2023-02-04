import { useState } from "react"
// UI
import { View, StyleSheet, ScrollView } from "react-native"
import {
  Button,
  HelperText,
  TextInput,
  ActivityIndicator,
  Portal,
  Modal,
} from "react-native-paper"
import { RadioInput } from "../../../components/RadioInput"
import DateTimePicker from "@react-native-community/datetimepicker"
import { SummaryText } from "../../../components/SummaryText"
import { DropPinMap } from "../../../components/DropPinMap"
// State
import { useDispatch, useSelector } from "react-redux"
import { addAClubRide, addAUserRide } from "../../../state/ridesSlice"
// Other
import { formatTime, formatDate } from "../../../utils/formatDate"
import { Formik } from "formik"
import { rideTypeArray } from "../../../static/multiSelectOptions"
import { rideSchema } from "../../../static/validationSchema"
import { createARideInitialValues } from "../../../static/formValues"
import axios from "../../../axiosConfig"
import { NumberSelector } from "../../../components/NumberSelector"
import { PreviewMap } from "../../../components/PreviewMap"
import { EmailNotVerifiedModal } from "../../../components/EmailNotVerifiedModal"

export const CreateARideScreen = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const emailVerified = useSelector((state) => state.user.emailVerified)
  const params = route.params
  const [isSubmittingApi, setIsSubmittingApi] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [mode, setMode] = useState("date")
  const [datepickerShow, setDatepickerShow] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [routeMapPolyline, setRouteMapPolyline] = useState(null)

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
        const ride = res.data.ride
        dispatch(addAUserRide(ride))
        if (ride?.club) {
          dispatch(addAClubRide(ride))
        }
        navigation.navigate("MyRides", { message: res?.data?.message })
      }
    } catch (error) {
      console.log("Error - CreateARideScreen.js")
      setErrorMessage(error.response.data.message)
    }
    setIsSubmittingApi(false)
  }

  const showDatepicker = () => {
    setMode("date")
    setDatepickerShow(true)
  }

  const showTimepicker = () => {
    setMode("time")
    setDatepickerShow(true)
  }

  const postRoute = async (routeURL) => {
    if (!routeURL.startsWith("https://www.strava.com/routes/")) {
      return
    }
    setIsSubmittingApi(true)
    try {
      const res = await axios.post(`/mapRoute`, { routeURL })
      setRouteMapPolyline(res?.data?.polyline)
    } catch (error) {
      setRouteMapPolyline(null)
    }
    setIsSubmittingApi(false)
  }

  return (
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
        <ScrollView>
          <View style={styles.container}>
            {showMap && (
              <Portal>
                <Modal
                  visible={showMap}
                  style={styles.mapContainer}
                  contentContainerStyle={styles.mapModal}
                  onDismiss={() => setShowMap(false)}
                  dismissable={true}
                >
                  <DropPinMap
                    onSelectLocation={(location) => {
                      setFieldValue("startLocation", [
                        location.longitude,
                        location.latitude,
                      ])
                      setShowMap(false)
                    }}
                    preselectedLocation={values?.startLocation}
                  />
                </Modal>
              </Portal>
            )}
            <EmailNotVerifiedModal
              modalDismissable={false}
              emailVerified={emailVerified}
              handleDismiss={() => navigation.goBack()}
            />
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
                {touched.name && errors.name && (
                  <HelperText type="error" visible={true}>
                    {errors.name}
                  </HelperText>
                )}
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
                {touched.description && errors.description && (
                  <HelperText type="error" visible={true}>
                    {errors.description}
                  </HelperText>
                )}
              </View>
              <View style={[styles.formInputs, styles.dateContainer]}>
                <Button
                  mode="contained-tonal"
                  onPress={showDatepicker}
                  icon="calendar-outline"
                  disabled={isSubmittingApi && true}
                >
                  {formatDate(values.date)}
                </Button>
                <Button
                  mode="contained-tonal"
                  onPress={showTimepicker}
                  icon="calendar-clock-outline"
                  disabled={isSubmittingApi && true}
                >
                  {formatTime(values.date)}
                </Button>
              </View>
              {datepickerShow && (
                <DateTimePicker
                  value={values.date}
                  mode={mode}
                  is24Hour={true}
                  onChange={(e, date) => {
                    setDatepickerShow(false)
                    setFieldValue("date", date)
                  }}
                />
              )}
              <View style={styles.formInputs}>
                <RadioInput
                  radioData={rideTypeArray}
                  radioLabel="Select Ride Type"
                  itemSelected={(item) => setFieldValue("rideType", item)}
                  onBlur={handleBlur("rideType")}
                  disabled={isSubmittingApi && true}
                />
                {touched.rideType && errors.rideType && (
                  <HelperText type="error" visible={true}>
                    {errors.rideType}
                  </HelperText>
                )}
              </View>
              <View style={styles.formInputs}>
                <Button
                  mode="contained-tonal"
                  onPress={() => {
                    setShowMap(true)
                  }}
                  disabled={isSubmittingApi && true}
                >
                  View or Select start Location on Map
                </Button>
                {touched.startLocation && errors.startLocation && (
                  <HelperText type="error" visible={true}>
                    {errors.startLocation}
                  </HelperText>
                )}
              </View>
              <View style={styles.numberSelectors}>
                <NumberSelector
                  max={500}
                  min={0}
                  noValadationRequired={true}
                  label="Distance km"
                  initialNumber={values.distance}
                  disabled={isSubmittingApi && true}
                  error={touched.distance && errors.distance}
                  handleNumberChange={(number) =>
                    setFieldValue("distance", number)
                  }
                />
                <NumberSelector
                  max={60}
                  min={0}
                  noValadationRequired={true}
                  label="Speed km/h"
                  initialNumber={values.speed}
                  disabled={isSubmittingApi && true}
                  error={touched.speed && errors.speed}
                  handleNumberChange={(number) =>
                    setFieldValue("speed", number)
                  }
                />
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
                {touched.cafeStops && errors.cafeStops && (
                  <HelperText type="error" visible={true}>
                    {errors.cafeStops}
                  </HelperText>
                )}
              </View>
              <View style={styles.formInputs}>
                {routeMapPolyline && (
                  <View style={styles.routeMapContainer}>
                    <PreviewMap
                      routeMapPolyline={routeMapPolyline}
                      showMapRoute={true}
                    />
                  </View>
                )}
                <TextInput
                  label="Route"
                  value={values.route}
                  onChangeText={(value) => {
                    postRoute(value)
                    setFieldValue("route", value)
                  }}
                  onBlur={handleBlur("route")}
                  error={touched.route && errors.route}
                  disabled={isSubmittingApi && true}
                />
                {touched.route && errors.route && (
                  <HelperText type="error" visible={true}>
                    {errors.route}
                  </HelperText>
                )}
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
          </View>
        </ScrollView>
      )}
    </Formik>
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
  numberSelectors: {
    marginBottom: 10,
    marginHorizontal: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  mapContainer: {
    marginTop: 150,
    marginBottom: 150,
    marginHorizontal: 10,
  },
  routeMapContainer: {
    height: 300,
    borderColor: "black",
    borderWidth: 1,
  },
  mapModal: {
    height: "100%",
    padding: 5,
  },
  button: {
    marginTop: 10,
  },
})
