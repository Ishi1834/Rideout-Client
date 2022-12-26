import { View } from "react-native"
import { Banner as BannerBase } from "react-native-paper"

export const Banner = ({ info, actions, buttonClicked }) => {
  const actionsArray = actions.map((action) => {
    return {
      label: action.label,
      onPress: () => buttonClicked(action.screen),
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
