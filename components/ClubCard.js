// UI
import { View, StyleSheet } from "react-native"
import { Avatar, Button, Card, Paragraph, Divider } from "react-native-paper"

const LeftContent = (props) => <Avatar.Icon {...props} icon="account-group" />

export const ClubCard = ({ club, clubClicked, createRideClicked }) => {
  return (
    <Card style={styles.card}>
      <Card.Title title={club.name} subtitle={club.city} left={LeftContent} />
      <Card.Content style={styles.countSection}>
        <View style={styles.countItem}>
          <Paragraph>Members</Paragraph>
          <Avatar.Text
            size={30}
            labelStyle={styles.avatarText}
            label={club.cyclistCount}
          />
        </View>
        <Divider style={[styles.countItem, { width: 1, height: "100%" }]} />
        <View style={styles.countItem}>
          <Paragraph>Activities</Paragraph>
          <Avatar.Text
            size={30}
            labelStyle={styles.avatarText}
            label={club.activitiesCount}
          />
        </View>
      </Card.Content>
      <Divider style={styles.dividerHorizontal} />
      <Card.Actions>
        <Button
          onPress={() => createRideClicked("CreateARide", club.name, club._id)}
        >
          Create a club ride
        </Button>
        <Button onPress={() => clubClicked("ClubDetail", club._id)}>
          View Club
        </Button>
      </Card.Actions>
    </Card>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
  countSection: {
    flexDirection: "row",
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
