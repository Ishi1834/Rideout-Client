import { useState } from "react"
import { StyleSheet, View } from "react-native"
import { Portal, Modal, Button } from "react-native-paper"
import { Checkbox } from "./Checkbox"
import { NumberSelector } from "./NumberSelector"
import { RadioInput } from "./RadioInput"
import { Switch } from "./Switch"
import DateTimePicker from "@react-native-community/datetimepicker"
import { formatDate } from "../utils/formatDate"

export const FilterRides = ({
  visible,
  hideModal,
  filterMap,
  filterRides,
  filterClubs,
  setFilter,
  maxDistance,
  onMaxDistanceChange,
  userLocation,
  sortRides,
  sortRidesSelected,
  setSortRidesSelected,
}) => {
  const [selectedNumber, setSelectedNumber] = useState(null)
  const [showDateRange, setShowDateRange] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [fromDate, setFromDate] = useState(new Date())
  const [toDate, setToDate] = useState(new Date())

  const getLabel = (array, value) => {
    return array.find((obj) => obj.value === value).label
  }

  const handleDateSelect = (date) => {
    setShowDatePicker(false)
    if (showDatePicker === "fromDate") {
      setFromDate(date)
      if (toDate < date) {
        setToDate(date)
      }
    } else {
      setToDate(date)
    }
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
        {sortRides && (
          <RadioInput
            radioData={sortRides}
            preSelectedLabel={getLabel(sortRides, sortRidesSelected)}
            itemSelected={(val) => setSortRidesSelected(val)}
          />
        )}
        <NumberSelector
          label="Open Rides Max Distance"
          initialNumber={maxDistance}
          handleNumberChange={(number) => {
            setSelectedNumber(number)
          }}
          disabled={userLocation ? false : true}
        />
        <Checkbox
          label="Date range"
          isChecked={showDateRange}
          handleCheckChange={() => setShowDateRange(!showDateRange)}
        />
        <View style={styles.dateContainer}>
          <Button mode="text" onPress={() => setShowDatePicker("fromDate")}>
            From {formatDate(fromDate)}
          </Button>
          {showDateRange && (
            <Button mode="text" onPress={() => setShowDatePicker("toDate")}>
              To {formatDate(toDate)}
            </Button>
          )}
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={showDatePicker === "fromDate" ? fromDate : toDate}
            mode="date"
            onChange={(e, date) => handleDateSelect(date)}
          />
        )}

        <View style={styles.rideType}>
          {filterRides.map((item, index) => (
            <Checkbox
              label={item.label}
              key={index}
              isChecked={item.isChecked}
              handleCheckChange={(val) => setFilter("checkbox", index, val)}
            />
          ))}
        </View>

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
  rideType: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 10,
  },
})
