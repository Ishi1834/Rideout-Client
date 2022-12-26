import { useEffect } from "react"
import { useNavigation } from "@react-navigation/native"
// UI
import { ScrollView, View, StyleSheet } from "react-native"
import { RideCard } from "../../../components/RideCard"
// State
import { useSelector, useDispatch } from "react-redux"
import { setUpClubRides, setUpOpenRides } from "../../../state/ridesSlice"
// Other
import axios from "../../../axiosConfig"
import { ActivityIndicator } from "react-native-paper"

export const FindARideScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const clubs = useSelector((state) => state.clubs)
  const ridesState = useSelector((state) => state.rides)

  const clubRides = ridesState?.clubRides
  const openRides = ridesState?.openRides

  useEffect(() => {
    const getAllOpenRides = async () => {
      try {
        const res = await axios.get("/rides")
        if (res.status === 200) {
          dispatch(setUpOpenRides({ range: null, rides: res.data }))
        }
      } catch (error) {
        console.log("Error here ", error)
      }
    }

    const getClubRides = async (clubId) => {
      try {
        const res = await axios.get(`rides/${clubId}`)
        if (res.status === 200) {
          return res.data
        }
      } catch (error) {
        console.log("Error here ", error)
      }
    }

    const getAllClubRides = async () => {
      try {
        const allClubRidesArray = []
        const allRidesByClub = await Promise.all(
          clubs.authorization.map((club) => getClubRides(club.clubId))
        )
        allRidesByClub.forEach((club) => {
          if (!club?.message) {
            club.forEach((ride) => allClubRidesArray.push(ride))
          }
        })
        dispatch(setUpClubRides(allClubRidesArray))
      } catch (error) {
        console.log("Error here ", error)
      }
    }

    getAllClubRides()
    getAllOpenRides()
  }, [])

  const navigateToRide = (screen, rideId) => {
    navigation.navigate(screen, { rideId })
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {!clubRides ? (
          <ActivityIndicator animating={true} />
        ) : (
          clubRides.map((ride, index) => (
            <RideCard key={index} ride={ride} rideClicked={navigateToRide} />
          ))
        )}

        {!openRides ? (
          <ActivityIndicator animating={true} />
        ) : (
          openRides.rides.map((ride, index) => (
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
