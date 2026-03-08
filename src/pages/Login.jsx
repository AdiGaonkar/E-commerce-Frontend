import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6"
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useNavigate } from 'react-router-dom'
import fetchUserDetails from '../utils/fetchUserDetails'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice'

const Login = () => {
  const [data, setData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const valideValue = Object.values(data).every(el => el)

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await Axios({
        ...SummaryApi.login,
        data
      })

      // error from backend
      if (response?.data?.error) {
        toast.error(response.data.message || "Login failed ❌")
        return
      }

      // success
      if (response?.data?.success) {
        toast.success("Login successful 🎉")

        localStorage.setItem("accesstoken", response.data.data.accesstoken)
        localStorage.setItem("refreshToken", response.data.data.refreshToken)

        const userDetails = await fetchUserDetails()
        dispatch(setUserDetails(userDetails.data))

        setData({
          email: "",
          password: ""
        })

        navigate("/")
      }

    } catch (error) {

      // backend error
      if (error.response) {
        toast.error(error.response.data.message || "Invalid credentials ❌")
      }
      // network error
      else {
        toast.error("Server not responding 🚨")
      }

      AxiosToastError(error)
    }
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-900 via-black to-green-800 px-4">

      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-8">

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h1>
          <p className="text-gray-500 text-sm mt-1">
            Login to continue
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-2 rounded-lg border bg-gray-50 focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1 flex items-center px-4 py-2 rounded-lg border bg-gray-50 focus-within:ring-2 focus-within:ring-green-600">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>

            <Link
              to="/forgot-password"
              className="block text-right text-sm mt-2 text-green-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <button
            disabled={!valideValue}
            className={`w-full py-2.5 rounded-lg font-semibold text-white transition-all
              ${valideValue
                ? "bg-green-700 hover:bg-green-600 shadow-lg"
                : "bg-gray-400 cursor-not-allowed"}
            `}
          >
            Login
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-green-700 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </section>
  )
}

export default Login
