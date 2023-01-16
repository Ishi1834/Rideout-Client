import { useState, useEffect, useCallback } from "react"
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native"
// UI
import { View, ScrollView, StyleSheet } from "react-native"
import { RideCard } from "../../../components/RideCard"
import { SummaryText } from "../../../components/SummaryText"
import { Chip } from "react-native-paper"
import { Banner } from "../../../components/Banner"
// State
import { useSelector } from "react-redux"
// Other
import { noRidesBanner } from "../../../static/bannerData"

export const MyRidesScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const [message, setMessage] = useState(null)
  const [showPastRides, setShowPastRides] = useState(false)
  const [upComingRides, setUpcomingRides] = useState([])
  const [pastRides, setPastRides] = useState([])
  const rides = useSelector((state) => state.rides.userRides)
  const params = route.params

  useEffect(() => {
    if (params?.message) {
      setMessage(params.message)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
    return () => {
      setMessage(null)
    }
  }, [params?.message])

  useFocusEffect(
    useCallback(() => {
      setUpcomingRides(getUpcomingRides(rides))
      setPastRides(getPastRides(rides))
    }, [rides.length])
  )

  const navigateToRide = (screen, ride, rideName) => {
    navigation.navigate(screen, { ride, rideName })
  }

  const getUpcomingRides = (ridesArray) => {
    const todaysDate = new Date()

    return ridesArray
      .filter((ride) => new Date(ride.date) > todaysDate)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
  }

  const getPastRides = (ridesArray) => {
    const todaysDate = new Date()

    return ridesArray
      .filter((ride) => new Date(ride.date) < todaysDate)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {message && <SummaryText isInfo={true} message={message} />}
        <View style={styles.rideSelection}>
          <Chip
            style={styles.rideChip}
            icon={!showPastRides && "check"}
            onPress={() => setShowPastRides(false)}
          >
            Upcoming rides
          </Chip>
          <Chip
            style={styles.rideChip}
            icon={showPastRides && "check"}
            onPress={() => setShowPastRides(true)}
          >
            Past rides
          </Chip>
        </View>
        {showPastRides ? (
          pastRides.length === 0 ? (
            <Banner
              info={noRidesBanner.infoNoPastRides}
              actions={noRidesBanner.actions}
              buttonClicked={(screen) => navigation.navigate(screen)}
            />
          ) : (
            pastRides.map((ride, index) => (
              <RideCard key={index} ride={ride} rideClicked={navigateToRide} />
            ))
          )
        ) : upComingRides.length === 0 ? (
          <Banner
            info={noRidesBanner.infoNoUpcomingRides}
            actions={noRidesBanner.actions}
            buttonClicked={(screen) => navigation.navigate(screen)}
          />
        ) : (
          upComingRides.map((ride, index) => (
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
    paddingVertical: 10,
  },
  rideSelection: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 15,
  },
  rideChip: {
    marginHorizontal: 10,
  },
})
