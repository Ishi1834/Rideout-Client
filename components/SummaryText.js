import { StyleSheet, View } from "react-native"
import { HelperText } from "react-native-paper"

export const SummaryText = ({ message, isInfo }) => {
  return (
    <View>
      <HelperText
        type={isInfo ? "info" : "error"}
        visible={true}
        style={[styles.text, isInfo && { color: "green" }]}
      >
        {message}
      </HelperText>
    </View>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    textAlign: "center",
  },
})
