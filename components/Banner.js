import { View } from "react-native"
import { Banner as BannerBase } from "react-native-paper"

export const Banner = ({ info, actions, buttonClicked }) => {
  const actionsArray = actions.map((action) => {
    return {
      label: action.label,
      onPress: () =>
        buttonClicked(action?.screen ? action.screen : action.label),
    }
  })

  return (
    <View>
      <BannerBase visible={true} actions={actionsArray}>
        {info}
      </BannerBase>
    </View>
  )
}
