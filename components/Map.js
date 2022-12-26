import React from "react"
// UI
import { View, StyleSheet } from "react-native"
// Other
import MapView from "react-native-maps"

export const Map = ({ allLocations }) => {
  console.log("all locations ", allLocations)

  return (
    <View style={styles.mapContainer}>
      <MapView style={styles.map} />
    </View>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    height: "50%",
    borderColor: "black",
    borderWidth: 1,
    marginVertical: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },
})
