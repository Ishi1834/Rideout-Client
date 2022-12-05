import { View, Text } from "react-native"

export const RideDetailScreen = ({ route }) => {
  const { rideId } = route.params

  return (
    <View>
      <Text>RideDetailScreen {rideId}</Text>
    </View>
  )
}
