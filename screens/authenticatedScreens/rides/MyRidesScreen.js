import { useNavigation } from "@react-navigation/native"
// UI
import { View, ScrollView, StyleSheet } from "react-native"
import { RideCard } from "../../../components/RideCard"
// State
import { useSelector } from "react-redux"

export const MyRidesScreen = () => {
  const navigation = useNavigation()
  const rides = useSelector((state) => state.user.rides)

  const navigateToRide = (screen, rideId) => {
    navigation.navigate(screen, { rideId })
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {rides.map((ride, index) => (
          <RideCard key={index} ride={ride} rideClicked={navigateToRide} />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
})
