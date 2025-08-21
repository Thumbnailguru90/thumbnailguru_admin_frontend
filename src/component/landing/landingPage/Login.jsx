// import React, { useState } from "react";
// import { FaEye, FaEyeSlash } from "react-icons/fa";
// import { Link, useNavigate } from "react-router-dom";
// import { message } from "antd";
// import { IP } from "../../utils/Constent";

// const Login = ({ onLogin }) => {
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (isSubmitting) return;

//     setLoading(true);
//     setIsSubmitting(true);

//     const endpoint = `${IP}/api/v1/admin/signIn`;
//     const bodyData = {
//       email: formData.email.toLowerCase(),
//       password: formData.password,
//     };

//     try {
//       const response = await fetch(endpoint, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "api-key": "kajal",
//         },
//         body: JSON.stringify(bodyData),
//       });

//       const result = await response.json();
//       console.log(result);

//       if (response.ok) {
//         const token = result.token;
//         localStorage.setItem("token", JSON.stringify(token));
//         localStorage.setItem("userID", result.id);
//         localStorage.setItem("role", result.role);

//         message.success("Login successful!");

//         // ✅ Now navigate directly
//         if (result.role === 2) {
//           navigate("/admin/dashboard");
//         } else {
//           navigate("/login");
//         }

//         setTimeout(() => {
//           setLoading(false);
//         }, 2000);
//       } else {
//         if (response.status === 401) {
//           message.error("Invalid credentials");
//         } else if (response.status === 404) {
//           message.error("Email not found");
//         } else {
//           message.error("Server error");
//         }
//         setLoading(false);
//       }
//     } catch (error) {
//       console.error("Error:", error);
//       message.error("An error occurred. Please try again later.");
//       setLoading(false);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-white p-4">
//       <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
//         <div className="text-center">
//           <img
//             src="/logo.png" // replace with your logo
//             alt="Logo"
//             className="w-16 mx-auto mb-2"
//           />
//           <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
//           <p className="text-gray-500 text-sm">Login to your account</p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Enter your email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">
//               Password
//             </label>
//             <div className="relative mt-1">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Enter your password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-2 border rounded-md pr-10 focus:ring-2 focus:ring-orange-300 focus:outline-none"
//               />
//               <div
//                 className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
//                 onClick={() => setShowPassword(!showPassword)}
//               >
//                 {showPassword ? <FaEyeSlash /> : <FaEye />}
//               </div>
//             </div>
//           </div>

//           <div className="text-right text-sm">
//             <Link
//               to="/forgot-password"
//               className="text-orange-500 hover:underline"
//             >
//               Forgot password?
//             </Link>
//           </div>

//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className={`w-full py-2 px-4 rounded-md text-white font-semibold bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition ${
//               isSubmitting ? "opacity-50 cursor-not-allowed" : ""
//             }`}
//           >
//             {loading ? "Logging in..." : "Login"}
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-600">
//           Don’t have an account?{" "}
//           <Link
//             to="/signup"
//             className="text-orange-500 font-medium hover:underline"
//           >
//             Sign Up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { message } from "antd";
import { IP } from "../../utils/Constent";

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");

  const [adminId, setAdminId] = useState(null); // store admin id for OTP
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Step 1: Normal login
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setLoading(true);
    setIsSubmitting(true);

    const endpoint = `${IP}/api/v1/admin/signIn`;
    const bodyData = {
      email: formData.email.toLowerCase(),
      password: formData.password,
    };

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
      console.log(result);

      if (response.ok) {
        const token = result.token;
        const role = result.role;
        const id = result.id;

        // Save token temporarily
        localStorage.setItem("token", JSON.stringify(token));
        localStorage.setItem("userID", id);
        localStorage.setItem("role", role);

        if (role === "admin") {
          // Step 2: Call Send OTP API
          setAdminId(id);
          await sendOtpRequest(id);
          setOtpStep(true); // show OTP input
        } else if (role === "superadmin") {
          navigate("/admin/dashboard");
        } else if (role === "staff") {
          navigate("/staff/users");
        } else if (role === "subadmin") {
          navigate("/subadmin/dashboard");
        } else {
          navigate("/unauthorized");
        }

        setLoading(false);
      } else {
        if (response.status === 401) {
          message.error("Invalid credentials");
        } else if (response.status === 404) {
          message.error("Email not found");
        } else {
          message.error("Server error");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
      message.error("An error occurred. Please try again later.");
      setLoading(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Call backend to send OTP
  const sendOtpRequest = async (id) => {
    try {
      const res = await fetch(`${IP}/api/v1/admin/send-otp/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (res.ok) {
        message.success("OTP sent to your mobile number");
      } else {
        message.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      message.error("Error sending OTP");
    }
  };

  // Step 3: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${IP}/api/v1/admin/verify-otp/${adminId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });

      const data = await res.json();
      if (res.ok) {
        message.success("OTP verified successfully");
        navigate("/admin/dashboard"); // final login success
      } else {
        message.error(data.message || "Invalid OTP");
      }
    } catch (error) {
      message.error("Error verifying OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-white p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6">
        {!otpStep ? (
          <>
            {/* --- Login Form --- */}
            <div className="text-center">
              <img src="/logo.png" alt="Logo" className="w-16 mx-auto mb-2" />
              <h1 className="text-2xl font-bold text-gray-800">Welcome Back</h1>
              <p className="text-gray-500 text-sm">Login to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-300 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-md pr-10 focus:ring-2 focus:ring-orange-300 focus:outline-none"
                  />
                  <div
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>

              <div className="text-right text-sm">
                <Link to="/forgot-password" className="text-orange-500 hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded-md text-white font-semibold bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* --- OTP Verification Form --- */}
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-800">Verify OTP</h1>
              <p className="text-gray-500 text-sm">Enter the OTP sent to your registered mobile</p>
            </div>

            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
                className="w-full px-4 py-2 border rounded-md text-center text-lg tracking-widest focus:ring-2 focus:ring-orange-300 focus:outline-none"
              />

              <button
                type="submit"
                className="w-full py-2 px-4 rounded-md text-white font-semibold bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 transition"
              >
                Verify OTP
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;

