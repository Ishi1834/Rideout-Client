import * as yup from "yup"
import { rideTypeValues } from "./multiSelectOptions"

export const signInSchema = yup.object().shape({
  username: yup.string().required("Username is a required field"),
  password: yup.string().required("Password is a required field"),
})

export const signUpSchema = yup.object().shape({
  name: yup.string().required("Name is a required field"),
  username: yup.string().required("Username is a required field"),
  email: yup.string().email().required("Email is a required field"),
  password: yup.string().required("Password is a required field"),
  confirmPassword: yup
    .string()
    .required("Corfirm Password is a required field")
    .oneOf(
      [yup.ref("password")],
      "Confirm Password should match the Password field"
    ),
})

export const rideSchema = yup.object().shape({
  date: yup.date().required("Date is a required field"),
  name: yup.string().required("Ride name is a required field"),
  rideType: yup
    .string()
    .oneOf(rideTypeValues)
    .required("Ride Type should be selected"),
  startLocation: yup
    .array()
    .of(yup.number())
    .required("Start location is a required field")
    .typeError("Start location is a required field"),
  distance: yup.number().required(),
  speed: yup.number().required(),
  description: yup.string().required("Ride description is a required field"),
  cafeStops: yup.string(),
  route: yup.string().url(),
})

export const clubSchema = yup.object().shape({
  clubName: yup.string().required("Club name is a required field"),
  city: yup.string().required("City is a required field"),
  location: yup
    .array()
    .of(yup.number())
    .required("Club location is a required field")
    .typeError("Club location is a required field"),
  description: yup.string(),
})
