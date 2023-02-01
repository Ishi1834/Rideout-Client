import { useEffect, useRef } from "react"
// UI
import { View, StyleSheet, Platform } from "react-native"
// Other
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps"

export const PreviewMap = ({
  location,
  routeMapPolyline,
  showMapRoute = false,
}) => {
  const [longitude, latitude] = location

  const mapRef = useRef()

  useEffect(() => {
    if (routeMapPolyline && showMapRoute) {
      mapRef.current.fitToCoordinates(routeMapPolyline, {
        edgePadding: {
          top: 20,
          right: 20,
          bottom: 20,
          left: 20,
        },
      })
    } else if (!showMapRoute) {
      mapRef.current.animateToRegion(
        {
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        },
        1000
      )
    }
  }, [showMapRoute, location])

  return (
    <View style={styles.container}>
      {Platform.OS === "android" ? (
        <MapView style={styles.map} provider={PROVIDER_GOOGLE}>
          {routeMapPolyline && showMapRoute ? (
            <Polyline
              coordinates={routeMapPolyline}
              strokeColor="red"
              strokeWidth={2}
            />
          ) : (
            <Marker coordinate={{ latitude, longitude }} />
          )}
        </MapView>
      ) : (
        <MapView style={styles.map} ref={mapRef}>
          {routeMapPolyline && showMapRoute ? (
            <Polyline
              coordinates={routeMapPolyline}
              strokeColor="red"
              strokeWidth={2}
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
  fab: {
    position: "absolute",
    //margin: 16,
    right: 0,
    left: 0,
    top: 0,
  },
})
