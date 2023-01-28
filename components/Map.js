import React, { useEffect, useState } from "react"
// UI
import { View, StyleSheet, Platform } from "react-native"
// Other
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"

export const Map = ({
  allLocations,
  handleTouch,
  userLocation,
  userHasSelectedLocation = false,
  fullScreenMap = false,
}) => {
  const [mapRegion, setMapRegion] = useState(null)

  useEffect(() => {
    if (userLocation) {
      setMapRegion(userLocation)
    }
  }, [userLocation?.latitude, userLocation?.longitude])

  return (
    <View
      style={
        fullScreenMap
          ? styles.mapFullScreenContainer
          : styles.mapDefaultContainer
      }
      onTouchStart={handleTouch}
    >
      <View style={!fullScreenMap && styles.mapDefaultView}>
        {Platform.OS === "android" ? (
          <MapView
            style={styles.map}
            region={mapRegion}
            onRegionChangeComplete={(region) => setMapRegion(region)}
            zoomEnabled={true}
            zoomControlEnabled={true}
            showsUserLocation={userHasSelectedLocation ? false : true}
            loadingEnabled={true}
            provider={PROVIDER_GOOGLE}
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
        ) : (
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
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  mapDefaultContainer: {
    height: "50%",
    marginVertical: 10,
  },
  mapFullScreenContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
  },
  mapDefaultView: {
    borderColor: "black",
    borderWidth: 1,
    marginTop: 5,
  },
  map: {
    width: "100%",
    height: "100%",
  },
})
