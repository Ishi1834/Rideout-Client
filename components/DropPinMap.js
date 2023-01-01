import { useEffect, useState } from "react"
// UI
import { View, StyleSheet } from "react-native"
import { FAB } from "react-native-paper"
// Other
import MapView, { Marker } from "react-native-maps"

export const DropPinMap = ({ onSelectLocation, preselectedLocation }) => {
  const [pinLocation, setPinLocation] = useState(null)
  const [region, setRegion] = useState(null)

  useEffect(() => {
    if (preselectedLocation) {
      const [longitude, latitude] = preselectedLocation
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      })
      setPinLocation({ longitude, latitude })
    }
  }, [])
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        zoomControlEnabled={true}
        onPress={(e) => setPinLocation(e.nativeEvent.coordinate)}
      >
        {pinLocation && (
          <Marker
            coordinate={pinLocation}
            draggable={true}
            onDragEnd={(e) => setPinLocation(e.nativeEvent.coordinate)}
          />
        )}
      </MapView>
      {pinLocation && (
        <FAB
          icon="plus"
          label="Save Location"
          style={styles.fab}
          onPress={() => onSelectLocation(pinLocation)}
        />
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
    marginVertical: 16,
    marginHorizontal: 90,
    right: 0,
    left: 0,
    bottom: 0,
  },
})
