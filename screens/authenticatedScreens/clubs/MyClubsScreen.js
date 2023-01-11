import { useState, useEffect } from "react"
import { useNavigation, useRoute } from "@react-navigation/native"
// UI
import { View, StyleSheet, ScrollView } from "react-native"
import { ClubCard } from "../../../components/ClubCard"
import { Banner } from "../../../components/Banner"
import { SummaryText } from "../../../components/SummaryText"
// State
import { useSelector } from "react-redux"
// Other
import { noClubsBanner } from "../../../static/bannerData"

export const MyClubsScreen = () => {
  const [message, setMessage] = useState(null)
  const navigation = useNavigation()
  const route = useRoute()
  const clubs = useSelector((state) => state.clubs.clubs)
  const params = route.params

  useEffect(() => {
    if (params?.message) {
      setMessage(params.message)
      setTimeout(() => {
        setMessage(null)
      }, 3000)
    }
  }, [params?.message])

  const navigateToClub = (screen, club, clubName) => {
    navigation.navigate(screen, { club, clubName })
  }

  const navigateToCreateARide = (screen, clubName, clubId) => {
    navigation.navigate(screen, { clubName, clubId })
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {message && <SummaryText isInfo={true} message={message} />}

        {clubs.length === 0 ? (
          <Banner
            info={noClubsBanner.info}
            actions={noClubsBanner.actions}
            buttonClicked={(screen) => navigation.navigate(screen)}
          />
        ) : (
          clubs.map((club, index) => (
            <ClubCard
              key={index}
              club={club}
              clubClicked={navigateToClub}
              createRideClicked={navigateToCreateARide}
            />
          ))
        )}
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
