import { StyleSheet, View } from "react-native"
import { Text, Switch as SwitchBase } from "react-native-paper"

export const Switch = ({ handleChange, value, label }) => {
  return (
    <View style={styles.switch}>
      <Text>{label}</Text>
      <SwitchBase value={value} onChange={() => handleChange(!value)} />
    </View>
  )
}

const styles = StyleSheet.create({
  switch: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
})
