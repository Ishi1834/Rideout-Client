import { useEffect, useState } from "react"
import { View, StyleSheet } from "react-native"
import { Button, RadioButton } from "react-native-paper"

export const RadioInput = ({
  radioData,
  radioLabel,
  itemSelected,
  disabled,
}) => {
  const [showRadio, setShowRadio] = useState(false)
  const [selectedItem, setSelectedItem] = useState("")

  useEffect(() => {
    if (selectedItem) {
      itemSelected(selectedItem)
    }
  }, [selectedItem])

  return (
    <View>
      <Button
        icon="chevron-down"
        mode="contained-tonal"
        style={styles.button}
        contentStyle={styles.buttonContent}
        onPress={() => setShowRadio(!showRadio)}
        disabled={disabled}
      >
        {!selectedItem ? radioLabel : selectedItem}
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
            <RadioButton.Item key={index} label={item} value={item} />
          ))}
        </RadioButton.Group>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 0,
  },
  buttonContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
})
