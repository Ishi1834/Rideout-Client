// UI
import { ScrollView, StyleSheet, View } from "react-native"
import { Avatar, Card, DataTable, Divider, Text } from "react-native-paper"
// State
import { useSelector } from "react-redux"

export const ProfileScreen = () => {
  const state = useSelector((state) => state)

  const clubsAuthorization = state.clubs.authorization
  const clubsJoinRequestPending = state.clubs.pendingJoinRequests
  const userDetails = state.user

  const name = userDetails?.name

  const avatarLabel =
    name &&
    (name.split(" ").length === 1
      ? name.slice(0, 2)
      : `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`)

  return (
    <ScrollView>
      <View style={styles.container}>
        <Card>
          <Card.Title
            title={userDetails.username}
            titleVariant="headlineSmall"
            left={() => (
              <Avatar.Text size={60} label={avatarLabel?.toUpperCase()} />
            )}
            style={styles.title}
            leftStyle={styles.titleAvatar}
          />
          <Card.Content>
            <View style={styles.detailsContainer}>
              <View style={styles.details}>
                <Text style={styles.detailLabel} variant="labelLarge">
                  Name
                </Text>
                <Text>{userDetails.name}</Text>
              </View>
              <View style={styles.details}>
                <Text style={styles.detailLabel} variant="labelLarge">
                  Email
                </Text>
                <Text>{userDetails.email}</Text>
              </View>
              <Divider style={styles.divider} />
            </View>
            <View style={styles.tableContainer}>
              <Text variant="titleLarge" style={styles.tableTitle}>
                Clubs
              </Text>

              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={styles.tableClubName}>
                    Name
                  </DataTable.Title>
                  <DataTable.Title>Permission</DataTable.Title>
                </DataTable.Header>
                {clubsAuthorization.map((club, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell style={styles.tableClubName}>
                      {club.clubName}
                    </DataTable.Cell>
                    <DataTable.Cell>{club.authorization}</DataTable.Cell>
                  </DataTable.Row>
                ))}
                {clubsJoinRequestPending.map((club, index) => (
                  <DataTable.Row key={index}>
                    <DataTable.Cell style={styles.tableClubName}>
                      {club.name}
                    </DataTable.Cell>
                    <DataTable.Cell>Join Pending</DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </View>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    flexDirection: "column",
    marginTop: 10,
  },
  titleAvatar: {
    marginVertical: 10,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  detailsContainer: {
    alignItems: "center",
    paddingVertical: 10,
  },
  details: {
    flexDirection: "column",
    margin: 10,
    width: "90%",
  },
  detailLabel: {
    flexDirection: "row",
    alignContent: "flex-start",
    textAlign: "left",
    marginBottom: 5,
  },
  divider: {
    width: "90%",
    marginVertical: 10,
  },
  tableContainer: {
    margin: 5,
  },
  tableTitle: {
    textAlign: "center",
  },
  tableClubName: {
    flex: 2,
  },
})
