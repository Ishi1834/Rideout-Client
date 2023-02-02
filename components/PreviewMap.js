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
  const longitude = location?.[0]
  const latitude = location?.[1]

  const mapRef = useRef()

  useEffect(() => {
    animateToRegion()
  }, [showMapRoute])

  const animateToRegion = () => {
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
  }
  /**
   * Google maps requires map to be ready before navigating to region
   */

  return (
    <View style={styles.container}>
      {Platform.OS === "android" ? (
        <MapView
          style={styles.map}
          ref={mapRef}
          onMapReady={animateToRegion}
          provider={PROVIDER_GOOGLE}
        >
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
        <MapView style={styles.map} ref={mapRef} onMapReady={animateToRegion}>
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
})
