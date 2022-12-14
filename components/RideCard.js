import { format } from "date-fns"
import { useState } from "react"
import { StyleSheet, Pressable, View } from "react-native"
import {
  Avatar,
  Button,
  Card,
  Chip,
  Divider,
  Menu,
  Text,
} from "react-native-paper"

const LeftContent = (props) => <Avatar.Icon {...props} icon="bike" />

export const RideCard = ({ ride, rideClicked }) => {
  const [menuVisible, setMenuVisible] = useState(false)

  const formatDate = () => format(new Date(ride.date), "h:mm b, EE dd/MM/yyyy")

  return (
    <Card style={styles.card}>
      <Card.Title
        title={ride.name}
        subtitle={`Posted by ${ride.createdBy.name}`}
        left={LeftContent}
      />
      <Card.Content>
        <Text style={styles.description} variant="headlineSmall">
          {ride.description}
        </Text>
        <View style={styles.stats}>
          <Chip icon="calendar">{formatDate()}</Chip>
        </View>
        <View
          style={[
            styles.stats,
            { justifyContent: "space-between", marginTop: 10 },
          ]}
        >
          <View style={styles.stats}>
            <View style={styles.statsItem}>
              <Text variant="labelMedium">Distance</Text>
              <Text variant="bodyMedium">{ride.distance}</Text>
            </View>
            <Divider style={[styles.statsItem, { width: 1, height: "100%" }]} />
            <View style={styles.statsItem}>
              <Text variant="labelMedium">Speed</Text>
              <Text variant="bodyMedium">{ride.speed}</Text>
            </View>
          </View>

          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Pressable onLongPress={() => setMenuVisible(true)}>
                <Chip icon="information" mode="outlined">
                  {ride.signedUpCyclists.length} Cyclist
                  {ride.signedUpCyclists.length > 1 && "s"}
                </Chip>
              </Pressable>
            }
          >
            {ride.signedUpCyclists.map((cyclist, index) => (
              <Menu.Item key={index} title={cyclist.name} />
            ))}
          </Menu>
        </View>
      </Card.Content>
      <Divider style={styles.dividerHorizontal} />

      <Card.Actions>
        <Button onPress={() => rideClicked("RideDetail", ride._id)}>
          View Ride
        </Button>
      </Card.Actions>
    </Card>
  )
}

export const styles = StyleSheet.create({
  card: {
    marginBottom: 20,
  },
  description: {
    marginBottom: 10,
  },
  stats: {
    flexDirection: "row",
  },
  statsCyclists: {
    borderRadius: 5,
    paddingHorizontal: 5,
    alignItems: "center",
  },
  avatarText: {
    fontSize: 12,
  },
  statsItem: { marginRight: 10, alignItems: "center" },
  dividerHorizontal: {
    marginTop: 15,
    height: 1,
  },
})
