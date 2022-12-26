import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
// UI
import { ScrollView, View, StyleSheet } from "react-native"
import { ActivityIndicator, Button, List } from "react-native-paper"
import { RideCard } from "../../../components/RideCard"
import { Map } from "../../../components/Map"
import { Switch } from "../../../components/Switch"
// State
import { useSelector, useDispatch } from "react-redux"
import { setUpClubRides, setUpOpenRides } from "../../../state/ridesSlice"
// Other
import axios from "../../../axiosConfig"
import { FilterRides } from "../../../components/FilterRides"

export const FindARideScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const clubs = useSelector((state) => state.clubs)
  const ridesState = useSelector((state) => state.rides)
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

  const clubRides = ridesState?.clubRides
  const openRides = ridesState?.openRides

  useEffect(() => {
    const clubsArray = clubs.authorization.map((club) => {
      return {
        label: club.clubName,
        value: club.clubId,
      }
    })
    console.log("clubs ", clubsArray)
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

  const navigateToRide = (screen, rideId) => {
    navigation.navigate(screen, { rideId })
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

      {/* 

      {!showOpenRides && (
        <List.Section title="Filter by clubs">
          <List.Accordion
            title={
              filterByClub
                ? clubs.authorization.find(
                    (club) => club.clubId === filterByClub
                  ).clubName
                : "Show all rides"
            }
          >
            {filterByClub && (
              <List.Item
                title="Show all rides"
                onPress={() => setFilterByClub("")}
              />
            )}
            {clubs.authorization.map((club, index) => (
              <List.Item
                key={index}
                title={club.clubName}
                onPress={() => setFilterByClub(club.clubId)}
              />
            ))}
          </List.Accordion>
        </List.Section>
      )} */}
      <Map />
      <ScrollView>
        {/* <View style={styles.listRides}>
          {!showOpenRides &&
            (!clubRides ? (
              <ActivityIndicator animating={true} />
            ) : (
              clubRides.map((ride, index) => (
                <RideCard
                  key={index}
                  ride={ride}
                  rideClicked={navigateToRide}
                />
              ))
            ))}

          {showOpenRides &&
            (!openRides ? (
              <ActivityIndicator animating={true} />
            ) : (
              openRides.rides.map((ride, index) => (
                <RideCard
                  key={index}
                  ride={ride}
                  rideClicked={navigateToRide}
                />
              ))
            ))}
        </View> */}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  listRides: {
    paddingVertical: 10,
  },
})
