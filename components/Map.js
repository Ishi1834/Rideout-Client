import React, { useEffect, useState } from "react"
// UI
import { View, StyleSheet } from "react-native"
// Other
import MapView, { Marker } from "react-native-maps"

export const Map = ({
  allLocations,
  showMap,
  userLocation,
  userHasSelectedLocation = false,
}) => {
  const [mapRegion, setMapRegion] = useState(null)

  useEffect(() => {
    if (userLocation) {
      setMapRegion(userLocation)
    }
  }, [userLocation?.latitude, userLocation?.longitude])

  return (
    <View style={showMap ? styles.mapContainer : styles.mapHiddenContainer}>
      {showMap && (
        <View style={styles.mapView}>
          <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={(region) => setMapRegion(region)}
            zoomEnabled={true}
            zoomControlEnabled={true}
            showsUserLocation={userHasSelectedLocation ? false : true}
            loadingEnabled={true}
          >
            {userHasSelectedLocation && (
              <Marker coordinate={userLocation} pinColor={"green"} />
            )}

            {allLocations &&
              allLocations.map((ride, index) => (
                <Marker
                  key={index}
                  coordinate={{
                    longitude: ride.location[0],
                    latitude: ride.location[1],
                  }}
                  title={ride.name}
                />
              ))}
          </MapView>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  mapContainer: {
    height: "50%",
    marginVertical: 10,
  },
  mapHiddenContainer: {
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
