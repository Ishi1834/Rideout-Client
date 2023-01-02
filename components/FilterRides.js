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
  setFilter,
}) => {
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={styles.modalStyle}
      >
        <Switch
          handleChange={(val) => setFilter("map", val)}
          value={filterMap.showMap}
          label={filterMap.name}
        />

        {filterRides.map((item, index) => (
          <Checkbox
            label={item.label}
            key={index}
            isChecked={item.isChecked}
            handleCheckChange={(val) => setFilter("checkbox", index, val)}
          />
        ))}

        <RadioInput
          radioData={filterClubs.data}
          radioLabel={filterClubs.label}
          itemSelected={(item) => setFilter("setClub", item)}
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
