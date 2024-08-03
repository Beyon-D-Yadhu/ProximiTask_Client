import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import instance from "../../helper/axiosInstance";

const SignUp = () => {
  const nav = useNavigate();
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      pass: "",
      conPass: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .matches(
          /[A-Za-z]/,
          "Name must contain at least one alphabetic character"
        )
        .matches(/^[A-Za-z\s]+$/, "Name can only contain letters and spaces")
        .required("Name is required"),
      email: Yup.string()
        .matches(
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          "Invalid email address"
        )
        .matches(/^\S*$/, "Email must not contain spaces")
        .required("Email is required"),
      pass: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/\d/, "Password must contain at least one number")
        .matches(
          /[@$!%*?&]/,
          "Password must contain at least one special character"
        )
        .matches(/^\S*$/, "Password must not contain spaces")
        .required("Password is required"),
      conPass: Yup.string()
        .oneOf([Yup.ref("pass"), null], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: (values) => {
      instance
        .post("/users/initiateSignup", {
          name: values.name,
          email: values.email,
          pass: values.pass,
        })
        .then((res) => {
          if (res?.data?.success) {
            nav("/Otp");
          } else {
            console.error("Signup failed: unexpected response structure", res);
          }
        });
    },
    validateOnBlur: true,
    validateOnChange: true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    formik.setTouched({
      name: true,
      email: true,
      pass: true,
      conPass: true,
    });
    setShowError(true);
    formik.handleSubmit(e);
  };

  return (
    <div className="w-full h-screen bg-emerald-200 flex justify-center items-center p-4">
      <div className="w-full max-w-md bg-[#F6FBF9] rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Create An Account
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.name && formik.errors.name && showError ? (
              <div className="text-red-500 text-sm">{formik.errors.name}</div>
            ) : null}
          </div>
          <div>
            <input
              type="email"
              name="email"
              className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && showError ? (
              <div className="text-red-500 text-sm">{formik.errors.email}</div>
            ) : null}
          </div>
          <div>
            <input
              type="password"
              name="pass"
              className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Password"
              value={formik.values.pass}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.pass && formik.errors.pass && showError ? (
              <div className="text-red-500 text-sm">{formik.errors.pass}</div>
            ) : null}
          </div>
          <div>
            <input
              type="password"
              name="conPass"
              className="w-full p-3 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
              placeholder="Confirm Password"
              value={formik.values.conPass}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.conPass && formik.errors.conPass && showError ? (
              <div className="text-red-500 text-sm">
                {formik.errors.conPass}
              </div>
            ) : null}
          </div>
          <button
            type="submit"
            className="w-full bg-[#84C7AE] text-white py-3 rounded-md mt-6 hover:bg-emerald-600 transition duration-300"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <span
            className="text-sky-400 underline cursor-pointer"
            onClick={() => nav("/UserLogin")}
          >
            Sign In
          </span>
        </p>
        <p className="text-center mt-2">or</p>
        <button className="w-full bg-white text-gray-700 py-3 px-4 rounded-md mt-2 border border-gray-300 hover:bg-gray-100 transition duration-300 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-6 h-6 mr-2"
          >
            <path
              fill="#FFC107"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
            />
            <path
              fill="#FF3D00"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
            />
            <path
              fill="#4CAF50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
            />
            <path
              fill="#1976D2"
              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
            />
          </svg>
          <span>Sign up with Google</span>
        </button>
      </div>
    </div>
  );
};

export default SignUp;
