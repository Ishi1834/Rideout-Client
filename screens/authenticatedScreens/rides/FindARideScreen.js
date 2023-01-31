import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
// UI
import { View, StyleSheet } from "react-native"
import { ActivityIndicator, Button } from "react-native-paper"
import { RideCard } from "../../../components/RideCard"
import { Map } from "../../../components/Map"
import { Banner } from "../../../components/Banner"
import { FilterRides } from "../../../components/FilterRides"
import { DropPinMap } from "../../../components/DropPinMap"
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"
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
  const [filterRides, setFilterRides] = useState([
    { label: "Open Rides", isChecked: false },
    { label: "Club Rides", isChecked: true },
  ])
  const [filterClubs, setFilterClubs] = useState(null)
  const [sortRidesSelected, setSortRidesSelected] = useState("date")
  const sheetRef = useRef(null)

  // Bottom Sheet
  const snapPoints = useMemo(() => ["25%", "65%"], [])
  // callbacks
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index)
  }, [])

  const renderRideItem = useCallback(
    ({ item }) => <RideCard ride={item} rideClicked={navigateToRide} />,
    []
  )
  console.log("userLoc ", userLocation)
  console.log("error ", locationError)
  useFocusEffect(
    // location
    useCallback(() => {
      // Get user location whenever screen gets focus
      if (!userLocation) {
        requestLocationAccess()
      }
      return () => {
        setLocationError(null)
        setShowDropPinMap(false)
        handleSnapPress(0)
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
            // remove past rides
            const todaysDate = new Date()
            const allUpcomingClubRides = allClubRidesArray.filter(
              (ride) => new Date(ride.date) > todaysDate
            )
            if (userLocation) {
              const updatedDistanceClubRides =
                addDistanceToClubRides(allUpcomingClubRides)
              dispatch(setUpClubRides(updatedDistanceClubRides))
            } else {
              dispatch(setUpClubRides(allUpcomingClubRides))
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
            // remove past rides
            const todaysDate = new Date()
            const allUpcomingOpenRides = res.data.filter(
              (ride) => new Date(ride.date) > todaysDate
            )
            dispatch(
              setUpOpenRides({
                range: maxDistance,
                rides: allUpcomingOpenRides,
              })
            )
            if (updatedDistanceClubRides.length !== 0) {
              /**
               * getAllClubRides setsUp clubRides array
               * setting cllubRides to [] causes an endless loop if clubRides exist
               */
              dispatch(setUpClubRides(updatedDistanceClubRides))
            }
            setAllRides([...updatedDistanceClubRides, ...allUpcomingOpenRides])
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
      let allFilteredRides = [...openRides]
      // check distance for openRides
      if (userLocation && filterRides[0].isChecked) {
        // distance for clubRides is calculated using user location
        const maxDistanceInM = maxDistance * 1000
        allFilteredRides = allFilteredRides.filter(
          (ride) => ride.distanceToStart < maxDistanceInM
        )
      }
      // club rides should be removed by distance limits
      allFilteredRides = [...allFilteredRides, ...clubRides]

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
          (a, b) => b.distance - a.distance
        )
      } else if (sortRidesSelected === "speed") {
        allFilteredRides = allFilteredRides.sort((a, b) => b.speed - a.speed)
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

    // don't show no location error if location has been selected
    if (userLocation) {
      return
    }

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
    if (filter === "checkbox") {
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
      {showFilter && (
        <FilterRides
          visible={showFilter}
          hideModal={() => setShowFilter(false)}
          filterRides={filterRides}
          filterClubs={filterClubs}
          setFilter={setRidesFilter}
          maxDistance={maxDistance}
          onMaxDistanceChange={(distance) => setMaxDistance(distance)}
          userLocation={userLocation}
          sortRides={sortRidesArray}
          sortRidesSelected={sortRidesSelected}
          setSortRidesSelected={(val) => setSortRidesSelected(val)}
        />
      )}
      <View style={styles.contentContainer}>
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
      </View>
      <Map
        allLocations={getLocationAndIdFromRides(allRides)}
        userLocation={userLocation}
        userHasSelectedLocation={userHasSelectedLocation}
        fullScreenMap={true}
        handleTouch={() => handleSnapPress(0)}
      />
      <BottomSheet ref={sheetRef} snapPoints={snapPoints}>
        {allRides?.length === 0 ? (
          isMakingApiRequest ? (
            <ActivityIndicator />
          ) : (
            <Banner
              info="There are no rides for your selected filters"
              actions={[]}
            />
          )
        ) : (
          <BottomSheetFlatList
            data={allRides}
            keyExtractor={(item) => item._id}
            renderItem={renderRideItem}
          />
        )}
      </BottomSheet>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 10,
    paddingHorizontal: 20,
    zIndex: 1,
  },
})
