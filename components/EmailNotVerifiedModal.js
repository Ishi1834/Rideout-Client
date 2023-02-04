import { useState } from "react"
import { StyleSheet } from "react-native"
import { Button, Portal, Modal, Text, Card } from "react-native-paper"
import { emailNotVerifiedContent } from "../static/modalContent"

export const EmailNotVerifiedModal = ({
  handleDismiss,
  emailVerified,
  modalDismissable,
}) => {
  const [showModal, setShowModal] = useState(!emailVerified ? true : false)
  return (
    <Portal>
      <Modal
        visible={showModal}
        contentContainerStyle={styles.modalStyle}
        onDismiss={() => {
          setShowModal(false)
          handleDismiss()
        }}
        dismissable={modalDismissable}
      >
        <Text style={styles.modalText}>{emailNotVerifiedContent}</Text>
        <Card.Actions>
          <Button
            onPress={() => {
              setShowModal(false)
              handleDismiss()
            }}
          >
            Ok
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
