import { useCallback, useEffect, useState } from "react"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
// UI
import { View, StyleSheet, FlatList } from "react-native"
import { ActivityIndicator, Button } from "react-native-paper"
import { RideCard } from "../../../components/RideCard"
import { Map } from "../../../components/Map"
import { Banner } from "../../../components/Banner"
import { FilterRides } from "../../../components/FilterRides"
import { DropPinMap } from "../../../components/DropPinMap"
// State
import { useSelector, useDispatch } from "react-redux"
import { setUpClubRides, setUpOpenRides } from "../../../state/ridesSlice"
// Other
import axios from "../../../axiosConfig"
import * as Location from "expo-location"
import { getDistance } from "geolib"

export const FindARideScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const clubs = useSelector((state) => state.clubs)
  const ridesState = useSelector((state) => state.rides)
  const clubRides = ridesState?.clubRides
  const openRides = ridesState?.openRides.rides
  const [isMakingApiRequest, setIsMakingApiRequest] = useState(false)
  const [showDropPinMap, setShowDropPinMap] = useState(false)
  const [userHasSelectedLocation, setUserHasSelectedLocation] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [maxDistance, setMaxDistance] = useState(10)
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

  useFocusEffect(
    useCallback(() => {
      requestLocationAccess()
      // Check club state exists
      if (clubs?.clubs) {
        const allClubRidesArray = []
        setIsMakingApiRequest(true)
        Promise.all(clubs.clubs.map((club) => axios.get(`rides/${club._id}`)))
          .then((allGetRidesRequestsArray) => {
            allGetRidesRequestsArray.forEach((clubResponse) => {
              const clubRides = clubResponse.data
              // check if club has rides or message
              if (!clubRides?.message) {
                clubRides.forEach((ride) => allClubRidesArray.push(ride))
              }
            })
            dispatch(setUpClubRides(allClubRidesArray))
          })
          .catch((error) => {
            console.log("Error - ClubScreen.js")
            console.log(error)
          })
        setIsMakingApiRequest(false)
      }
    }, [clubs?.clubs?.length])
  )

  useFocusEffect(
    useCallback(() => {
      // re-calculate distance to start location whenever user location changes
      const getAllOpenRides = async (updatedDistanceClubRides) => {
        try {
          const maxDistanceInM = maxDistance * 1000
          const res = await axios.get(
            `/rides?lng=${userLocation.longitude}&lat=${userLocation.latitude}&maxDistance=${maxDistanceInM}`
          )
          if (res.status === 200) {
            dispatch(setUpOpenRides({ range: maxDistance, rides: res.data }))
            dispatch(setUpClubRides(updatedDistanceClubRides))
            setAllRides([...updatedDistanceClubRides, ...res.data])
          }
        } catch (error) {
          dispatch(setUpOpenRides({ range: null, rides: [] }))
          dispatch(setUpClubRides(updatedDistanceClubRides))
          setAllRides([...updatedDistanceClubRides])
          console.log(error.response.data.message)
        }
      }

      if (userLocation) {
        const updatedDistanceClubRides = clubRides.map((ride) => {
          const [longitude, latitude] = ride.startLocation.coordinates
          const distanceToStart = getDistance(
            { longitude, latitude },
            userLocation
          )
          return { ...ride, distanceToStart }
        })
        getAllOpenRides(updatedDistanceClubRides)
      }
    }, [userLocation?.latitude, userLocation?.longitude, maxDistance])
  )

  /**
   * All the filtering can be moved into a single useEffect
   */

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

  const requestLocationAccess = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== "granted") {
      setLocationError("Permission to access location was denied")
      return
    }

    let location = await Location.getCurrentPositionAsync({})

    const { latitude, longitude } = location.coords

    // remove below when done
    setUserLocation({
      latitude: 51.464967,
      longitude: -0.180209,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
    /* setUserLocation({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }) */
  }

  const renderRideCard = ({ item }) => (
    <RideCard ride={item} rideClicked={navigateToRide} />
  )

  const navigateToRide = (screen, ride, rideName) => {
    navigation.navigate(screen, { ride, rideName })
  }

  const getLocationAndIdFromRides = (rides) => {
    if (rides.length) {
      return rides.map((ride) => {
        return {
          id: ride._id,
          name: ride.name,
          location: ride.startLocation.coordinates,
        }
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

  const handleLocationSelect = (location) => {
    setUserLocation({
      ...location,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
    setUserHasSelectedLocation(true)
    setShowDropPinMap(false)
  }

  if (showDropPinMap) {
    return (
      <DropPinMap
        preselectedLocation={[userLocation?.longitude, userLocation?.latitude]}
        onSelectLocation={handleLocationSelect}
      />
    )
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
          maxDistance={maxDistance}
          onMaxDistanceChange={(distance) => setMaxDistance(distance)}
        />
      ) : (
        <Button mode="contained-tonal" onPress={() => setShowFilter(true)}>
          Filter rides
        </Button>
      )}

      {locationError && (
        <Banner
          info={locationError}
          actions={[
            {
              label: "Get location",
            },
          ]}
          buttonClicked={requestLocationAccess}
        />
      )}
      <Button
        mode="contained"
        onPress={() => {
          setShowDropPinMap(true)
        }}
        style={{ marginTop: 10 }}
      >
        Select Location on Map
      </Button>
      <Map
        allLocations={getLocationAndIdFromRides(allRides)}
        showMap={filterMap.showMap}
        userLocation={userLocation}
        userHasSelectedLocation={userHasSelectedLocation}
      />
      {allRides?.length === 0 ? (
        isMakingApiRequest ? (
          <ActivityIndicator />
        ) : (
          <Banner
            info="There are no rides for the chosen filters"
            actions={[]}
          />
        )
      ) : (
        <FlatList
          data={allRides}
          renderItem={renderRideCard}
          keyExtractor={(item) => item._id}
          /* onMomentumScrollEnd={(event) => {
            const index = Math.floor(
              Math.floor(event.nativeEvent.contentOffset.x) /
                Math.floor(event.nativeEvent.layoutMeasurement.width)
            )
            console.log("current index ", index)
          }} */
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
