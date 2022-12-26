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
  },
})
