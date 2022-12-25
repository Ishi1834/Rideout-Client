import { useNavigation, useRoute } from "@react-navigation/native"
// UI
import { View, StyleSheet, ScrollView } from "react-native"
import { ClubCard } from "../../../components/ClubCard"
// State
import { useSelector } from "react-redux"
import { SummaryText } from "../../../components/SummaryText"
import { useState, useEffect } from "react"

export const MyClubsScreen = () => {
  const [message, setMessage] = useState(null)
  const navigation = useNavigation()
  const route = useRoute()
  const clubs = useSelector((state) => state.user.clubs)
  const params = route.params

  useEffect(() => {
    if (params?.message) {
      setMessage(params.message)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }, [params?.message])

  const navigateToClub = (screen, clubId) => {
    navigation.navigate(screen, { clubId })
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {message && <SummaryText isInfo={true} message={message} />}

        {clubs.map((club, index) => (
          <ClubCard key={index} club={club} clubClicked={navigateToClub} />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
})
