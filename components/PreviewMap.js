import { useEffect, useRef } from "react"
import { View, StyleSheet, Platform } from "react-native"
// Other
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"

export const PreviewMap = ({ location, routeMapPolyline, showRoute }) => {
  const [longitude, latitude] = location

  const mapRef = useRef()

  useEffect(() => {
    if (routeMapPolyline) {
      mapRef.current.fitToCoordinates(routeMapPolyline, {
        edgePadding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        },
      })
    }
  }, [routeMapPolyline])

  return (
    <View style={styles.container}>
      {Platform.OS === "android" ? (
        <MapView
          style={styles.map}
          region={{
            latitude,
            longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          provider={PROVIDER_GOOGLE}
        >
          <Marker coordinate={{ latitude, longitude }} />
        </MapView>
      ) : (
        <MapView style={styles.map} ref={mapRef}>
          {routeMapPolyline ? (
            <Polyline
              coordinates={routeMapPolyline}
              strokeColor="#000" // fallback for when `strokeColors` is not supported by the map-provider
              strokeColors={[
                "#7F0000",
                "#00000000", // no color, creates a "long" gradient between the previous and next coordinate
                "#B24112",
                "#E5845C",
                "#238C23",
                "#7F0000",
              ]}
              strokeWidth={6}
            />
          ) : (
            <Marker coordinate={{ latitude, longitude }} />
          )}
        </MapView>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
})
