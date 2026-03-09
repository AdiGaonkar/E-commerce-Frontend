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
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
  }

  const valideValue = Object.values(data).every(el => el)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await Axios({ ...SummaryApi.login, data })
      if (response?.data?.error) {
        toast.error(response.data.message || "Login failed ❌")
        return
      }
      if (response?.data?.success) {
        toast.success("Login successful 🎉")
        localStorage.setItem("accesstoken", response.data.data.accesstoken)
        localStorage.setItem("refreshToken", response.data.data.refreshToken)
        const userDetails = await fetchUserDetails()
        dispatch(setUserDetails(userDetails.data))
        setData({ email: "", password: "" })
        navigate("/")
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Invalid credentials ❌")
      } else {
        toast.error("Server not responding 🚨")
      }
      AxiosToastError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        .login-root {
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #050a06;
          position: relative;
          overflow: hidden;
          padding: 1rem;
        }

        /* Animated background orbs */
        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          animation: drift 12s ease-in-out infinite alternate;
        }
        .orb-1 {
          width: 520px; height: 520px;
          background: radial-gradient(circle, #00c94f, #005f25);
          top: -160px; left: -160px;
          animation-delay: 0s;
        }
        .orb-2 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #00ff87, #00a846);
          bottom: -140px; right: -100px;
          animation-delay: -5s;
        }
        .orb-3 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, #1aff76, #007a33);
          top: 50%; left: 55%;
          animation-delay: -2s;
        }
        @keyframes drift {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, 30px) scale(1.08); }
        }

        /* Noise grain overlay */
        .grain {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 180px;
        }

        /* Card */
        .card {
          position: relative;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px;
          padding: 44px 40px;
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          box-shadow: 0 0 0 1px rgba(0,200,80,0.08), 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08);
          animation: cardIn 0.7s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Top badge */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0,200,80,0.12);
          border: 1px solid rgba(0,200,80,0.25);
          border-radius: 999px;
          padding: 4px 12px;
          margin-bottom: 20px;
          animation: cardIn 0.7s 0.1s cubic-bezier(0.22,1,0.36,1) both;
        }
        .badge-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #00e060;
          box-shadow: 0 0 6px #00e060;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(0.8); }
        }
        .badge-text {
          font-size: 11px;
          font-weight: 500;
          color: #5dffa0;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        /* Heading */
        .heading {
          font-family: 'Syne', sans-serif;
          font-size: 34px;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
          margin-bottom: 6px;
          animation: cardIn 0.7s 0.15s cubic-bezier(0.22,1,0.36,1) both;
        }
        .heading span {
          background: linear-gradient(135deg, #00e060, #5dffa0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .subheading {
          font-size: 13.5px;
          color: rgba(255,255,255,0.38);
          margin-bottom: 32px;
          animation: cardIn 0.7s 0.2s cubic-bezier(0.22,1,0.36,1) both;
        }

        /* Divider line */
        .divider {
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent);
          margin-bottom: 28px;
        }

        /* Field */
        .field {
          margin-bottom: 18px;
          animation: cardIn 0.7s 0.25s cubic-bezier(0.22,1,0.36,1) both;
        }
        .field:last-of-type { animation-delay: 0.3s; }
        .field-label {
          display: block;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 8px;
        }
        .input-wrap {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 0 14px;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .input-wrap:focus-within {
          border-color: rgba(0,200,80,0.5);
          background: rgba(0,200,80,0.05);
          box-shadow: 0 0 0 3px rgba(0,200,80,0.08);
        }
        .input-wrap input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-size: 14.5px;
          font-family: 'DM Sans', sans-serif;
          padding: 13px 0;
        }
        .input-wrap input::placeholder { color: rgba(255,255,255,0.22); }
        .eye-btn {
          background: none;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
          font-size: 15px;
          transition: color 0.2s;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.7); }

        /* Forgot */
        .forgot {
          text-align: right;
          margin-top: 8px;
        }
        .forgot a {
          font-size: 12px;
          color: #5dffa0;
          text-decoration: none;
          opacity: 0.8;
          transition: opacity 0.2s;
        }
        .forgot a:hover { opacity: 1; text-decoration: underline; }

        /* Submit */
        .submit-btn {
          width: 100%;
          margin-top: 24px;
          padding: 14px;
          border-radius: 12px;
          border: none;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.03em;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          animation: cardIn 0.7s 0.35s cubic-bezier(0.22,1,0.36,1) both;
        }
        .submit-btn.active {
          background: linear-gradient(135deg, #00c94f, #00a03d);
          color: #fff;
          box-shadow: 0 4px 24px rgba(0,200,80,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .submit-btn.active:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(0,200,80,0.45), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .submit-btn.active:active { transform: translateY(0); }
        .submit-btn.disabled {
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.25);
          cursor: not-allowed;
        }

        /* Shimmer on button */
        .submit-btn.active::after {
          content: '';
          position: absolute;
          top: 0; left: -60%;
          width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          animation: shimmer 2.5s 1s infinite;
        }
        @keyframes shimmer {
          0%   { left: -60%; }
          100% { left: 140%; }
        }

        /* Spinner */
        .spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 8px;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer */
        .footer-text {
          text-align: center;
          margin-top: 28px;
          font-size: 13px;
          color: rgba(255,255,255,0.3);
          animation: cardIn 0.7s 0.4s cubic-bezier(0.22,1,0.36,1) both;
        }
        .footer-text a {
          color: #5dffa0;
          font-weight: 600;
          text-decoration: none;
          transition: opacity 0.2s;
        }
        .footer-text a:hover { opacity: 0.75; text-decoration: underline; }

        /* Bottom decorative line */
        .card-glow-line {
          position: absolute;
          bottom: 0; left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,200,80,0.6), transparent);
          border-radius: 0 0 24px 24px;
        }
      `}</style>

      <div className="login-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grain" />

        <div className="card">
          <div className="card-glow-line" />

          {/* Badge */}
          <div className="badge">
            <span className="badge-dot" />
            <span className="badge-text">Secure Login</span>
          </div>

          {/* Heading */}
          <h1 className="heading">Welcome <span>back.</span></h1>
          <p className="subheading">Sign in to your account to continue</p>

          <div className="divider" />

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="field-label">Email</label>
              <div className="input-wrap">
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label">Password</label>
              <div className="input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(p => !p)}
                >
                  {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
              <div className="forgot">
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={!valideValue || isLoading}
              className={`submit-btn ${valideValue && !isLoading ? 'active' : 'disabled'}`}
            >
              {isLoading && <span className="spinner" />}
              {isLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <p className="footer-text">
            Don't have an account?{" "}
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </>
  )
}

export default Login
