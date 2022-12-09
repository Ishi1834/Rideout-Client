import * as yup from "yup"

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
