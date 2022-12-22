import { StyleSheet, View } from "react-native"
import { HelperText } from "react-native-paper"

export const ErrorText = ({ errorMessage }) => {
  return (
    <View>
      <HelperText type="error" visible={true} style={styles.error}>
        {errorMessage}
      </HelperText>
    </View>
  )
}

const styles = StyleSheet.create({
  error: {
    fontSize: 16,
    textAlign: "center",
  },
})
