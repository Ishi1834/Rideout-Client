import { View, StyleSheet, ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Avatar, Button, Card, Paragraph, Divider } from "react-native-paper"
import clubs from "../../../mockResponses/getAllClubsResponse.json"

const LeftContent = (props) => <Avatar.Icon {...props} icon="account-group" />

export const MyClubsScreen = () => {
  const navigation = useNavigation()

  return (
    <ScrollView>
      <View style={styles.container}>
        {clubs.map((club, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title
              title={club.name}
              subtitle={club.location.coordinates}
              left={LeftContent}
            />
            <Card.Content style={styles.countSection}>
              <View style={styles.countItem}>
                <Paragraph>Members</Paragraph>
                <Avatar.Text
                  size={30}
                  labelStyle={styles.avatarText}
                  label={club.cyclistCount}
                />
              </View>
              <Divider
                style={[styles.countItem, { width: 1, height: "100%" }]}
              />
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
              <Button onPress={() => navigation.navigate("ClubDetail")}>
                View Club
              </Button>
            </Card.Actions>
          </Card>
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
