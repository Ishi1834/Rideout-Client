import { StyleSheet } from "react-native"
import { Portal, Modal, Text } from "react-native-paper"
import { Checkbox } from "./Checkbox"
import { RadioInput } from "./RadioInput"
import { Switch } from "./Switch"

export const FilterRides = ({
  visible,
  hideModal,
  filterMap,
  filterRides,
  filterClubs,
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalStyle}
      >
        <Text>Filter here</Text>

        <Switch
          handleChange={(val) => console.log("map ", val)}
          value={filterMap.showMap}
          label={filterMap.name}
        />

        {filterRides.map((item, index) => (
          <Checkbox
            label={item.label}
            key={index}
            isChecked={item.isChecked}
            handleCheckChange={(val) => console.log("index ", index, val)}
          />
        ))}

        <RadioInput
          radioData={filterClubs.data}
          radioLabel={filterClubs.label}
          itemSelected={(item) => console.log("item ", item)}
        />
      </Modal>
    </Portal>
  )
}

const styles = StyleSheet.create({
  modalStyle: {
    backgroundColor: "white",
    padding: 20,
  },
})
