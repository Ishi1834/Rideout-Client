import { useState } from "react"
// UI
import { StyleSheet, View } from "react-native"
import { TextInput, Button, Text } from "react-native-paper"
// Other
import * as yup from "yup"

export const NumberSelector = ({
  initialNumber = 0,
  label = "",
  handleNumberChange,
  min = 1,
  max = 100,
  error = false,
  disabled = false,
}) => {
  const [selectedNumber, setSelectedNumber] = useState(initialNumber)

  const numberSchema = yup.object().shape({
    number: yup.number().required().min(min).max(max),
  })

  const checkNumberIsValid = async (number) => {
    const isValid = await numberSchema.isValid({ number })

    return isValid
  }

  const handleMinus = async () => {
    const newNum = selectedNumber - 1
    if (await checkNumberIsValid(newNum)) {
      setSelectedNumber(newNum)
      handleNumberChange(newNum)
    }
  }

  const handleAdd = async () => {
    const newNum = selectedNumber + 1
    if (await checkNumberIsValid(newNum)) {
      setSelectedNumber(newNum)
      handleNumberChange(newNum)
    }
  }

  const handleChange = async (number) => {
    const newNum = parseInt(number)
    if (await checkNumberIsValid(newNum)) {
      setSelectedNumber(newNum)
      handleNumberChange(newNum)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.numberContainer}>
        <Button
          icon="minus"
          style={styles.button}
          onPress={handleMinus}
          disabled={disabled}
        />

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={`${selectedNumber}`}
          mode="outlined"
          onChangeText={(number) => handleChange(number)}
          // if 1 character, return 0
          /*  onKeyPress={({ nativeEvent }) => console.log(nativeEvent)} */
          error={error}
          disabled={disabled}
        />

        <Button
          icon="plus"
          style={styles.button}
          onPress={handleAdd}
          disabled={disabled}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    marginVertical: 10,
  },
  label: {
    textAlign: "center",
  },
  numberContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: 40,
  },
  input: {
    textAlign: "center",
  },
})
