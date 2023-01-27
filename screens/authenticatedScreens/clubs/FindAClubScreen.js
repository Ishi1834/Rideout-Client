import { useCallback, useState } from "react"
import { useFocusEffect, useNavigation } from "@react-navigation/native"
// UI
import { View, StyleSheet, FlatList } from "react-native"
import { ActivityIndicator, Button } from "react-native-paper"
import { Map } from "../../../components/Map"
import { ClubCard } from "../../../components/ClubCard"
import { Banner } from "../../../components/Banner"
import { DropPinMap } from "../../../components/DropPinMap"
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

  useFocusEffect(
    useCallback(() => {
      requestLocationAccess()

      return () => {
        // clear state when user leaves screen
        setUserHasSelectedLocation(false)
        setUserLocation(null)
        setLocationError(null)
        setClubs([])
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
      console.log("Error - FindAClub.js ")
      console.log(error.response.data.message)
    }
    setIsMakingApiRequest(false)
  }

  const requestLocationAccess = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()

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

  const renderClubCard = ({ item }) => (
    <ClubCard club={item} clubClicked={navigateToClub} />
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
      <Button
        mode="contained-tonal"
        onPress={() => {
          setShowDropPinMap(true)
        }}
      >
        Select Location on Map
      </Button>
      <Map
        allLocations={getLocationAndIdFromClubs(clubs)}
        showMap={true}
        userLocation={userLocation}
        userHasSelectedLocation={userHasSelectedLocation}
      />

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
        <FlatList
          data={clubs}
          renderItem={renderClubCard}
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
})
