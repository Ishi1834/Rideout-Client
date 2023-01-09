import { useState, useEffect } from "react"
import { useNavigation, useRoute } from "@react-navigation/native"
// UI
import { View, ScrollView, StyleSheet } from "react-native"
import { RideCard } from "../../../components/RideCard"
import { SummaryText } from "../../../components/SummaryText"
// State
import { useSelector } from "react-redux"
import { Banner } from "../../../components/Banner"
import { noRidesBanner } from "../../../static/bannerData"
// Other

export const MyRidesScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const [message, setMessage] = useState(null)
  const rides = useSelector((state) => state.rides.userRides)
  const params = route.params

  useEffect(() => {
    if (params?.message) {
      setMessage(params.message)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }, [params?.message])

  const navigateToRide = (screen, ride, rideName) => {
    navigation.navigate(screen, { ride, rideName })
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {message && <SummaryText isInfo={true} message={message} />}

        {rides.length === 0 ? (
          <Banner
            info={noRidesBanner.info}
            actions={noRidesBanner.actions}
            buttonClicked={(screen) => navigation.navigate(screen)}
          />
        ) : (
          rides.map((ride, index) => (
            <RideCard key={index} ride={ride} rideClicked={navigateToRide} />
          ))
        )}
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
