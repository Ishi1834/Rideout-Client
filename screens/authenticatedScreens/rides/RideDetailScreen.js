import { useState } from "react"
import { useNavigation } from "@react-navigation/native"
// UI
import { StyleSheet, View, ScrollView, Linking } from "react-native"
import {
  Avatar,
  Button,
  Card,
  Chip,
  MD2Colors,
  Divider,
  Text,
  Portal,
  Modal,
} from "react-native-paper"
import { PreviewMap } from "../../../components/PreviewMap"
import { ListMembers } from "../../../components/ListMembers"
// State
import { useDispatch, useSelector } from "react-redux"
import {
  addAUserRide,
  removeAClubRide,
  removeAUserRide,
} from "../../../state/ridesSlice"
// Other
import { format } from "date-fns"
import axios from "../../../axiosConfig"
import { TableList } from "../../../components/TableList"

const LeftContent = (props) => <Avatar.Icon {...props} icon="bike" />

export const RideDetailScreen = ({ route }) => {
  const { ride } = route.params
  const navigation = useNavigation()
  const userState = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [showDeleteride, setShowDeleteRide] = useState(false)

  const formatDate = () => format(new Date(ride.date), "h:mm b, EE dd/MM/yyyy")

  const deleteRideApiCall = async () => {
    let clubId = ""
    if (ride?.club?.clubId) {
      clubId = ride.club.clubId
    }
    try {
      const res = await axios.delete(`rides/${clubId}`, {
        data: { rideId: ride._id },
      })
      if (res.status === 200) {
        dispatch(removeAUserRide(ride._id))
        if (!clubId) {
          dispatch(removeAClubRide(ride._id))
        }
        navigation.goBack()
      }
    } catch (error) {
      console.log("Error - RideDetailScreen.js")
      console.log(error.response.data.message)
    }
  }

  const navigateToEdit = (screen, ride, rideName) => {
    navigation.navigate(screen, { ride, rideName })
  }

  const joinRideApiCall = async () => {
    const rideId = ride._id
    try {
      const res = await axios.patch("rides/join", { rideId })
      if (res.status === 200) {
        // if club ride then updated club ride state
        dispatch(addAUserRide(res.data.ride))
        navigation.navigate("MyRides")
      }
    } catch (error) {
      console.log("Error - RideDetailScreen.js")
      // handle error maybe use banner?
      console.log(error.response.data.message)
    }
  }

  const leaveRideApiCall = async () => {
    const rideId = ride._id
    try {
      const res = await axios.patch("rides/leave", { rideId })
      if (res.status === 200) {
        console.log("data ", res.data)
        // if club ride then updated club ride state
        dispatch(removeAUserRide(rideId))
        navigation.navigate("MyRides")
      }
    } catch (error) {
      console.log("Error - RideDetailScreen.js")
      // handle error maybe use banner?
      console.log(error.response.data.message)
    }
  }

  const rideCreatorId = ride.createdBy.userId
  const currentUserId = userState.userId
  const currentUserHasJoinedRide = ride.signedUpCyclists.find(
    (cyclist) => cyclist.userId === currentUserId
  )

  const getCyclistName = (array) => {
    return array.map((obj) => obj.name)
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <Portal>
          <Modal
            visible={showDeleteride}
            onDismiss={() => setShowDeleteRide(false)}
            contentContainerStyle={styles.modalStyle}
          >
            <Text style={styles.modalText}>
              Are you sure you want to delete this ride?
            </Text>
            <Card.Actions>
              <Button
                mode="contained"
                buttonColor={MD2Colors.redA200}
                onPress={deleteRideApiCall}
              >
                Yes
              </Button>
              <Button onPress={() => setShowDeleteRide(false)}>No</Button>
            </Card.Actions>
          </Modal>
        </Portal>

        <Card style={styles.card}>
          <Card.Title
            title={ride?.name}
            subtitle={`Posted by ${ride?.createdBy?.name}`}
            left={LeftContent}
          />
          <Card.Content>
            <Text style={styles.description} variant="headlineSmall">
              {ride?.description}
            </Text>
            <View style={styles.stats}>
              <Chip icon="calendar">{formatDate()}</Chip>
            </View>
            {ride?.route && (
              <View style={styles.routeContainer}>
                <Text variant="headlineSmall">Route</Text>
                <Text
                  style={styles.routeText}
                  onPress={() => Linking.openURL(ride.route)}
                >
                  {ride.route}
                </Text>
              </View>
            )}
            <View style={styles.mapContainer}>
              {ride?.startLocation?.coordinates && (
                <PreviewMap location={ride.startLocation.coordinates} />
              )}
            </View>
            <View
              style={[
                styles.stats,
                { justifyContent: "space-between", marginTop: 10 },
              ]}
            >
              <View style={styles.statsTag}>
                <View style={styles.stats}>
                  <View style={styles.statsItem}>
                    <Text variant="labelMedium">Distance</Text>
                    <Text variant="bodyMedium">{ride?.distance} km</Text>
                  </View>
                  <Divider
                    style={[styles.statsItem, { width: 1, height: "100%" }]}
                  />
                  <View style={styles.statsItem}>
                    <Text variant="labelMedium">Speed</Text>
                    <Text variant="bodyMedium">{ride?.speed} km/h</Text>
                  </View>
                </View>
                <Chip>{ride.rideType} ride</Chip>
              </View>
            </View>
            <TableList
              data={{
                headersArray: ["Cyclist"],
                rowsArray: getCyclistName(ride.signedUpCyclists),
              }}
            />
          </Card.Content>
          <Divider style={styles.dividerHorizontal} />
          {
            // check user can join ride
            rideCreatorId !== currentUserId && !currentUserHasJoinedRide && (
              <Card.Actions>
                <Button onPress={() => joinRideApiCall()}>
                  Join this ride
                </Button>
              </Card.Actions>
            )
          }
          {
            // check user can leave ride
            rideCreatorId !== currentUserId && currentUserHasJoinedRide && (
              <Card.Actions>
                <Button onPress={() => leaveRideApiCall()}>
                  leave this ride
                </Button>
              </Card.Actions>
            )
          }
          {
            // check user has edit/delete permission
            currentUserId === rideCreatorId && (
              <Card.Actions>
                <Button onPress={() => setShowDeleteRide(true)}>
                  Delete Ride
                </Button>
                {new Date() < new Date(ride.date) && (
                  <Button
                    onPress={() =>
                      navigateToEdit("EditARide", ride, ride?.name)
                    }
                  >
                    Edit Ride
                  </Button>
                )}
              </Card.Actions>
            )
          }
        </Card>
      </View>
    </ScrollView>
  )
}

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  card: {
    marginBottom: 20,
  },
  modalStyle: { backgroundColor: "white", padding: 20, marginHorizontal: 20 },
  modalText: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 15,
  },
  description: {
    marginBottom: 10,
  },
  mapContainer: {
    height: 300,
    borderColor: "black",
    borderWidth: 1,
    marginVertical: 10,
  },
  routeContainer: {
    marginVertical: 5,
  },
  routeText: {
    color: "blue",
  },
  statsTag: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  stats: {
    flexDirection: "row",
  },
  statsItem: { marginRight: 10, alignItems: "center" },
  dividerHorizontal: {
    marginTop: 15,
    height: 1,
  },
})
