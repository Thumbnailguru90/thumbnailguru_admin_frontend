import React, { useEffect, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import "../../../App.css";
import { FaApple, FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import login from "../../../assets/login.gif";
import { message } from "antd";
import loginImg from "../../../assets/login.gif";

import AOS from "aos";
import "aos/dist/aos.css";
import { IP } from "../../Utils/Constent";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setErrorMessage(""); // Clear error message on input change
  };

  // Inside Login Component

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    const endpoint = `${IP}/api/v1/logIn/user`;
    const bodyData = {
      email: formData.email.toLowerCase(),
      password: formData.password,
    };
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": "kajal",
        },
        body: JSON.stringify(bodyData),
      });

      const result = await response.json();
      // console.log(result);

      if (response.ok) {
        const token = result.token;
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("userID", result.user._id);
        localStorage.setItem("role", result.role);
        // toast.success("Login successfully.")

        // Call onLogin with the user's role to handle navigation
        onLogin(result.role, result.user);

        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } else {
        if (response.status === 401) {
          message.error("Invalid credentials");
        } else if (response.status === 404) {
          message.error("Mail not found");
        } else {
          message.error("Server error");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    AOS.init();
  }, []);

  return (
    <div className="flex justify-center items-center p-2 my-10">
      {/* {loading && <Loader />}  */}

      <div
        data-aos="zoom-in"
        data-aos-duration="3000"
        className="w-full flex p-2    justify-center  items-center"
      >
        <div className="border border-gray-300 rounded-md p-4 max-w-lg w-full flex flex-col myshadow ">
          <div className="sm:text-2xl text-xl font-bold flex flex-col  justify-center items-center -mb-7">
            <h1 className="text-gray-700 w-full flex justify-center gap-2 items-center ">
              <img className="w-12" src={login} alt="" /> Welcome to{" "}
              <strong className="text-[#544541]">FOX PILOTS </strong>
            </h1>
            {/* <h1 className='text-sm font-normal w-full flex justify-center items-center '>
          To get started, please sign in
          </h1> */}
          </div>
          <div className="font-bold sm:text-2xl text-xl relative -top-7 -right-2 ml-auto">
            <Link to="/home">
              <IoCloseCircleOutline />
            </Link>
          </div>
          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            <label
              className="text-xs px-1 font-semibold relative top-5 left-2 bg-white w-fit rounded-md"
              htmlFor="email"
            >
              Email
            </label>
            <input
              autoFocus
              className="border-2 pl-2 p-2 w-full rounded-sm"
              type="email"
              name="email"
              placeholder="Enter Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label
              className="text-xs px-1 font-semibold relative top-5 left-2 bg-white z-10 w-fit rounded-md"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="border-2 pl-2 p-2 w-full rounded-sm pr-10"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter Your Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                {showPassword ? (
                  <FaEyeSlash
                    onClick={togglePasswordVisibility}
                    className="cursor-pointer"
                  />
                ) : (
                  <FaEye
                    onClick={togglePasswordVisibility}
                    className="cursor-pointer"
                  />
                )}
              </div>
            </div>
            <button
              className={` buttonp divide-purple-300 text-white font-bold text-lg p-1.5 rounded-sm mt-4 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Logining..." : "Login"}
            </button>
          </form>

          <div className="flex flex-col gap-2 mt-4">
            <div className="text-gray-600 text-sm">
              <span>Don't have an account?</span>{" "}
              <Link to="/signup">
                <span className="text-[#D56A25]">Register Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
