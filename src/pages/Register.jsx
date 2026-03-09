import React, { useState } from 'react'
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6"
import { BsCart3, BsShieldCheck, BsPersonCheck, BsGift } from "react-icons/bs"
import { HiOutlineSparkles } from "react-icons/hi2"
import toast from 'react-hot-toast'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import AxiosToastError from '../utils/AxiosToastError'
import { Link, useNavigate } from 'react-router-dom'

const PERKS = [
    { icon: BsGift, label: "Exclusive deals for new members" },
    { icon: BsShieldCheck, label: "100% secure & encrypted" },
    { icon: HiOutlineSparkles, label: "10-minute express delivery" },
    { icon: BsPersonCheck, label: "Track orders in real-time" },
]

const FLOATING_ITEMS = [
    { emoji: "🎉", top: "10%", left: "7%", delay: "0s", size: "26px" },
    { emoji: "🛍️", top: "22%", right: "8%", delay: "0.5s", size: "24px" },
    { emoji: "⭐", top: "60%", left: "4%", delay: "1.1s", size: "22px" },
    { emoji: "📦", top: "76%", right: "6%", delay: "0.3s", size: "24px" },
    { emoji: "💚", top: "43%", left: "3%", delay: "0.8s", size: "20px" },
    { emoji: "🚀", top: "48%", right: "3%", delay: "1.4s", size: "22px" },
]

