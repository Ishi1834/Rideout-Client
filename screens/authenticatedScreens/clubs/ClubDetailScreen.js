import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
// UI
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
  Portal,
  Modal,
} from "react-native-paper"
import { ListMembers } from "../../../components/ListMembers"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { PreviewMap } from "../../../components/PreviewMap"
// State
import { useSelector, useDispatch } from "react-redux"
import { removeAClub } from "../../../state/clubsSlice"
import { addPendingClubRequest } from "../../../state/clubsSlice"
// Other
import axios from "../../../axiosConfig"

const LeftContent = (props) => <Avatar.Icon {...props} icon="account-group" />

export const ClubDetailScreen = ({ route }) => {
  const { club } = route.params
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const clubsState = useSelector((state) => state.clubs)
  const [isMakingApiRequest, setIsMakingApiRequest] = useState(false)
  const [isEditMembers, setIsEditMembers] = useState(false)
  const [showDeleteClub, setShowDeleteClub] = useState(false)

  const userRole = clubsState.authorization.find(
    (obj) => obj.clubId === club._id
  )?.authorization

  const userRequestedToJoinJoinClub = !!clubsState.pendingJoinRequests.find(
    (clubObj) => clubObj.clubId === club._id
  )

  useEffect(() => {
    if (userRole === "admin" || userRole === "editor") {
      navigation.setOptions({
        headerRight: ({ tintColor }) => (
          <MaterialCommunityIcons
            name="plus"
            style={{ marginRight: 15 }}
            size={22}
            color={tintColor}
            onPress={() => navigateToCreateARide()}
          />
        ),
      })
    }
  }, [navigation])

  const deleteClubApiCall = async () => {
    setIsMakingApiRequest(true)
    try {
      const res = await axios.delete(`/clubs/${club._id}`)
      if (res.status === 200) {
        setShowDeleteClub(false)
        navigation.navigate("MyClubs", {
          message: res?.data?.message,
        })
        dispatch(removeAClub(club._id))
      }
    } catch (error) {
      console.log("Error - ClubDetailScreen.js")
      console.log(error)
    }
    setIsMakingApiRequest(false)
  }

  const navigateToCreateARide = () => {
    navigation.navigate("CreateARide", {
      clubName: club.name,
      clubId: club._id,
    })
  }

  const navigateToEditClub = (screen, club, clubName) => {
    navigation.navigate(screen, { club, clubName })
  }

  const joinClubApiCall = async () => {
    setIsMakingApiRequest(true)
    try {
      const res = await axios.patch("/clubs/join", { clubId: club._id })
      if (res.status === 200) {
        dispatch(
          addPendingClubRequest({
            name: club.name,
            clubId: club._id,
          })
        )
      }
    } catch (error) {
      console.log("Error - ClubDetailScreen.js")
      console.log(error.response.data.message)
    }
    setIsMakingApiRequest(false)
  }

  if (!club) {
    return <ActivityIndicator animating={true} color={MD2Colors.red800} />
  }
  return (
    <ScrollView>
      <View style={styles.container}>
        <Portal>
          <Modal
            visible={showDeleteClub}
            onDismiss={() => setShowDeleteClub(false)}
            contentContainerStyle={styles.modalStyle}
          >
            <Text style={styles.modalText}>
              Are you sure you want to delete this club?
            </Text>
            <Card.Actions>
              <Button
                loading={isMakingApiRequest && true}
                disabled={isMakingApiRequest && true}
                mode="contained"
                buttonColor={MD2Colors.redA200}
                onPress={deleteClubApiCall}
              >
                Yes
              </Button>
              <Button
                loading={isMakingApiRequest && true}
                disabled={isMakingApiRequest && true}
                onPress={() => setShowDeleteClub(false)}
              >
                No
              </Button>
            </Card.Actions>
          </Modal>
        </Portal>

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
            <View style={styles.mapContainer}>
              {club.location.coordinates && (
                <PreviewMap location={club.location.coordinates} />
              )}
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
            <ListMembers members={club.members} isEditMembers={isEditMembers} />
          </Card.Content>
          {/* undefined userRole means user hasn't joined club */}
          {!userRole && (
            <Card.Actions>
              <Button
                loading={
                  userRequestedToJoinJoinClub
                    ? false
                    : isMakingApiRequest && true
                }
                disabled={
                  userRequestedToJoinJoinClub
                    ? true
                    : isMakingApiRequest && true
                }
                onPress={() => joinClubApiCall()}
              >
                {userRequestedToJoinJoinClub
                  ? "Join request is pending"
                  : "Request to Join this Club"}
              </Button>
            </Card.Actions>
          )}

          {userRole === "admin" && (
            <>
              <Card.Actions>
                <Button
                  loading={isMakingApiRequest && true}
                  disabled={isMakingApiRequest && true}
                  onPress={() => setIsEditMembers(!isEditMembers)}
                >
                  {isEditMembers ? "Cancel edit" : "Edit members"}{" "}
                </Button>
              </Card.Actions>
              <Card.Actions>
                <Button
                  loading={isMakingApiRequest && true}
                  disabled={isMakingApiRequest && true}
                  onPress={() => {
                    setShowDeleteClub(true)
                  }}
                >
                  Delete Club
                </Button>
                <Button
                  loading={isMakingApiRequest && true}
                  disabled={isMakingApiRequest && true}
                  onPress={() =>
                    navigateToEditClub("EditAClub", club, club.name)
                  }
                >
                  Edit Club
                </Button>
              </Card.Actions>
            </>
          )}
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
  card: {
    marginBottom: 20,
  },
  modalStyle: { backgroundColor: "white", padding: 20, marginHorizontal: 20 },
  modalText: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 15,
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
  mapContainer: {
    height: 300,
    borderColor: "black",
    borderWidth: 1,
    marginVertical: 10,
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
