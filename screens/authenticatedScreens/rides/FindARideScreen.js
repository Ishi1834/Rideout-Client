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
    // for changes in clubRides, openRides length
    setAllRides([...clubRides, ...openRides])
  }, [clubRides.length, openRides.length])

  useEffect(() => {
    if (filterClubs.selected) {
      const newFilterClubs = clubs?.authorization.map((club) => {
        if (club.clubId !== filterClubs.selected) {
          return {
            label: club.clubName,
            value: club.clubId,
          }
        } else {
          return {
            label: "Show all Clubs",
            value: null,
          }
        }
      })
      setFilterClubs({ ...filterClubs, data: newFilterClubs })
      // filterRides
      const selectedClubRides = clubRides.filter(
        (club) => club.club.clubId === filterClubs.selected
      )
      setAllRides(selectedClubRides)
    }
  }, [filterClubs.selected])

  useEffect(() => {
    // for change in showing open rides
    if (filterRides[0].isChecked) {
      if (filterRides[1].isChecked) {
        setAllRides([...clubRides, ...openRides])
      } else {
        setAllRides(openRides)
      }
    } else {
      if (filterRides[1].isChecked) {
        setAllRides(clubRides)
      } else {
        setAllRides([])
      }
    }
  }, [filterRides[0].isChecked])

  useEffect(() => {
    // for change in showing club rides
    if (filterRides[1].isChecked) {
      if (filterRides[0].isChecked) {
        setAllRides([...clubRides, ...openRides])
      } else {
        setAllRides(clubRides)
      }
    } else {
      if (filterRides[0].isChecked) {
        setAllRides(openRides)
      } else {
        setAllRides([])
      }
    }
  }, [filterRides[1].isChecked])

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

  const setRidesFilter = (filter, ...changes) => {
    if (filter === "map") {
      setFilterMap({ ...filterMap, showMap: changes[0] })
    } else if (filter === "checkbox") {
      const newRides = filterRides.map((ride, index) => {
        if (index === changes[0]) {
          ride.isChecked = changes[1]
        }
        return ride
      })
      setFilterRides(newRides)
    } else if (filter === "setClub") {
      const club = filterClubs.data.find((club) => club.value === changes[0])
      if (club) {
        setFilterClubs({
          ...filterClubs,
          label: club.label,
          selected: club.value,
        })
      } else {
        const newFilterClubs = clubs.authorization.map((club) => {
          return {
            label: club.clubName,
            value: club.clubId,
          }
        })

        setFilterClubs({
          label: "Filter rides by club",
          data: newFilterClubs,
          selected: null,
        })
      }
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
          setFilter={setRidesFilter}
        />
      ) : (
        <Button mode="contained-tonal" onPress={() => setShowFilter(true)}>
          Filter rides
        </Button>
      )}

      <Map
        allLocations={getLocationAndIdFromRides(allRides)}
        showMap={filterMap.showMap}
      />
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
