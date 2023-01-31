import { useCallback, useState, useMemo, useRef } from "react"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
// UI
import { View, StyleSheet, FlatList } from "react-native"
import { ActivityIndicator, Button } from "react-native-paper"
import { Map } from "../../../components/Map"
import { ClubCard } from "../../../components/ClubCard"
import { Banner } from "../../../components/Banner"
import { DropPinMap } from "../../../components/DropPinMap"
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet"
import { NoLocationModal } from "../../../components/NoLocationModal"
// Other
import axios from "../../../axiosConfig"
import * as Location from "expo-location"

export const FindAClubScreen = () => {
  const navigation = useNavigation()
  const [isMakingApiRequest, setIsMakingApiRequest] = useState(false)
  const [showDropPinMap, setShowDropPinMap] = useState(false)
  const [userHasSelectedLocation, setUserHasSelectedLocation] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [clubs, setClubs] = useState([])
  const sheetRef = useRef(null)

  useFocusEffect(
    useCallback(() => {
      requestLocationAccess()

      return () => {
        setLocationError(null)
        setClubs([])
        handleSnapPress(0)
      }
    }, [])
  )

  useFocusEffect(
    useCallback(() => {
      if (userLocation) {
        findClubsNearLocation()
      }
    }, [userLocation?.latitude, userLocation?.longitude])
  )

  const findClubsNearLocation = async () => {
    setLocationError(null)
    setIsMakingApiRequest(true)
    try {
      const res = await axios.get(
        `/clubs?lng=${userLocation.longitude}&lat=${userLocation.latitude}`
      )
      if (res.status === 200 && !res.data?.message) {
        setClubs(res.data)
      }
    } catch (error) {
      setClubs([])
      console.log("Error - FindAClub.js ")
      console.log(error.response.data.message)
    }
    setIsMakingApiRequest(false)
  }

  const requestLocationAccess = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()

    // don't show no location error if location has been selected
    if (userLocation) {
      return
    }

    if (status !== "granted") {
      setLocationError(
        "Permission to access location was denied. \n\nPlease grant location access in your setting or select a location on the map."
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

  const getLocationAndIdFromClubs = (givenClubs) => {
    if (givenClubs?.length) {
      return givenClubs.map((club) => {
        return {
          id: club._id,
          name: club.name,
          location: club.location.coordinates,
        }
      })
    }
  }

  // Bottom Sheet
  const snapPoints = useMemo(() => ["25%", "65%"], [])
  // callbacks
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index)
  }, [])

  const renderClubCard = useCallback(
    ({ item }) => <ClubCard club={item} clubClicked={navigateToClub} />,
    []
  )

  const navigateToClub = (screen, club, clubName) => {
    navigation.navigate(screen, { club, clubName })
  }

  const handleLocationSelect = (location) => {
    setUserLocation({
      ...location,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    })
    setUserHasSelectedLocation(true)
    setLocationError(null)
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
      <View style={styles.contentContainer}>
        <NoLocationModal
          locationError={locationError}
          handleBannerSelection={handleBannerSelection}
        />
        <Button
          mode="contained-tonal"
          onPress={() => {
            setShowDropPinMap(true)
          }}
        >
          Select Location on Map
        </Button>
      </View>

      <Map
        allLocations={getLocationAndIdFromClubs(clubs)}
        showMap={true}
        userLocation={userLocation}
        fullScreenMap={true}
        handleTouch={() => handleSnapPress(0)}
        userHasSelectedLocation={userHasSelectedLocation}
      />
      <BottomSheet ref={sheetRef} snapPoints={snapPoints}>
        {clubs?.length === 0 ? (
          isMakingApiRequest ? (
            <ActivityIndicator />
          ) : (
            <Banner
              info="There are no clubs within 10km of your location"
              actions={[]}
            />
          )
        ) : (
          <BottomSheetFlatList
            data={clubs}
            keyExtractor={(item) => item._id}
            renderItem={renderClubCard}
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
