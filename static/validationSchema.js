import * as yup from "yup"
import { rideTypeArray } from "./multiSelectOptions"

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
  date: yup.date().required(),
  name: yup.string().required(),
  rideType: yup.string().oneOf(rideTypeArray).required(),
  startLocation: yup.array().of(yup.number()).required(),
  distance: yup.number().required(),
  speed: yup.number().required(),
  description: yup.string().required(),
  cafeStops: yup.string(),
  route: yup.string().url(),
})

export const createAClubSchema = yup.object().shape({
  clubName: yup.string().required(),
  city: yup.string().required(),
  location: yup.array().of(yup.number()).required(),
})
