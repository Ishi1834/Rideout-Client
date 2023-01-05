export const signInInitialValues = { username: "", password: "" }

export const signUpInitialValues = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
}

export const createARideInitialValues = {
  name: "",
  description: "",
  date: new Date(),
  rideType: "",
  startLocation: null,
  distance: 10,
  speed: 10,
  cafeStops: "",
  route: "",
}

export const createAClubInitialValues = {
  clubName: "",
  city: "",
  location: null,
}