const Register = () => {
    const [data, setData] = useState({ name: "", email: "", password: "", confirmPassword: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
    }

    const valideValue = Object.values(data).every(el => el)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (data.password !== data.confirmPassword) {
            toast.error("Passwords do not match ❌")
            return
        }
        setIsLoading(true)
        try {
            const response = await Axios({ ...SummaryApi.register, data })
            if (response.data.error) {
                toast.error(response.data.message || "Registration failed")
                return
            }
            if (response.data.success) {
                toast.success("Account created successfully 🎉")
                setData({ name: "", email: "", password: "", confirmPassword: "" })
                navigate("/login")
            }
        } catch (error) {
            toast.error("Something went wrong. Try again.")
            AxiosToastError(error)
        } finally {
            setIsLoading(false)
        }
    }

    // Password strength
    const pwStrength = (() => {
        const p = data.password
        if (!p) return null
        if (p.length < 6) return { label: "Weak", color: "#ef4444", w: "33%" }
        if (p.length < 10 || !/[0-9]/.test(p)) return { label: "Fair", color: "#f59e0b", w: "66%" }
        return { label: "Strong", color: "#16a34a", w: "100%" }
    })()

    const pwMatch = data.confirmPassword && data.password === data.confirmPassword

    return (
        <>
            <style>{`
       @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');

*{
  box-sizing:border-box;
}

.rg-root{
  font-family:'Outfit',sans-serif;
  min-height:100vh;
  display:flex;
  background:#f8faf8;
  overflow:hidden;
  position:relative;
}

/* RIGHT PANEL */

.rg-right{
  flex:1;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:28px 20px;
  position:relative;
  background:#f8faf8;
}

.rg-right-bg{
  position:absolute;
  inset:0;
  pointer-events:none;
  background-image:
    radial-gradient(circle at 20% 20%,rgba(22,163,74,0.05)0%,transparent 50%),
    radial-gradient(circle at 80% 80%,rgba(22,163,74,0.05)0%,transparent 50%);
}

/* CARD */

.rg-card{
  width:100%;
  max-width:440px;
  background:#fff;
  border-radius:24px;
  padding:40px 38px;
  box-shadow:
    0 4px 6px rgba(0,0,0,0.02),
    0 24px 60px rgba(0,0,0,0.08);
  border:1px solid rgba(0,0,0,0.06);
  position:relative;
  z-index:1;
}

/* TAG */

.rg-tag{
  display:inline-flex;
  align-items:center;
  gap:6px;
  background:#f0fdf4;
  border:1px solid #bbf7d0;
  border-radius:999px;
  padding:4px 12px;
  margin-bottom:14px;
  font-size:11px;
  font-weight:600;
  color:#16a34a;
  letter-spacing:0.06em;
  text-transform:uppercase;
}

.rg-tag-dot{
  width:5px;
  height:5px;
  background:#16a34a;
  border-radius:50%;
}

/* TITLE */

.rg-title{
  font-size:26px;
  font-weight:800;
  color:#0f172a;
  letter-spacing:-0.7px;
  margin-bottom:3px;
  line-height:1.15;
}

.rg-subtitle{
  font-size:13px;
  color:#94a3b8;
  margin-bottom:24px;
}

.rg-sep{
  height:1px;
  background:linear-gradient(90deg,transparent,#e2e8f0,transparent);
  margin-bottom:22px;
}

/* GRID FIX (IMPORTANT) */

.rg-row{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:14px;
}

.rg-row > *{
  min-width:0;
}

@media(max-width:500px){
  .rg-row{
    grid-template-columns:1fr;
  }
}

/* FIELD */

.rg-field{
  margin-bottom:15px;
}

.rg-label-row{
  display:flex;
  align-items:center;
  justify-content:space-between;
  margin-bottom:6px;
}

.rg-label-text{
  font-size:11px;
  font-weight:600;
  color:#475569;
  letter-spacing:0.05em;
  text-transform:uppercase;
}

/* INPUT WRAPPER */

.rg-input-wrap{
  display:flex;
  align-items:center;
  border:1.5px solid #e2e8f0;
  border-radius:12px;
  padding:0 13px;
  background:#f8fafc;
  transition:0.2s;
  width:100%;
  max-width:100%;
}

.rg-input-wrap:focus-within{
  border-color:#16a34a;
  background:#fff;
  box-shadow:0 0 0 3px rgba(22,163,74,0.1);
}

.rg-input-wrap.error{
  border-color:#ef4444;
}

.rg-input-wrap.success{
  border-color:#16a34a;
}

/* INPUT FIX (VERY IMPORTANT) */

.rg-input-wrap input{
  flex:1;
  width:100%;
  min-width:0;
  background:transparent;
  border:none;
  outline:none;
  font-size:14px;
  color:#0f172a;
  font-family:'Outfit',sans-serif;
  padding:12px 0;

  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}

.rg-input-wrap input::placeholder{
  color:#cbd5e1;
}

/* EYE BUTTON */

.rg-eye-btn{
  background:none;
  border:none;
  color:#94a3b8;
  cursor:pointer;
  display:flex;
  align-items:center;
  font-size:15px;
  padding:0;
  margin-left:8px;
}

/* SUBMIT */

.rg-submit{
  width:100%;
  margin-top:20px;
  padding:14px;
  border:none;
  border-radius:13px;
  font-family:'Outfit',sans-serif;
  font-size:15px;
  font-weight:700;
  cursor:pointer;
  transition:0.2s;
}

.rg-submit.on{
  background:linear-gradient(135deg,#16a34a,#15803d);
  color:#fff;
}

.rg-submit.off{
  background:#f1f5f9;
  color:#94a3b8;
  cursor:not-allowed;
}

/* FOOTER */

.rg-footer{
  text-align:center;
  font-size:13px;
  color:#94a3b8;
  margin-top:18px;
}

.rg-footer a{
  font-weight:700;
  color:#16a34a;
  text-decoration:none;
}
      `}</style>

            <div className="rg-root">

                {/* ─── LEFT PANEL ─── */}
                <div className="rg-left">
                    <div className="rg-grid" />
                    <div className="rg-circle rg-c1" />
                    <div className="rg-circle rg-c2" />
                    <div className="rg-circle rg-c3" />

                    {FLOATING_ITEMS.map((item, i) => (
                        <div key={i} className="rg-float" style={{
                            top: item.top, left: item.left, right: item.right,
                            animationDelay: item.delay, '--sz': item.size,
                        }}>
                            {item.emoji}
                        </div>
                    ))}

                    {/* Brand */}
                    <div className="rg-brand">
                        <div className="rg-brand-icon">
                            <BsCart3 size={20} color="#86efac" />
                        </div>
                        <span className="rg-brand-name">Searchifi<span>Store</span></span>
                    </div>

                    {/* Headline */}
                    <h1 className="rg-headline">
                        Join millions<br />shopping <em>smarter.</em>
                    </h1>
                    <p className="rg-sub">
                        Create your account and unlock exclusive deals, fast delivery, and a seamless shopping experience.
                    </p>

                    {/* Perks */}
                    <div className="rg-perks">
                        {PERKS.map(({ icon: Icon, label }, i) => (
                            <div className="rg-perk" key={i}>
                                <div className="rg-perk-icon"><Icon /></div>
                                <span className="rg-perk-text">{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Testimonial */}
                    <div className="rg-testimonial">
                        <p className="rg-quote">"Fastest delivery I've ever seen. Got my groceries in 8 minutes!"</p>
                        <div className="rg-reviewer">
                            <div className="rg-avatar">P</div>
                            <span className="rg-reviewer-name">Priya M. · Mumbai</span>
                        </div>
                    </div>
                </div>

                {/* ─── RIGHT PANEL ─── */}
                <div className="rg-right">
                    <div className="rg-right-bg" />

                    <div className="rg-card">

                        {/* Mobile brand */}
                        <div className="rg-mobile-brand">
                            <div className="rg-mobile-icon"><BsCart3 /></div>
                            <span className="rg-mobile-name">Searchifi<span>Store</span></span>
                        </div>

                        {/* Tag */}
                        <div className="rg-tag">
                            <span className="rg-tag-dot" />
                            New Account
                        </div>

                        <h2 className="rg-title">Create your account</h2>
                        <p className="rg-subtitle">It's free — takes less than a minute</p>

                        <div className="rg-sep" />

                        <form onSubmit={handleSubmit}>

                            {/* Name + Email row */}
                            <div className="rg-row">
                                <div className="rg-field">
                                    <div className="rg-label-row">
                                        <span className="rg-label-text">Full Name</span>
                                    </div>
                                    <div className="rg-input-wrap">
                                        <input
                                            type="text" name="name"
                                            value={data.name} onChange={handleChange}
                                            placeholder="John Doe" autoFocus autoComplete="name"
                                        />
                                    </div>
                                </div>

                                <div className="rg-field">
                                    <div className="rg-label-row">
                                        <span className="rg-label-text">Email</span>
                                    </div>
                                    <div className="rg-input-wrap">
                                        <input
                                            type="email" name="email"
                                            value={data.email} onChange={handleChange}
                                            placeholder="you@example.com" autoComplete="email"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="rg-field">
                                <div className="rg-label-row">
                                    <span className="rg-label-text">Password</span>
                                    {pwStrength && (
                                        <span className="rg-strength-label" style={{ color: pwStrength.color }}>
                                            {pwStrength.label}
                                        </span>
                                    )}
                                </div>
                                <div className="rg-input-wrap">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password" value={data.password} onChange={handleChange}
                                        placeholder="Min 8 characters" autoComplete="new-password"
                                    />
                                    <button type="button" className="rg-eye-btn" onClick={() => setShowPassword(p => !p)}>
                                        {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </button>
                                </div>
                                {pwStrength && (
                                    <div className="rg-strength-bar-bg">
                                        <div
                                            className="rg-strength-bar-fill"
                                            style={{ width: pwStrength.w, background: pwStrength.color }}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="rg-field">
                                <div className="rg-label-row">
                                    <span className="rg-label-text">Confirm Password</span>
                                </div>
                                <div className={`rg-input-wrap ${data.confirmPassword ? (pwMatch ? "success" : "error") : ""}`}>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword" value={data.confirmPassword} onChange={handleChange}
                                        placeholder="Re-enter password" autoComplete="new-password"
                                    />
                                    <button type="button" className="rg-eye-btn" onClick={() => setShowConfirmPassword(p => !p)}>
                                        {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                                    </button>
                                </div>
                                {data.confirmPassword && (
                                    <div className="rg-match" style={{ color: pwMatch ? "#16a34a" : "#ef4444" }}>
                                        {pwMatch ? "✓ Passwords match" : "✗ Passwords don't match"}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={!valideValue || isLoading}
                                className={`rg-submit ${valideValue && !isLoading ? "on" : "off"}`}
                            >
                                {isLoading && <span className="rg-spin" />}
                                {isLoading ? "Creating account…" : "Create Account →"}
                            </button>
                        </form>

                        <p className="rg-terms">
                            By registering, you agree to our{" "}
                            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
                        </p>

                        {/* Trust */}
                        <div className="rg-trust">
                            <BsShieldCheck className="rg-trust-icon" />
                            <span className="rg-trust-text">256-bit SSL encrypted · Your data is always safe</span>
                        </div>

                        {/* Footer */}
                        <p className="rg-footer">
                            Already have an account?{" "}
                            <Link to="/login">Sign in</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register
