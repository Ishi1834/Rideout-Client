import React, { useEffect, useState } from "react"
// UI
import { View, StyleSheet } from "react-native"
import { SummaryText } from "./SummaryText"
// Other
import MapView from "react-native-maps"
import * as Location from "expo-location"
import { Banner } from "./Banner"

export const Map = ({ allLocations }) => {
  const [userLocation, setUserLocation] = useState(null)
  const [mapRegion, setMapRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    requestLocationAccess()
  }, [])

  const requestLocationAccess = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== "granted") {
      setErrorMessage("Permission to access location was denied")
      return
    }

    let location = await Location.getCurrentPositionAsync({})

    setUserLocation(location.coords)
    setMapRegion(location.coords)
  }

  return (
    <View style={styles.mapContainer}>
      {errorMessage && (
        <Banner
          info={errorMessage}
          actions={[
            {
              label: "Get location",
            },
          ]}
          buttonClicked={requestLocationAccess}
        />
      )}
      <View style={styles.mapView}>
        <MapView
          style={styles.map}
          region={mapRegion}
          onRegionChange={(region) => setMapRegion(region)}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    height: "50%",
    marginVertical: 10,
  },
  mapView: {
    borderColor: "black",
    borderWidth: 1,
    marginTop: 5,
  },
  map: {
    width: "100%",
    height: "100%",
  },
})
