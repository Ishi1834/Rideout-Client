import { useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { Button, Text, TextInput } from "react-native-paper"
import { RadioInput } from "../../../components/RadioInput"

export const CreateARideScreen = () => {
  const [rideData, setRideData] = useState({
    date: "",
    name: "",
    rideType: "",
    startLocation: [],
    distance: null,
    speed: null,
    description: "",
    cafeStops: "",
  })
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
              label="Date"
              value={rideData.date}
              onChangeText={(text) => setRideData({ ...rideData, date: text })}
            />
          </View>
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
              label="Distance"
              value={rideData.distance}
              onChangeText={(text) =>
                setRideData({ ...rideData, distance: text })
              }
            />
          </View>
          <View style={styles.formInputs}>
            <TextInput
              label="Speed"
              value={rideData.speed}
              onChangeText={(text) => setRideData({ ...rideData, speed: text })}
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
          <View style={styles.formInputs}>
            <TextInput
              label="Cafe Stops"
              value={rideData.cafeStops}
              onChangeText={(text) =>
                setRideData({ ...rideData, cafeStops: text })
              }
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
  button: {
    marginTop: 10,
  },
})
