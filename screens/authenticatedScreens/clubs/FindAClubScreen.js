import { useEffect, useState } from "react"
import { View, StyleSheet, FlatList } from "react-native"
import axios from "../../../axiosConfig"
import * as Location from "expo-location"
import { Map } from "../../../components/Map"
import { ClubCard } from "../../../components/ClubCard"
import { Banner } from "../../../components/Banner"
import { ActivityIndicator } from "react-native-paper"

export const FindAClubScreen = () => {
  const [isMakingApiRequest, setIsMakingApiRequest] = useState(false)
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [clubs, setClubs] = useState([])

  useEffect(() => {
    requestLocationAccess()

    const findAClub = async () => {
      setIsMakingApiRequest(true)
      try {
        const res = await axios.get(
          `/clubs?lng=${userLocation.longitude}&lat=${userLocation.latitude}`
        )
        if (res.status === 200) {
          setClubs(res.data)
        }
      } catch (error) {
        console.log("Error - FindAClub.js ")
        console.log(error.response.data.message)
      }
      setIsMakingApiRequest(false)
    }

    if (userLocation) {
      findAClub()
    }
  }, [userLocation?.latitude, userLocation?.longitude])

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
    <ClubCard
      club={item}
      clubClicked={(val) => console.log("clicky ", val)}
      hideCreateRide={true}
    />
  )

  return (
    <View style={styles.container}>
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
      <Map
        allLocations={getLocationAndIdFromClubs(clubs)}
        showMap={true}
        userLocation={userLocation}
      />

      {clubs?.length === 0 ? (
        isMakingApiRequest ? (
          <ActivityIndicator />
        ) : (
          <Banner
            info="There are no clubs for the choosen distance"
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
