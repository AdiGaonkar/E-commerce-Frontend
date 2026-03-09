import React, { useState, useRef, useEffect } from "react";
import logo from "../../public/SeaechifiStore.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoSearch, IoLocationOutline } from "react-icons/io5";
import useMobile from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";
import AddAddress from "./AddAddress";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/shopping", label: "Shopping" },
  { to: "/groceries", label: "Groceries" },
  { to: "/pharmacy", label: "Pharmacy" },
];

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();

  const [openAddressMenu, setOpenAddressMenu] = useState(false);
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCartSection, setOpenCartSection] = useState(false);
  const [expandSearch, setExpandSearch] = useState(false);

  const user = useSelector((state) => state?.user);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const addressList = useSelector((state) => state.addresses.addressList);
  const { totalPrice, totalQty } = useGlobalContext();

  const defaultAddress = addressList.find((a) => a.status);

  const searchRef = useRef(null);
  const addressRef = useRef(null);
  const userMenuRef = useRef(null);

  const redirectToLoginPage = () => navigate("/login");
  const handleMobileUser = () => {
    if (!user?._id) { navigate("/login"); return; }
    navigate("/user");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setExpandSearch(false);
      if (addressRef.current && !addressRef.current.contains(e.target)) setOpenAddressMenu(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setOpenUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');

        .hdr-root { font-family: 'Outfit', sans-serif; }

        /* Top announcement bar */
        .hdr-announce {
          background: linear-gradient(90deg, #14532d, #166534, #14532d);
          background-size: 200% 100%;
          animation: hdr-slide 6s linear infinite;
          color: #bbf7d0;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-align: center;
          padding: 6px 16px;
          overflow: hidden;
          position: relative;
        }
        @keyframes hdr-slide {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
        .hdr-announce-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(255,255,255,0.1);
          border-radius: 999px;
          padding: 2px 10px;
          margin-right: 10px;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #4ade80;
          border: 1px solid rgba(74,222,128,0.3);
        }

        /* Main header */
        .hdr-main {
          background: #ffffff;
          border-bottom: 1px solid #e5e7eb;
          box-shadow: 0 1px 16px 0 rgba(0,0,0,0.06);
        }

        /* Logo glow */
        .hdr-logo img {
          transition: filter 0.3s;
        }
        .hdr-logo:hover img {
          filter: drop-shadow(0 0 8px rgba(22,163,74,0.4));
        }

        /* Address button */
        .hdr-addr-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 12px;
          border: 1px solid transparent;
          background: transparent;
          transition: background 0.2s, border-color 0.2s;
          cursor: pointer;
        }
        .hdr-addr-btn:hover {
          background: #f0fdf4;
          border-color: #bbf7d0;
        }
        .hdr-addr-icon {
          width: 34px; height: 34px;
          background: linear-gradient(135deg, #dcfce7, #bbf7d0);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        /* Nav links */
        .hdr-nav-link {
          position: relative;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          padding: 4px 0;
          transition: color 0.2s;
        }
        .hdr-nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 0; right: 0;
          height: 2px;
          background: #16a34a;
          border-radius: 2px;
          transform: scaleX(0);
          transition: transform 0.25s cubic-bezier(0.22,1,0.36,1);
        }
        .hdr-nav-link:hover { color: #16a34a; }
        .hdr-nav-link:hover::after { transform: scaleX(1); }

        /* 10min badge nav */
        .hdr-nav-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          font-weight: 700;
          color: #ffffff;
          background: linear-gradient(135deg, #16a34a, #15803d);
          border-radius: 999px;
          padding: 4px 14px;
          text-decoration: none;
          box-shadow: 0 2px 8px rgba(22,163,74,0.35);
          transition: transform 0.15s, box-shadow 0.2s;
        }
        .hdr-nav-badge:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(22,163,74,0.45);
        }
        .hdr-nav-badge-dot {
          width: 6px; height: 6px;
          background: #bbf7d0;
          border-radius: 50%;
          animation: hdr-pulse 1.8s infinite;
        }
        @keyframes hdr-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }

        /* Search expand */
        .hdr-search-wrap {
          display: flex;
          align-items: center;
          border: 1.5px solid #e5e7eb;
          border-radius: 999px;
          background: #f9fafb;
          overflow: hidden;
          transition: width 0.35s cubic-bezier(0.22,1,0.36,1), border-color 0.2s, box-shadow 0.2s;
        }
        .hdr-search-wrap.expanded {
          width: 320px;
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
          background: #fff;
        }
        .hdr-search-wrap.collapsed { width: 40px; justify-content: center; }
        .hdr-search-icon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 8px 10px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
          flex-shrink: 0;
        }
        .hdr-search-icon-btn:hover { color: #16a34a; }

        /* Account button */
        .hdr-account-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 12px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          font-size: 13.5px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
          font-family: 'Outfit', sans-serif;
        }
        .hdr-account-btn:hover {
          border-color: #16a34a;
          background: #f0fdf4;
          color: #16a34a;
        }

        /* Cart button */
        .hdr-cart-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: #fff;
          border: none;
          border-radius: 14px;
          padding: 9px 18px;
          cursor: pointer;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          box-shadow: 0 2px 12px rgba(22,163,74,0.3);
          transition: transform 0.15s, box-shadow 0.2s;
          position: relative;
        }
        .hdr-cart-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(22,163,74,0.4);
        }
        .hdr-cart-btn:active { transform: translateY(0); }
        .hdr-cart-divider {
          width: 1px;
          height: 28px;
          background: rgba(255,255,255,0.25);
          border-radius: 1px;
        }
        .hdr-cart-badge {
          position: absolute;
          top: -6px; right: -6px;
          background: #ef4444;
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          min-width: 18px; height: 18px;
          border-radius: 999px;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #fff;
          box-shadow: 0 2px 6px rgba(239,68,68,0.4);
          animation: hdr-pop 0.3s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes hdr-pop {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }

        /* Address dropdown */
        .hdr-addr-dropdown {
          position: absolute;
          top: calc(100% + 12px);
          left: 0;
          width: 300px;
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          padding: 16px;
          z-index: 100;
          animation: hdr-dropdown 0.2s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes hdr-dropdown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hdr-addr-item {
          border: 1px solid #f3f4f6;
          border-radius: 10px;
          padding: 10px 12px;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .hdr-addr-item:hover { background: #f0fdf4; border-color: #bbf7d0; }

        /* User dropdown */
        .hdr-user-dropdown {
          position: absolute;
          right: 0;
          top: calc(100% + 12px);
          background: #fff;
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 20px 60px rgba(0,0,0,0.12);
          padding: 8px;
          min-width: 210px;
          z-index: 100;
          animation: hdr-dropdown 0.2s cubic-bezier(0.22,1,0.36,1);
        }

        /* Login btn */
        .hdr-login-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 16px;
          border-radius: 12px;
          border: 1.5px solid #e5e7eb;
          background: #fff;
          font-family: 'Outfit', sans-serif;
          font-size: 13.5px;
          font-weight: 600;
          color: #374151;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
        }
        .hdr-login-btn:hover {
          border-color: #16a34a;
          background: #f0fdf4;
          color: #16a34a;
        }

        /* Mobile search bar */
        .hdr-mobile-search {
          border-top: 1px solid #f3f4f6;
          padding: 10px 16px 12px;
        }
      `}</style>

      <div className="hdr-root sticky top-0 z-50">

        {/* Announcement Bar */}
        <div className="hdr-announce">
          <span className="hdr-announce-badge">⚡ New</span>
          Free delivery on orders over ₹499 &nbsp;·&nbsp; 10-minute delivery available now!
        </div>

        {/* Main Header */}
        <div className="hdr-main">
          {!(isSearchPage && isMobile) && (
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 h-[68px] flex items-center gap-4">

              {/* LOGO */}
              <Link to="/" className="hdr-logo flex-shrink-0">
                <img src={logo} alt="logo" className="h-9 lg:h-11 object-contain" />
              </Link>

              {/* DELIVERY ADDRESS — desktop */}
              <div ref={addressRef} className="relative hidden lg:block flex-shrink-0">
                <button
                  onClick={() => setOpenAddressMenu((p) => !p)}
                  className="hdr-addr-btn"
                >
                  <div className="hdr-addr-icon">
                    <IoLocationOutline size={18} className="text-green-700" />
                  </div>
                  <div className="text-left leading-tight">
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">
                      Deliver to
                    </p>
                    <p className="text-sm font-700 text-gray-800 max-w-[120px] truncate" style={{ fontWeight: 700 }}>
                      {defaultAddress
                        ? `${defaultAddress.city} – ${defaultAddress.pincode}`
                        : "Add address"}
                    </p>
                  </div>
                  {openAddressMenu ? (
                    <GoTriangleUp size={14} className="text-gray-400" />
                  ) : (
                    <GoTriangleDown size={14} className="text-gray-400" />
                  )}
                </button>

                {openAddressMenu && (
                  <div className="hdr-addr-dropdown">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-700 text-gray-800" style={{ fontWeight: 700 }}>Your Addresses</p>
                      <span className="text-xs text-gray-400">{addressList.length} saved</span>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {addressList.length > 0 ? addressList.map((addr) => (
                        <div key={addr._id} className="hdr-addr-item">
                          <div className="flex items-start gap-2">
                            <IoLocationOutline size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-sm font-600 text-gray-700 leading-tight" style={{ fontWeight: 600 }}>
                                {addr.address_line}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">
                                {addr.city}, {addr.state}
                              </p>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <p className="text-sm text-gray-400 text-center py-4">No addresses saved yet</p>
                      )}
                    </div>

                    <button
                      onClick={() => { setOpenAddAddress(true); setOpenAddressMenu(false); }}
                      className="mt-3 w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-600 text-white text-sm font-600 py-2.5 rounded-xl transition-colors"
                      style={{ fontWeight: 600 }}
                    >
                      <span className="text-base leading-none">+</span> Add New Address
                    </button>
                  </div>
                )}
              </div>

              {/* NAV LINKS — desktop center */}
              <nav className="hidden lg:flex flex-1 justify-center items-center gap-7">
                {NAV_LINKS.map(({ to, label }) => (
                  <Link key={to} to={to} className="hdr-nav-link">{label}</Link>
                ))}
                <Link to="/10min" className="hdr-nav-badge">
                  <span className="hdr-nav-badge-dot" />
                  10 Min
                </Link>
              </nav>

              {/* RIGHT SECTION */}
              <div className="flex items-center gap-2 ml-auto">

                {/* Mobile user icon */}
                <button className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition" onClick={handleMobileUser}>
                  <FaRegCircleUser size={22} className="text-gray-600" />
                </button>

                {/* Search expand — desktop */}
                <div
                  ref={searchRef}
                  className={`hdr-search-wrap hidden lg:flex ${expandSearch ? "expanded" : "collapsed"}`}
                >
                  {expandSearch && (
                    <div className="flex-1 pl-3">
                      <Search autoFocus />
                    </div>
                  )}
                  <button
                    className="hdr-search-icon-btn"
                    onClick={() => setExpandSearch((p) => !p)}
                  >
                    <IoSearch size={18} />
                  </button>
                </div>

                {/* Account / Login — desktop */}
                <div className="hidden lg:block relative" ref={userMenuRef}>
                  {user?._id ? (
                    <>
                      <button
                        className="hdr-account-btn"
                        onClick={() => setOpenUserMenu((p) => !p)}
                      >
                        <FaRegCircleUser size={16} />
                        Account
                        {openUserMenu ? <GoTriangleUp size={12} /> : <GoTriangleDown size={12} />}
                      </button>
                      {openUserMenu && (
                        <div className="hdr-user-dropdown">
                          <UserMenu close={() => setOpenUserMenu(false)} />
                        </div>
                      )}
                    </>
                  ) : (
                    <button className="hdr-login-btn" onClick={redirectToLoginPage}>
                      <FaRegCircleUser size={15} />
                      Login
                    </button>
                  )}
                </div>

                {/* CART */}
                <button className="hdr-cart-btn" onClick={() => setOpenCartSection(true)}>
                  <BsCart4 size={20} />

                  {cartItem.length > 0 ? (
                    <>
                      <div className="hdr-cart-divider" />
                      <div className="text-left leading-tight">
                        <p className="text-[11px] text-green-100" style={{ lineHeight: 1.2 }}>
                          {totalQty} item{totalQty > 1 ? "s" : ""}
                        </p>
                        <p className="text-sm font-700" style={{ fontWeight: 700 }}>
                          {DisplayPriceInRupees(totalPrice)}
                        </p>
                      </div>
                    </>
                  ) : (
                    <span className="text-sm">My Cart</span>
                  )}

                  {totalQty > 0 && (
                    <span className="hdr-cart-badge">{totalQty}</span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* MOBILE SEARCH */}
          {isMobile && (
            <div className="hdr-mobile-search">
              <Search />
            </div>
          )}
        </div>
      </div>

      {/* MODALS */}
      {openCartSection && <DisplayCartItem close={() => setOpenCartSection(false)} />}
      {openAddAddress && <AddAddress close={() => setOpenAddAddress(false)} />}
    </>
  );
};

export default Header;
