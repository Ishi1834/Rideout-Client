import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
// UI
import { StyleSheet, View, ScrollView } from "react-native"
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
// State
import { useDispatch } from "react-redux"
import {
  removeAClubRide,
  removeAUserRide,
  setUpClubRides,
} from "../../../state/ridesSlice"
// Other
import { format } from "date-fns"
import axios from "../../../axiosConfig"
import { PreviewMap } from "../../../components/PreviewMap"
import { ListMembers } from "../../../components/ListMembers"

const LeftContent = (props) => <Avatar.Icon {...props} icon="bike" />

export const RideDetailScreen = ({ route }) => {
  const { ride } = route.params
  const navigation = useNavigation()
  const dispatch = useDispatch()
  const [showDeleteride, setShowDeleteRide] = useState(false)

  const formatDate = () => format(new Date(ride.date), "h:mm b, EE dd/MM/yyyy")

  const deleteRideApiCall = async () => {
    let clubId = ""
    if (ride?.club?.clubId) {
      clubId = ride.club.clubId
    }
    console.log("delete ", `rides/${clubId}`)
    /* try {
      const res = await axios.delete(`rides/${clubId}`, { data: { rideId: ride._id } })
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
    } */
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
                    <Text variant="bodyMedium">{ride?.distance}</Text>
                  </View>
                  <Divider
                    style={[styles.statsItem, { width: 1, height: "100%" }]}
                  />
                  <View style={styles.statsItem}>
                    <Text variant="labelMedium">Speed</Text>
                    <Text variant="bodyMedium">{ride?.speed}</Text>
                  </View>
                </View>
                <Chip>{ride.rideType} ride</Chip>
              </View>
            </View>
            <ListMembers members={ride.signedUpCyclists} label="Cyclists" />
          </Card.Content>
          <Divider style={styles.dividerHorizontal} />

          <Card.Actions>
            <Button onPress={() => setShowDeleteRide(true)}>Delete Ride</Button>
            <Button onPress={() => editClicked("EditARide", ride, ride?.name)}>
              Edit Ride
            </Button>
          </Card.Actions>
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
