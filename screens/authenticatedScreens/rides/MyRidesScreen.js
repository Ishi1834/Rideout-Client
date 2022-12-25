import { useState, useEffect } from "react"
import { useNavigation, useRoute } from "@react-navigation/native"
// UI
import { View, ScrollView, StyleSheet } from "react-native"
import { RideCard } from "../../../components/RideCard"
// State
import { useSelector } from "react-redux"
import { SummaryText } from "../../../components/SummaryText"

export const MyRidesScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const [message, setMessage] = useState(null)
  const rides = useSelector((state) => state.user.rides)
  const params = route.params

  useEffect(() => {
    if (params?.message) {
      setMessage(params.message)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }, [params?.message])

  const navigateToRide = (screen, rideId) => {
    navigation.navigate(screen, { rideId })
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {message && <SummaryText isInfo={true} message={message} />}

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
