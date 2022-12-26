import { StyleSheet, View } from "react-native"
import { Text, Switch as SwitchBase } from "react-native-paper"

export const Switch = ({ handleChange, value, data }) => {
  return (
    <View style={styles.switch}>
      <Text>{data[1]}</Text>
      <SwitchBase value={value} onChange={() => handleChange(!value)} />
      <Text>{data[0]}</Text>
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
