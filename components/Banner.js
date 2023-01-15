import { StyleSheet, View } from "react-native"
import { Banner as BannerBase } from "react-native-paper"

export const Banner = ({ info, actions, buttonClicked }) => {
  const actionsArray = actions.map((action) => {
    return {
      label: action?.label,
      onPress: () =>
        buttonClicked(action?.screen ? action.screen : action?.label),
    }
  })

  return (
    <View>
      <BannerBase visible={true} actions={actionsArray} style={styles.banner}>
        {info}
      </BannerBase>
    </View>
  )
}

const styles = StyleSheet.create({
  banner: {
    marginBottom: 10,
  },
})
