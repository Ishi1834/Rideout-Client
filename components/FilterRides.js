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

  const getLabel = (array, value) => {
    return array.find((obj) => obj.value === value).label
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => {
          if (selectedNumber) {
            onMaxDistanceChange(selectedNumber)
          }
          hideModal()
        }}
        contentContainerStyle={styles.modalStyle}
      >
        <Switch
          handleChange={(val) => setFilter("map", val)}
          value={filterMap.showMap}
          label={filterMap.name}
        />
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

        {filterClubs && (
          <RadioInput
            radioData={filterClubs.data}
            preSelectedLabel={
              filterClubs?.selected
                ? getLabel(filterClubs.data, filterClubs.selected)
                : "Show All Club rides"
            }
            itemSelected={(item) => setFilter("setClub", item)}
          />
        )}
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
