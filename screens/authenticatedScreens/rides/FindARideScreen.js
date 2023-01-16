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
import { sortRidesArray } from "../../../static/multiSelectOptions"

export const FindARideScreen = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const clubs = useSelector((state) => state.clubs)
  const userClubs = clubs.clubs
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
    { label: "Open Rides", isChecked: false },
    { label: "Club Rides", isChecked: true },
  ])
  const [filterClubs, setFilterClubs] = useState(null)
  const [sortRidesSelected, setSortRidesSelected] = useState("date")

  useFocusEffect(
    // location
    useCallback(() => {
      // Get user location whenever screen gets focus
      requestLocationAccess()
      // set user location to null when screen looses focus
      return () => {
        setUserLocation(null)
        setLocationError(null)
        setShowDropPinMap(false)
        setSortRidesSelected("date")
      }
    }, [])
  )

  useFocusEffect(
    // club rides
    useCallback(() => {
      // If user clubs exists
      if (userClubs.length > 0) {
        const allClubRidesArray = []
        setIsMakingApiRequest(true)
        Promise.all(userClubs.map((club) => axios.get(`rides/${club._id}`)))
          .then((getClubRides) => {
            getClubRides.forEach((response) => {
              const clubRides = response.data
              // check if club has rides or message
              if (!clubRides?.message) {
                clubRides.forEach((ride) => allClubRidesArray.push(ride))
              }
            })
            if (userLocation) {
              const updatedDistanceClubRides =
                addDistanceToClubRides(allClubRidesArray)
              dispatch(setUpClubRides(updatedDistanceClubRides))
            } else {
              dispatch(setUpClubRides(allClubRidesArray))
            }
          })
          .catch((error) => {
            console.log("Error - ClubScreen.js")
            console.log(error)
          })
        setIsMakingApiRequest(false)
      }
    }, [userClubs.length])
  )

  useFocusEffect(
    // get open rides occurs after get club rides
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
            if (updatedDistanceClubRides.length !== 0) {
              /**
               * getAllClubRides setsUp clubRides array
               * setting cllubRides to [] causes an endless loop if clubRides exist
               */
              dispatch(setUpClubRides(updatedDistanceClubRides))
            }
            setAllRides([...updatedDistanceClubRides, ...res.data])
          }
        } catch (error) {
          dispatch(setUpOpenRides({ range: null, rides: [] }))
          dispatch(setUpClubRides(updatedDistanceClubRides))
          setAllRides([...updatedDistanceClubRides])
          console.log(error?.response?.data?.message)
        }
      }

      if (userLocation && filterRides[0].isChecked) {
        const updatedDistanceClubRides = addDistanceToClubRides(clubRides)
        getAllOpenRides(updatedDistanceClubRides)
      } else if (userLocation) {
        // add distance to clubRides if userlocation is selected
        const updatedDistanceClubRides = addDistanceToClubRides(clubRides)
        dispatch(setUpClubRides(updatedDistanceClubRides))
        setAllRides(updatedDistanceClubRides)
      }
    }, [
      userLocation?.latitude,
      userLocation?.longitude,
      maxDistance,
      clubRides?.length,
      filterRides[0].isChecked,
    ])
  )

  useEffect(() => {
    // Sets up RadioInput
    const clubsArray = clubs.authorization.map((club) => {
      return {
        label: club.clubName,
        value: club.clubId,
      }
    })
    setFilterClubs({
      ...filterClubs,
      data: [
        { label: "Show All Club rides", value: "Show All Club rides" },
        ...clubsArray,
      ],
    })
  }, [])

  useEffect(() => {
    // runs whenever filter is closed
    if (!showFilter) {
      let allFilteredRides = [...openRides, ...clubRides]
      // check distance for openRides
      if (userLocation && filterRides[0].isChecked) {
        // distance for clubRides is calculated using user location
        const maxDistanceInM = maxDistance * 1000
        allFilteredRides = allFilteredRides.filter(
          (ride) => ride.distanceToStart < maxDistanceInM
        )
      }

      // check if open rides is unchecked
      if (!filterRides[0].isChecked) {
        // remove open rides
        allFilteredRides = allFilteredRides.filter(
          (ride) => ride?.openRide === false
        )
      }
      // check if club rides is unchecked
      if (!filterRides[1].isChecked) {
        allFilteredRides = allFilteredRides.filter(
          (ride) => !!ride?.club === false
        )
      }

      // check club has been selected
      if (
        filterClubs?.selected &&
        filterClubs?.selected !== "Show All Club rides"
      ) {
        allFilteredRides = allFilteredRides.filter(
          (ride) => ride?.club?.clubId === filterClubs?.selected
        )
      }

      // sort rides
      if (sortRidesSelected === "date") {
        allFilteredRides = allFilteredRides.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        )
      } else if (sortRidesSelected === "rideDistance") {
        allFilteredRides = allFilteredRides.sort(
          (a, b) => a.distance - b.distance
        )
      } else if (sortRidesSelected === "speed") {
        allFilteredRides = allFilteredRides.sort((a, b) => a.speed - b.speed)
      } else if (sortRidesSelected === "startDistance" && userLocation) {
        allFilteredRides = allFilteredRides.sort(
          (a, b) => a.distanceToStart - b.distanceToStart
        )
      }

      setAllRides(allFilteredRides)
    }
    // should filter run if location or max distance changes?
  }, [showFilter, openRides.length, clubRides.length])

  const addDistanceToClubRides = (clubRides) => {
    return clubRides.map((ride) => {
      const [longitude, latitude] = ride.startLocation.coordinates
      const distanceToStart = getDistance({ longitude, latitude }, userLocation)
      return { ...ride, distanceToStart }
    })
  }

  const requestLocationAccess = async () => {
    setLocationError(null)
    let { status } = await Location.requestForegroundPermissionsAsync()

    if (status !== "granted") {
      setLocationError(
        "Permission to access location was denied. \n\nPlease grant location access in your setting or select a location on the map to find rides closest to you."
      )
      return
    }

    let location = await Location.getCurrentPositionAsync({})

    const { latitude, longitude } = location.coords

    setUserLocation({
      latitude,
      longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
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
      const newRidesFilter = filterRides.map((ride, index) => {
        if (index === changes[0]) {
          ride.isChecked = changes[1]
        }
        return ride
      })
      // remove club selected if open rides is true
      if (newRidesFilter[0].isChecked) {
        setFilterClubs({
          ...filterClubs,
          label: "Show All Club rides",
          selected: "Show All Club rides",
        })
      }
      setFilterRides(newRidesFilter)
    } else if (filter === "setClub") {
      const club = filterClubs.data.find((club) => club.value === changes[0])
      if (club) {
        setFilterClubs({
          ...filterClubs,
          label: club.label,
          selected: club.value,
        })
        // set open rides to false is club is selected
        if (changes[0] !== "Show All Club rides") {
          setFilterRides([
            { label: "Open Rides", isChecked: false },
            { label: "Club Rides", isChecked: true },
          ])
        }
      }
    }
  }

  const handleLocationSelect = (location) => {
    setLocationError(null)
    setUserLocation({
      ...location,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
    setUserHasSelectedLocation(true)
    setShowDropPinMap(false)
  }

  const handleBannerSelection = (val) => {
    setLocationError(null)
    if (val === "Location granted") {
      requestLocationAccess()
    }
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
      {locationError && (
        <Banner
          info={locationError}
          actions={[
            {
              label: "Ok",
            },
            {
              label: "Location granted",
            },
          ]}
          buttonClicked={(val) => handleBannerSelection(val)}
        />
      )}
      {showFilter && (
        <FilterRides
          visible={showFilter}
          hideModal={() => setShowFilter(false)}
          filterMap={filterMap}
          filterRides={filterRides}
          filterClubs={filterClubs}
          setFilter={setRidesFilter}
          maxDistance={maxDistance}
          onMaxDistanceChange={(distance) => setMaxDistance(distance)}
          userlocation={userLocation}
          sortRides={sortRidesArray}
          sortRidesSelected={sortRidesSelected}
          setSortRidesSelected={(val) => setSortRidesSelected(val)}
        />
      )}
      <Button mode="contained-tonal" onPress={() => setShowFilter(true)}>
        Sort and Filter rides
      </Button>

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
