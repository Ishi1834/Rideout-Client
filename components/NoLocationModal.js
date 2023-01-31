import { StyleSheet } from "react-native"
import { Button, Portal, Modal, Text, Card } from "react-native-paper"

export const NoLocationModal = ({ handleBannerSelection, locationError }) => {
  return (
    <Portal>
      <Modal
        visible={locationError ? true : false}
        contentContainerStyle={styles.modalStyle}
        onDismiss={() => handleBannerSelection("Ok")}
      >
        <Text style={styles.modalText}>{locationError}</Text>
        <Card.Actions>
          <Button onPress={() => handleBannerSelection("Ok")}>Ok</Button>
          <Button onPress={() => handleBannerSelection("Location granted")}>
            Location granted
          </Button>
        </Card.Actions>
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  modalStyle: { backgroundColor: "white", padding: 20, marginHorizontal: 20 },
  modalText: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 15,
  },
})
