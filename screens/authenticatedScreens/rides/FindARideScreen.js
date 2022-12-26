import { View, Text } from "react-native"

export const FindARideScreen = () => {
  /* useEffect(() => {
    const getClubRides = async () => {
      try {
        const res = await axios.get(`rides/${club._id}`)
        if (res.status === 200) {
          console.log("res data ", res.data)
          //setClubRides(res.data)
          //dispatch(___({ clubId: club._id, rides: res.data }))
        }
      } catch (error) {
        console.log("Error here ", error)
      }
    }
    getClubRides()
  }, []) */
  return (
    <View>
      <Text>Find A Ride</Text>
    </View>
  )
}
