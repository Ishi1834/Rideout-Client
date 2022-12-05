import { View, ScrollView, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import rides from "../../../mockResponses/getAllClubRidesResponse.json"
import { RideCard } from "../../../components/RideCard"

export const MyRidesScreen = () => {
  const navigation = useNavigation()

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
