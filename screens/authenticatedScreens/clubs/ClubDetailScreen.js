import { View, ScrollView, StyleSheet } from "react-native"
import {
  Avatar,
  Card,
  Paragraph,
  Divider,
  ActivityIndicator,
  MD2Colors,
  Button,
  Chip,
  Text,
} from "react-native-paper"
import { ListMembers } from "../../../components/ListMembers"
import clubs from "../../../mockResponses/getAllClubsResponse.json"
import clubRides from "../../../mockResponses/getAllClubRidesResponse.json"
import { useState } from "react"
import { RideCard } from "../../../components/RideCard"

const LeftContent = (props) => <Avatar.Icon {...props} icon="account-group" />

export const ClubDetailScreen = ({ route }) => {
  const { clubId } = route.params
  const [isEditMembers, setIsEditMembers] = useState(false)
  const [showClubRides, setShowClubRides] = useState(false)

  const club = clubs.filter((club) => club._id === clubId)[0]

  if (!club) {
    return <ActivityIndicator animating={true} color={MD2Colors.red800} />
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Title
            title={club.name}
            subtitle={club.city}
            left={LeftContent}
          />
          <Card.Content>
            <Text>The rides we do</Text>
            <View style={styles.tagContainer}>
              {club.tags.map((tag, index) => (
                <Chip key={index} style={styles.tag}>
                  {tag}
                </Chip>
              ))}
            </View>
            <View style={styles.countSection}>
              <View style={styles.countItem}>
                <Paragraph>Members</Paragraph>
                <Avatar.Text
                  size={30}
                  labelStyle={styles.avatarText}
                  label={club.cyclistCount}
                />
              </View>
              <Divider
                style={{
                  marginRight: 10,
                  alignItems: "center",
                  width: 1,
                  height: "100%",
                }}
              />
              <View style={styles.countItem}>
                <Paragraph>Activities</Paragraph>
                <Avatar.Text
                  size={30}
                  label={club.activitiesCount}
                  labelStyle={styles.avatarText}
                />
              </View>
            </View>
            {/** Component to show upcoming rides */}
            <ListMembers members={club.members} isEditMembers={isEditMembers} />
          </Card.Content>
          <Card.Actions>
            <Button onPress={() => setIsEditMembers(!isEditMembers)}>
              {isEditMembers ? "Cancel edit" : "Edit members"}{" "}
            </Button>
            <Button onPress={() => setShowClubRides(!showClubRides)}>
              {showClubRides ? "Hide Rides" : "Show Rides"}
            </Button>
          </Card.Actions>
        </Card>
        {showClubRides &&
          clubRides.map((ride, index) => (
            <RideCard
              key={index}
              ride={ride}
              rideClicked={() => console.log("clicked")}
            />
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
  card: {
    marginBottom: 20,
  },
  tagContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginHorizontal: 5,
    marginVertical: 10,
  },
  tag: {
    marginHorizontal: 5,
    marginVertical: 5,
  },
  countSection: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 5,
  },
  avatarText: {
    fontSize: 12,
  },
  countItem: { marginRight: 10, alignItems: "center" },
  dividerHorizontal: {
    marginTop: 15,
    height: 1,
  },
})
