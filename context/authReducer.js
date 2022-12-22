export const authReducer = (state, action) => {
  switch (action.type) {
    case "RESTORE_TOKEN":
      return {
        ...state,
        authToken: action.token,
        userId: action.userId,
        isLoading: false,
      }
    case "SIGN_IN":
      return {
        ...state,
        isSignout: false,
        authToken: action.token,
        userId: action.userId,
      }
    case "SIGN_OUT":
      return {
        ...state,
        isSignout: true,
        authToken: null,
      }
  }
}
