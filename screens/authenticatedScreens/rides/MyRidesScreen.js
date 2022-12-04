import { View, ScrollView, StyleSheet, Pressable } from "react-native"
import { useNavigation } from "@react-navigation/native"
import {
  Avatar,
  Button,
  Card,
  Divider,
  Menu,
  Surface,
  Text,
} from "react-native-paper"
import rides from "../../../mockResponses/getAllClubRidesResponse.json"
import { useState } from "react"

const LeftContent = (props) => <Avatar.Icon {...props} icon="bike" />

export const MyRidesScreen = () => {
  const [menuVisible, setMenuVisible] = useState(false)
  const navigation = useNavigation()

  return (
    <ScrollView>
      <View style={styles.container}>
        {rides.map((ride, index) => (
          <Card key={index} style={styles.card}>
            <Card.Title
              title={ride.name}
              subtitle={`Posted by ${ride.createdBy.name}`}
              left={LeftContent}
            />
            <Card.Content>
              <Text style={styles.description} variant="headlineSmall">
                {ride.description}
              </Text>

              <View style={[styles.stats, { justifyContent: "space-between" }]}>
                <View style={styles.stats}>
                  <View style={styles.statsItem}>
                    <Text variant="labelMedium">Distance</Text>
                    <Text variant="bodyMedium">{ride.distance}</Text>
                  </View>
                  <Divider
                    style={[styles.statsItem, { width: 1, height: "100%" }]}
                  />
                  <View style={styles.statsItem}>
                    <Text variant="labelMedium">Speed</Text>
                    <Text variant="bodyMedium">{ride.speed}</Text>
                  </View>
                </View>
                {/* Popup menu on long press */}
                <Menu
                  visible={menuVisible}
                  onDismiss={() => setMenuVisible(false)}
                  anchor={
                    <Pressable
                      onLongPress={() => setMenuVisible(true)}
                      style={({ pressed }) => pressed && { elevation: 3 }}
                    >
                      <Surface elevation={1} style={styles.statsCyclists}>
                        <Text variant="labelMedium">Riders</Text>
                        <Text variant="bodyMedium">
                          {ride.signedUpCyclists.length}
                        </Text>
                      </Surface>
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
              <Button onPress={() => navigation.navigate("ClubDetail")}>
                View Ride
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
