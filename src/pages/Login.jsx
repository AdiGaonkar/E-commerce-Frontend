import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6"
import { BsCart3, BsShieldCheck, BsTruck, BsStarFill } from "react-icons/bs"
import { HiOutlineSparkles } from "react-icons/hi2"
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useNavigate } from 'react-router-dom'
import fetchUserDetails from '../utils/fetchUserDetails'
import { useDispatch } from 'react-redux'
import { setUserDetails } from '../store/userSlice'

const PERKS = [
  { icon: BsTruck, label: "Free delivery on orders ₹499+" },
  { icon: BsShieldCheck, label: "100% secure & encrypted checkout" },
  { icon: HiOutlineSparkles, label: "10-minute express delivery" },
]

const FLOATING_ITEMS = [
  { emoji: "🛒", top: "12%", left: "8%", delay: "0s", size: "28px" },
  { emoji: "⚡", top: "20%", right: "10%", delay: "0.6s", size: "22px" },
  { emoji: "🏷️", top: "65%", left: "5%", delay: "1.2s", size: "26px" },
  { emoji: "📦", top: "75%", right: "7%", delay: "0.3s", size: "24px" },
  { emoji: "💳", top: "42%", left: "3%", delay: "0.9s", size: "20px" },
  { emoji: "🎁", top: "50%", right: "4%", delay: "1.5s", size: "22px" },
]

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
      if (error.response) toast.error(error.response.data.message || "Invalid credentials ❌")
      else toast.error("Server not responding 🚨")
      AxiosToastError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }

        .lg-root {
          font-family: 'Outfit', sans-serif;
          min-height: 100vh;
          display: flex;
          background: #f8faf8;
          overflow: hidden;
          position: relative;
        }

        /* LEFT PANEL */
        .lg-left {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          width: 46%;
          min-height: 100vh;
          background: linear-gradient(160deg, #14532d 0%, #166534 40%, #15803d 75%, #16a34a 100%);
          padding: 56px 52px;
          position: relative;
          overflow: hidden;
        }
        @media (min-width: 1024px) { .lg-left { display: flex; } }

        .lg-circle {
          position: absolute; border-radius: 50%;
          background: rgba(255,255,255,0.05); pointer-events: none;
        }
        .lg-circle-1 { width: 360px; height: 360px; bottom: -100px; right: -90px; }
        .lg-circle-2 { width: 180px; height: 180px; top: -30px; right: 50px; background: rgba(255,255,255,0.04); }
        .lg-circle-3 { width: 110px; height: 110px; top: 40%; left: -28px; background: rgba(255,255,255,0.06); }

        .lg-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size: 44px 44px;
        }

        .lg-float {
          position: absolute;
          animation: lg-bob 4s ease-in-out infinite alternate;
          font-size: var(--sz); opacity: 0.5;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.15));
          pointer-events: none;
        }
        @keyframes lg-bob {
          0%   { transform: translateY(0px) rotate(-4deg); }
          100% { transform: translateY(-14px) rotate(4deg); }
        }

        .lg-brand {
          display: flex; align-items: center; gap: 10px;
          margin-bottom: 48px; position: relative; z-index: 1;
        }
        .lg-brand-icon {
          width: 42px; height: 42px;
          background: rgba(255,255,255,0.13);
          border-radius: 13px; border: 1px solid rgba(255,255,255,0.18);
          display: flex; align-items: center; justify-content: center;
          backdrop-filter: blur(6px);
        }
        .lg-brand-name { font-size: 20px; font-weight: 800; color: #fff; letter-spacing: -0.4px; }
        .lg-brand-name span { color: #86efac; }

        .lg-headline {
          font-size: 44px; font-weight: 900; color: #fff;
          line-height: 1.06; letter-spacing: -1.5px; margin-bottom: 14px;
          position: relative; z-index: 1;
        }
        .lg-headline em {
          font-style: normal;
          background: linear-gradient(135deg, #86efac, #4ade80);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .lg-sub {
          font-size: 14.5px; color: rgba(255,255,255,0.58); line-height: 1.65;
          max-width: 330px; margin-bottom: 44px; position: relative; z-index: 1;
        }

        .lg-perks { display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 1; }
        .lg-perk {
          display: flex; align-items: center; gap: 12px;
          background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.11);
          border-radius: 12px; padding: 11px 15px; backdrop-filter: blur(4px);
          animation: lg-slidein 0.5s both;
        }
        .lg-perk:nth-child(2) { animation-delay: 0.1s; }
        .lg-perk:nth-child(3) { animation-delay: 0.2s; }
        @keyframes lg-slidein {
          from { opacity: 0; transform: translateX(-18px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .lg-perk-icon {
          width: 32px; height: 32px; background: rgba(134,239,172,0.15);
          border-radius: 8px; display: flex; align-items: center; justify-content: center;
          color: #86efac; font-size: 15px; flex-shrink: 0;
        }
        .lg-perk-text { font-size: 13px; font-weight: 500; color: rgba(255,255,255,0.82); }

        .lg-rating {
          display: inline-flex; align-items: center; gap: 7px;
          background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.14);
          border-radius: 999px; padding: 6px 14px; margin-top: 32px;
          position: relative; z-index: 1;
        }
        .lg-stars { display: flex; gap: 2px; color: #fbbf24; font-size: 10px; }
        .lg-rating-text { font-size: 12px; color: rgba(255,255,255,0.65); font-weight: 500; }

        /* RIGHT PANEL */
        .lg-right {
          flex: 1; display: flex; align-items: center; justify-content: center;
          padding: 32px 20px; position: relative; background: #f8faf8;
        }
        .lg-right-bg {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(22,163,74,0.05) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(22,163,74,0.05) 0%, transparent 50%);
        }

        .lg-card {
          width: 100%; max-width: 428px;
          background: #fff; border-radius: 24px;
          padding: 44px 40px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.02), 0 24px 60px rgba(0,0,0,0.08);
          border: 1px solid rgba(0,0,0,0.06);
          position: relative; z-index: 1;
          animation: lg-cardin 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes lg-cardin {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .lg-mobile-brand {
          display: flex; align-items: center; gap: 8px; margin-bottom: 26px;
        }
        @media (min-width: 1024px) { .lg-mobile-brand { display: none; } }
        .lg-mobile-icon {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #16a34a, #15803d);
          border-radius: 10px; display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 15px;
        }
        .lg-mobile-name { font-size: 17px; font-weight: 800; color: #0f172a; letter-spacing: -0.4px; }
        .lg-mobile-name span { color: #16a34a; }

        .lg-tag {
          display: inline-flex; align-items: center; gap: 6px;
          background: #f0fdf4; border: 1px solid #bbf7d0;
          border-radius: 999px; padding: 4px 12px; margin-bottom: 16px;
          font-size: 11px; font-weight: 600; color: #16a34a;
          letter-spacing: 0.06em; text-transform: uppercase;
        }
        .lg-tag-dot {
          width: 5px; height: 5px; background: #16a34a; border-radius: 50%;
          animation: lg-pulse 2s infinite;
        }
        @keyframes lg-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

        .lg-title {
          font-size: 27px; font-weight: 800; color: #0f172a;
          letter-spacing: -0.7px; margin-bottom: 4px; line-height: 1.15;
        }
        .lg-subtitle { font-size: 13px; color: #94a3b8; margin-bottom: 28px; }

        .lg-sep {
          height: 1px;
          background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
          margin-bottom: 26px;
        }

        /* Google btn */
        .lg-google {
          width: 100%; padding: 12px;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          background: #fff; font-family: 'Outfit', sans-serif;
          font-size: 14px; font-weight: 600; color: #374151; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .lg-google:hover {
          border-color: #d1d5db; background: #f9fafb;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        }

        .lg-or {
          display: flex; align-items: center; gap: 12px; margin: 20px 0;
        }
        .lg-or-line { flex: 1; height: 1px; background: #f1f5f9; }
        .lg-or-text { font-size: 11.5px; color: #cbd5e1; font-weight: 500; white-space: nowrap; }

        /* Fields */
        .lg-field { margin-bottom: 17px; }
        .lg-label-row {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 7px;
        }
        .lg-label-text {
          font-size: 11.5px; font-weight: 600; color: #475569;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .lg-forgot { font-size: 12px; font-weight: 600; color: #16a34a; text-decoration: none; transition: opacity 0.2s; }
        .lg-forgot:hover { opacity: 0.7; text-decoration: underline; }

        .lg-input-wrap {
          display: flex; align-items: center;
          border: 1.5px solid #e2e8f0; border-radius: 12px;
          padding: 0 14px; background: #f8fafc;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
        }
        .lg-input-wrap:focus-within {
          border-color: #16a34a; background: #fff;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
        }
        .lg-input-wrap input {
          flex: 1; background: transparent; border: none; outline: none;
          font-size: 14.5px; color: #0f172a;
          font-family: 'Outfit', sans-serif; font-weight: 400; padding: 13px 0;
        }
        .lg-input-wrap input::placeholder { color: #cbd5e1; }
        .lg-eye-btn {
          background: none; border: none; color: #94a3b8; cursor: pointer;
          display: flex; align-items: center; font-size: 15px;
          padding: 0; margin-left: 8px; transition: color 0.2s;
        }
        .lg-eye-btn:hover { color: #475569; }

        /* Submit */
        .lg-submit {
          width: 100%; margin-top: 24px; padding: 14px; border: none;
          border-radius: 13px; font-family: 'Outfit', sans-serif;
          font-size: 15px; font-weight: 700; letter-spacing: 0.02em;
          cursor: pointer; position: relative; overflow: hidden;
          transition: transform 0.15s, box-shadow 0.2s;
        }
        .lg-submit.on {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: #fff;
          box-shadow: 0 4px 20px rgba(22,163,74,0.35), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .lg-submit.on:hover { transform: translateY(-1px); box-shadow: 0 8px 28px rgba(22,163,74,0.45), inset 0 1px 0 rgba(255,255,255,0.15); }
        .lg-submit.on:active { transform: translateY(0); }
        .lg-submit.off { background: #f1f5f9; color: #94a3b8; cursor: not-allowed; }
        .lg-submit.on::after {
          content: ''; position: absolute; top: 0; left: -60%; width: 40%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
          animation: lg-shimmer 2.8s 0.8s infinite;
        }
        @keyframes lg-shimmer { 0% { left: -60%; } 100% { left: 140%; } }

        .lg-spin {
          display: inline-block; width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff;
          border-radius: 50%; animation: lg-rotate 0.7s linear infinite;
          vertical-align: middle; margin-right: 8px;
        }
        @keyframes lg-rotate { to { transform: rotate(360deg); } }

        /* Trust */
        .lg-trust {
          display: flex; align-items: center; justify-content: center;
          gap: 6px; margin-top: 14px;
        }
        .lg-trust-icon { color: #16a34a; font-size: 13px; }
        .lg-trust-text { font-size: 11.5px; color: #94a3b8; font-weight: 500; }

        /* Footer */
        .lg-footer { text-align: center; font-size: 13px; color: #94a3b8; margin-top: 22px; }
        .lg-footer a { font-weight: 700; color: #16a34a; text-decoration: none; }
        .lg-footer a:hover { text-decoration: underline; }
      `}</style>

      <div className="lg-root">

        {/* ─── LEFT PANEL ─── */}
        <div className="lg-left">
          <div className="lg-grid" />
          <div className="lg-circle lg-circle-1" />
          <div className="lg-circle lg-circle-2" />
          <div className="lg-circle lg-circle-3" />

          {FLOATING_ITEMS.map((item, i) => (
            <div key={i} className="lg-float" style={{
              top: item.top, left: item.left, right: item.right,
              animationDelay: item.delay, '--sz': item.size,
            }}>
              {item.emoji}
            </div>
          ))}

          {/* Brand */}
          <div className="lg-brand">
            <div className="lg-brand-icon">
              <BsCart3 size={21} color="#86efac" />
            </div>
            <span className="lg-brand-name">Searchifi<span>Store</span></span>
          </div>

          {/* Headline */}
          <h1 className="lg-headline">
            Shop smarter,<br /><em>live better.</em>
          </h1>
          <p className="lg-sub">
            Groceries, gadgets & everything in between — delivered to your door in minutes.
          </p>

          {/* Perks */}
          <div className="lg-perks">
            {PERKS.map(({ icon: Icon, label }, i) => (
              <div className="lg-perk" key={i}>
                <div className="lg-perk-icon"><Icon /></div>
                <span className="lg-perk-text">{label}</span>
              </div>
            ))}
          </div>

          {/* Rating */}
          <div className="lg-rating">
            <div className="lg-stars">
              {[...Array(5)].map((_, i) => <BsStarFill key={i} />)}
            </div>
            <span className="lg-rating-text">4.9 · 50,000+ happy customers</span>
          </div>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="lg-right">
          <div className="lg-right-bg" />

          <div className="lg-card">

            {/* Mobile brand */}
            <div className="lg-mobile-brand">
              <div className="lg-mobile-icon"><BsCart3 /></div>
              <span className="lg-mobile-name">Searchifi<span>Store</span></span>
            </div>

            {/* Tag */}
            <div className="lg-tag">
              <span className="lg-tag-dot" />
              Your Account
            </div>

            <h2 className="lg-title">Sign in to continue</h2>
            <p className="lg-subtitle">Access your orders, wishlist & exclusive deals</p>

            <div className="lg-sep" />

            {/* Google */}
            <button
              className="lg-google"
              type="button"
              onClick={() => toast("Google login coming soon!")}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <div className="lg-or">
              <div className="lg-or-line" />
              <span className="lg-or-text">or sign in with email</span>
              <div className="lg-or-line" />
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <div className="lg-field">
                <div className="lg-label-row">
                  <span className="lg-label-text">Email</span>
                </div>
                <div className="lg-input-wrap">
                  <input
                    type="email" name="email"
                    value={data.email} onChange={handleChange}
                    placeholder="you@example.com" autoComplete="email"
                  />
                </div>
              </div>

              <div className="lg-field">
                <div className="lg-label-row">
                  <span className="lg-label-text">Password</span>
                  <Link to="/forgot-password" className="lg-forgot">Forgot?</Link>
                </div>
                <div className="lg-input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password" value={data.password} onChange={handleChange}
                    placeholder="••••••••" autoComplete="current-password"
                  />
                  <button type="button" className="lg-eye-btn" onClick={() => setShowPassword(p => !p)}>
                    {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={!valideValue || isLoading}
                className={`lg-submit ${valideValue && !isLoading ? "on" : "off"}`}
              >
                {isLoading && <span className="lg-spin" />}
                {isLoading ? "Signing in…" : "Sign In →"}
              </button>
            </form>

            {/* Trust */}
            <div className="lg-trust">
              <BsShieldCheck className="lg-trust-icon" />
              <span className="lg-trust-text">256-bit SSL encrypted · Your data is always safe</span>
            </div>

            {/* Footer */}
            <p className="lg-footer">
              New here?{" "}
              <Link to="/register">Create a free account</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
