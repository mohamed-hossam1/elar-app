import * as Yup from "yup";

export const signUpValidationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
  phone: Yup.string()
    .matches(/^(010|011|012|015)[0-9]{8}$/, "Not valid phone number")
    .required("Phone Number is required"),
});

export const signInValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string().required("Password is required"),
  password: Yup.string().required("Password is required"),
});
