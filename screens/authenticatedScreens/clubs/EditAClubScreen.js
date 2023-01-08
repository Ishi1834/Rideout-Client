import { useEffect, useState } from "react"
// UI
import { View, StyleSheet, ScrollView } from "react-native"
import {
  Button,
  HelperText,
  Text,
  ActivityIndicator,
  Portal,
  Modal,
} from "react-native-paper"
import { SummaryText } from "../../../components/SummaryText"
import { Checkbox } from "../../../components/Checkbox"
// State
import { useDispatch } from "react-redux"
import { addAClub } from "../../../state/clubsSlice"
// Other
import { Formik } from "formik"
import { createAClubSchema } from "../../../static/validationSchema"
import { createAClubInitialValues } from "../../../static/formValues"
import axios from "../../../axiosConfig"
import { DropPinMap } from "../../../components/DropPinMap"
import { clubTags } from "../../../static/multiSelectOptions"
import { PreviewMap } from "../../../components/PreviewMap"

export const EditAClubScreen = ({ navigation, route }) => {
  const params = route.params
  const [isSubmittingApi, setIsSubmittingApi] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [showMap, setShowMap] = useState(false)

  /* const createClubApiCall = async (data) => {
    setErrorMessage("")
    setIsSubmittingApi(true)

    try {
      const res = await axios.post("/clubs", data)
      if (res.status === 201) {
        dispatch(addAClub(res.data.club))
        navigation.navigate("MyClubs", {
          message: res?.data?.message,
        })
      }
    } catch (error) {
      console.log("Error - CreateAClubScreen.js")
      setErrorMessage(error.response.data.message)
    }
    setIsSubmittingApi(false)
  } */

  const checkIsChecked = (array, tag) => {
    const isChecked = array.find((val) => val === tag)
    if (!isChecked) {
      return false
    }
    return true
  }
  return (
    <Formik
      onSubmit={(values) => console.log("submittted ", values)}
      initialValues={{
        ...params?.club,
        clubName: params?.club?.name,
        location: params?.club?.location?.coordinates,
      }}
      //validationSchema={createAClubSchema}
    >
      {({
        handleChange,
        handleSubmit,
        handleBlur,
        setFieldValue,
        touched,
        values,
        errors,
      }) =>
        showMap ? (
          <Portal>
            <Modal
              visible={showMap}
              contentContainerStyle={styles.mapModal}
              onDismiss={() => setShowMap(false)}
              dismissable={true}
            >
              <DropPinMap
                onSelectLocation={(location) => {
                  setFieldValue("location", [
                    location.longitude,
                    location.latitude,
                  ])
                  setShowMap(false)
                }}
                preselectedLocation={values?.location}
              />
            </Modal>
          </Portal>
        ) : (
          <ScrollView>
            <View style={styles.container}>
              <View style={styles.formInputs}>
                <Text style={styles.tagLabel} variant="titleMedium">
                  Select the tags which describe your club
                </Text>
                <View style={styles.tagContainer}>
                  {clubTags.map((currentTag, index) => {
                    return (
                      <Checkbox
                        key={index}
                        label={currentTag}
                        isChecked={checkIsChecked(values?.tags, currentTag)}
                        handleCheckChange={(val) => {
                          if (!val) {
                            const tagsArray = values.tags.filter((val) => {
                              if (val !== currentTag) {
                                return val
                              }
                            })
                            setFieldValue("tags", tagsArray)
                          } else {
                            const tagsArray = [...values.tags, currentTag]
                            setFieldValue("tags", tagsArray)
                          }
                        }}
                      />
                    )
                  })}
                </View>
              </View>
              <View style={styles.previewMapContainer}>
                <PreviewMap location={params?.club?.location?.coordinates} />
              </View>
              <View style={styles.formInputs}>
                <Button
                  mode="contained-tonal"
                  onPress={() => {
                    setShowMap(true)
                  }}
                  disabled={isSubmittingApi && true}
                >
                  Change club location
                </Button>
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
          </ScrollView>
        )
      }
    </Formik>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  previewMapContainer: {
    height: 300,
    borderColor: "black",
    borderWidth: 1,
    marginVertical: 10,
  },
  mapModal: {
    height: 500,
    padding: 10,
  },
  formInputs: {
    marginBottom: 10,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tagLabel: {
    textAlign: "center",
  },
  button: {
    marginTop: 10,
  },
})
