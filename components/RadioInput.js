import { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { Button, RadioButton } from "react-native-paper"

export const RadioInput = ({
  radioData,
  radioLabel,
  itemSelected,
  disabled,
  preSelectedLabel,
}) => {
  const [showRadio, setShowRadio] = useState(false)
  const [groupLabel, setGroupLabel] = useState()
  const [selectedItem, setSelectedItem] = useState("")

  useEffect(() => {
    if (preSelectedLabel) {
      const item = radioData.find((obj) => obj.label === preSelectedLabel)

      setGroupLabel(item.label)
      setSelectedItem(item.value)
    }
  }, [])

  useEffect(() => {
    if (selectedItem) {
      const label = radioData.find((obj) => obj.value === selectedItem).label
      setGroupLabel(label)
      itemSelected(selectedItem)
    }
  }, [selectedItem])

  return (
    <View style={styles.container}>
      <Button
        icon="chevron-down"
        mode="contained-tonal"
        style={styles.button}
        contentStyle={styles.buttonContent}
        onPress={() => setShowRadio(!showRadio)}
        disabled={disabled}
      >
        {selectedItem ? groupLabel : radioLabel}
      </Button>
      {showRadio && (
        <RadioButton.Group
          onValueChange={(value) => {
            setSelectedItem(value)
            setShowRadio(false)
          }}
          value={selectedItem}
        >
          {radioData.map((item, index) => (
            <RadioButton.Item
              key={index}
              label={item.label}
              value={item.value}
            />
          ))}
        </RadioButton.Group>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  button: {
    borderRadius: 0,
  },
  buttonContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
})
