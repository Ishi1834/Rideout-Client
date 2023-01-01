import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
// UI
import { View, Text } from "react-native"
import { Button } from "react-native-paper"
// State
import { useSelector, useDispatch } from "react-redux"
import { removeAClubRide, removeAUserRide } from "../../../state/ridesSlice"
// Other
import axios from "../../../axiosConfig"

export const RideDetailScreen = ({ route }) => {
  const { rideId } = route.params
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [allRides, setAllRides] = useState([])
  const ridesState = useSelector((state) => state.rides)
  const clubRides = ridesState?.clubRides
  const openRides = ridesState?.openRides.rides

  useEffect(() => {
    setAllRides([...clubRides, ...openRides])
  }, [clubRides.length, openRides.length])

  const selectedRide = allRides.find((ride) => ride._id === rideId)

  const deleteRideApiCall = async (rideId) => {
    let clubId = ""
    if (selectedRide?.club?.clubId) {
      clubId = selectedRide.club.clubId
    }
    try {
      const res = await axios.delete(`rides/${clubId}`, { data: { rideId } })
      if (res.status === 200) {
        dispatch(removeAUserRide(rideId))
        if (!clubId) {
          dispatch(removeAClubRide(rideId))
        }
        navigation.goBack()
      }
    } catch (error) {
      console.log("Error here ", error.response.data)
    }
  }
  return (
    <View>
      <Text>RideDetailScreen {rideId}</Text>
      <Button onPress={() => deleteRideApiCall(rideId)}>Delete Ride</Button>
    </View>
  )
}
