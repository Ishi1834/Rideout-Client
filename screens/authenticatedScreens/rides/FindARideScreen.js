import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
// UI
import { View, StyleSheet, FlatList } from "react-native"
import { ActivityIndicator, Button } from "react-native-paper"
import { RideCard } from "../../../components/RideCard"
import { Map } from "../../../components/Map"
import { FilterRides } from "../../../components/FilterRides"
// State
import { useSelector, useDispatch } from "react-redux"
import { setUpClubRides, setUpOpenRides } from "../../../state/ridesSlice"
// Other
import axios from "../../../axiosConfig"

export const FindARideScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const clubs = useSelector((state) => state.clubs)
  const ridesState = useSelector((state) => state.rides)
  const clubRides = ridesState?.clubRides
  const openRides = ridesState?.openRides.rides
  const [allRides, setAllRides] = useState([])
  const [showFilter, setShowFilter] = useState(false)
  const [filterMap, setFilterMap] = useState({
    name: "Show Map",
    showMap: true,
  })
  const [filterRides, setFilterRides] = useState([
    { label: "Open Rides", isChecked: true },
    { label: "Club Rides", isChecked: true },
  ])
  const [filterClubs, setFilterClubs] = useState({
    label: "Filter rides by club",
    data: null,
    selected: null,
  })

  useEffect(() => {
    setAllRides([...clubRides, ...openRides])
  }, [clubRides.length, openRides.length])

  useEffect(() => {
    console.log("filter requested")
  }, [filterRides[0].isChecked, filterRides[1].isChecked, filterClubs.selected])

  useEffect(() => {
    const clubsArray = clubs.authorization.map((club) => {
      return {
        label: club.clubName,
        value: club.clubId,
      }
    })
    setFilterClubs({ ...filterClubs, data: clubsArray })
  }, [])

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

  const renderRideCard = ({ item }) => (
    <RideCard ride={item} rideClicked={navigateToRide} />
  )

  const navigateToRide = (screen, rideId) => {
    navigation.navigate(screen, { rideId })
  }

  const getLocationAndIdFromRides = (rides) => {
    if (rides.length) {
      return rides.map((ride) => {
        return { id: ride._id, location: ride.startLocation.coordinates }
      })
    }
  }

  return (
    <View style={styles.container}>
      {showFilter ? (
        <FilterRides
          visible={showFilter}
          hideModal={() => setShowFilter(false)}
          filterMap={filterMap}
          filterRides={filterRides}
          filterClubs={filterClubs}
        />
      ) : (
        <Button mode="contained-tonal" onPress={() => setShowFilter(true)}>
          Filter rides
        </Button>
      )}

      <Map allLocations={getLocationAndIdFromRides(allRides)} />
      {allRides.length === 0 ? (
        <ActivityIndicator animating={true} />
      ) : (
        <FlatList
          data={allRides}
          renderItem={renderRideCard}
          keyExtractor={(item) => item._id}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flex: 1,
  },
  listRides: {
    paddingVertical: 10,
  },
})
