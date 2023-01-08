import { View, StyleSheet } from "react-native"
import { Text, Checkbox as CheckboxBase } from "react-native-paper"

export const Checkbox = ({ label, isChecked, handleCheckChange }) => {
  return (
    <View style={styles.checkbox}>
      <Text>{label}</Text>
      <CheckboxBase
        status={isChecked ? "checked" : "unchecked"}
        onPress={() => handleCheckChange(!isChecked)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    margin: 6,
    backgroundColor: "rgba(231, 224, 236, 1)",
    borderColor: "rgba(125, 82, 96, 1)",
  },
  tick: {
    backgroundColor: "yellow",
  },
})
