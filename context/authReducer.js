export const authReducer = (state, action) => {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...state,
        authToken: action.token,
        isLoading: false,
      }
    case "SIGN_IN":
      return {
        ...state,
        isSignout: false,
        authToken: action.token,
      }
    case "SIGN_OUT":
      return {
        ...state,
        isSignout: true,
        authToken: null,
      }
  }
}
