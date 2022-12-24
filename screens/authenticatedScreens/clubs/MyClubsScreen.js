import { useNavigation } from "@react-navigation/native"
// UI
import { View, StyleSheet, ScrollView } from "react-native"
import { ClubCard } from "../../../components/ClubCard"
// State
import { useSelector } from "react-redux"

export const MyClubsScreen = () => {
  const navigation = useNavigation()
  const clubs = useSelector((state) => state.user.clubs)

  const navigateToClub = (screen, clubId) => {
    navigation.navigate(screen, { clubId })
  }

  return (
    <ScrollView>
      <View style={styles.container}>
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
