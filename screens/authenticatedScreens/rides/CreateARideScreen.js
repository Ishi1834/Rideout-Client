import { useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"
import { RadioInput } from "../../../components/RadioInput"
import DateTimePicker from "@react-native-community/datetimepicker"
import { formatTime, formatDate } from "../../../utils/formatDate"

export const CreateARideScreen = () => {
  const [mode, setMode] = useState("date")
  const [show, setShow] = useState(true)
  const [rideData, setRideData] = useState({
    date: new Date(),
    name: "",
    rideType: "",
    startLocation: [],
    distance: null,
    speed: null,
    description: "",
    cafeStops: "",
    route: "",
  })

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate
    setShow(false)
    setRideData({ ...rideData, date: currentDate })
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
        <Text style={styles.title} variant="headlineLarge">
          Create a Ride
        </Text>
        <View style={styles.form}>
          <View style={styles.formInputs}>
            <TextInput
              label="Name"
              value={rideData.name}
              onChangeText={(text) => setRideData({ ...rideData, name: text })}
            />
          </View>
          <View style={styles.formInputs}>
            <TextInput
              label="Description"
              value={rideData.description}
              onChangeText={(text) =>
                setRideData({ ...rideData, description: text })
              }
            />
          </View>
          <View style={[styles.formInputs, styles.dateContainer]}>
            <Button
              mode="contained"
              style={styles.dateButton}
              onPress={showDatepicker}
              icon="calendar-outline"
            >
              {formatDate(rideData.date)}
            </Button>
            <Button
              mode="contained"
              style={styles.dateButton}
              onPress={showTimepicker}
              icon="calendar-clock-outline"
            >
              {formatTime(rideData.date)}
            </Button>
          </View>
          {show && (
            <DateTimePicker
              value={rideData.date}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}
          <View style={styles.formInputs}>
            <RadioInput
              radioData={["Training", "Casual"]}
              radioLabel="Select Ride Type"
              itemSelected={(item) =>
                setRideData({ ...rideData, rideType: item })
              }
            />
          </View>
          <View style={styles.formInputs}>
            <TextInput
              label="Start Location"
              value={rideData.startLocation}
              onChangeText={(text) =>
                setRideData({ ...rideData, startLocation: text })
              }
            />
          </View>
          <View style={styles.formInputs}>
            <TextInput
              keyboardType="number-pad"
              label="Distance"
              value={rideData.distance}
              onChangeText={(text) =>
                setRideData({ ...rideData, distance: text })
              }
            />
          </View>
          <View style={styles.formInputs}>
            <TextInput
              keyboardType="number-pad"
              label="Speed"
              value={rideData.speed}
              onChangeText={(text) => setRideData({ ...rideData, speed: text })}
            />
          </View>
          <View style={styles.formInputs}>
            <TextInput
              label="Cafe Stops"
              value={rideData.cafeStops}
              onChangeText={(text) =>
                setRideData({ ...rideData, cafeStops: text })
              }
            />
          </View>
          <View style={styles.formInputs}>
            <TextInput
              label="Route"
              value={rideData.route}
              onChangeText={(text) => setRideData({ ...rideData, route: text })}
            />
          </View>
        </View>
        <Button
          style={styles.button}
          mode="contained"
          onPress={() => console.log("submit")}
        >
          Submit
        </Button>
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
