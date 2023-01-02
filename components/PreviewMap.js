import { View, StyleSheet } from "react-native"
// Other
import MapView, { Marker } from "react-native-maps"

export const PreviewMap = ({ location }) => {
  const [longitude, latitude] = location

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={{
          latitude,
          longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <Marker coordinate={{ latitude, longitude }} />
      </MapView>
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
