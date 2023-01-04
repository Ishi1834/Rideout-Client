import { useState } from "react"
import { StyleSheet } from "react-native"
import { Portal, Modal } from "react-native-paper"
import { Checkbox } from "./Checkbox"
import { NumberSelector } from "./NumberSelector"
import { RadioInput } from "./RadioInput"
import { Switch } from "./Switch"

export const FilterRides = ({
  visible,
  hideModal,
  filterMap,
  filterRides,
  filterClubs,
  setFilter,
  maxDistance,
  onMaxDistanceChange,
}) => {
  const [selectedNumber, setSelectedNumber] = useState(null)
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => {
          onMaxDistanceChange(selectedNumber)
          hideModal()
        }}
        contentContainerStyle={styles.modalStyle}
      >
        <Switch
          handleChange={(val) => setFilter("map", val)}
          value={filterMap.showMap}
          label={filterMap.name}
        />
        {/* Implement debounce for max distance selection */}
        <NumberSelector
          label="Max Distance"
          initialNumber={maxDistance}
          handleNumberChange={(number) => {
            setSelectedNumber(number)
          }}
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
