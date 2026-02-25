import React, { useState, useRef, useEffect } from "react";
import logo from "../../public/SeaechifiStore.png";
import Search from "./Search";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaRegCircleUser } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import useMobile from "../hooks/useMobile";
import { BsCart4 } from "react-icons/bs";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import UserMenu from "./UserMenu";
import { DisplayPriceInRupees } from "../utils/DisplayPriceInRupees";
import { useGlobalContext } from "../provider/GlobalProvider";
import DisplayCartItem from "./DisplayCartItem";
import { IoLocationOutline } from "react-icons/io5";
import AddAddress from "./AddAddress";

const Header = () => {
  const [isMobile] = useMobile();
  const location = useLocation();
  const isSearchPage = location.pathname === "/search";
  const navigate = useNavigate();
  const [openAddressMenu, setOpenAddressMenu] = useState(false);
  const [openAddAddress, setOpenAddAddress] = useState(false);

  const user = useSelector((state) => state?.user);
  const cartItem = useSelector((state) => state.cartItem.cart);
  const { totalPrice, totalQty } = useGlobalContext();

  const [openUserMenu, setOpenUserMenu] = useState(false);
  const [openCartSection, setOpenCartSection] = useState(false);
  const [expandSearch, setExpandSearch] = useState(false);

  const searchRef = useRef(null);

  const addressList = useSelector(
    (state) => state.addresses.addressList
  );

  const defaultAddress = addressList.find(a => a.status);

  const redirectToLoginPage = () => navigate("/login");

  const handleMobileUser = () => {
    if (!user?._id) {
      navigate("/login");
      return;
    }
    navigate("/user");
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setExpandSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-lg border-b border-neutral-200">

      {!(isSearchPage && isMobile) && (
        <div className="container mx-auto px-4 h-20 flex items-center">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img src={logo} alt="logo" className="h-10 lg:h-14 object-contain" />
          </Link>

          {/* DELIVERY ADDRESS */}
          <div className="relative hidden lg:block">

            <button
              onClick={() => setOpenAddressMenu(prev => !prev)}
              className="flex items-center gap-2 ml-6 hover:bg-gray-100 px-3 py-2 rounded-lg"
            >
              <IoLocationOutline size={22} className="text-green-700" />

              <div className="text-left leading-tight">
                <p className="text-xs text-gray-500">Deliver to</p>

                <p className="text-sm font-semibold">
                  {defaultAddress
                    ? `${defaultAddress.city} - ${defaultAddress.pincode}`
                    : "Add Address"}
                </p> 
              </div>
            </button>

            {/* DROPDOWN */}
            {openAddressMenu && (
              <div className="absolute top-14 left-0 w-80 bg-white shadow-xl rounded-xl border p-4 z-50">

                <h3 className="font-semibold mb-3">Your Addresses</h3>

                <div className="max-h-60 overflow-auto space-y-3">

                  {addressList.length > 0 ? (
                    addressList.map(addr => (
                      <div
                        key={addr._id}
                        className="border rounded-lg p-2 hover:bg-gray-50 cursor-pointer"
                      >
                        <p className="text-sm font-medium">
                          {addr.address_line}
                        </p>
                        <p className="text-xs text-gray-500">
                          {addr.city}, {addr.state}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400">
                      No address added yet
                    </p>
                  )}

                </div>

                {/* ADD ADDRESS BUTTON */}
                <button
                  onClick={() => {
                    setOpenAddAddress(true);
                    setOpenAddressMenu(false);
                  }}
                  className="mt-4 w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-600"
                >
                  + Add New Address
                </button>
              </div>
            )}
          </div>

          {/* CENTER NAV */}
          <nav className="hidden lg:flex flex-1 justify-center  items-center gap-8 text-sm font-medium text-neutral-700">
            <Link to="/" className="hover:text-green-700">Home</Link>
            <Link to="/shopping" className="hover:text-green-700">Shopping</Link>
            <Link to="/groceries" className="hover:text-green-700">Groceries</Link>
            <Link to="/pharmacy" className="hover:text-green-700">Pharmacy</Link>
            <Link to="/10min" className="text-green-700 font-semibold">
              10 Min Shopping
            </Link>
          </nav>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-4 ml-auto">

            {/* MOBILE USER */}
            <button className="lg:hidden" onClick={handleMobileUser}>
              <FaRegCircleUser size={26} />
            </button>

            {/* SEARCH ICON → EXPAND */}
            <div
              ref={searchRef}
              className={`hidden lg:flex items-center p-2 transition-all duration-300 ease-in-out overflow-hidden rounded-full border bg-white
                ${expandSearch ? "w-[550px] px-3" : "w-10 justify-center"}
              `}
            >
              {expandSearch && (
                <div className="flex-1">
                  <Search autoFocus />
                </div>
              )}

              <button
                onClick={() => setExpandSearch((prev) => !prev)}
                className="text-neutral-600 hover:text-black"
              >
                <IoSearch size={20} />
              </button>
            </div>

            {/* USER */}
            <div className="hidden lg:flex items-center gap-4">
              {user?._id ? (
                <div className="relative">
                  <button
                    onClick={() => setOpenUserMenu((prev) => !prev)}
                    className="flex items-center gap-1 font-medium text-neutral-700"
                  >
                    Account
                    {openUserMenu ? <GoTriangleUp /> : <GoTriangleDown />}
                  </button>

                  {openUserMenu && (
                    <div className="absolute right-0 top-12 bg-white rounded-xl shadow-xl p-4 min-w-52 border">
                      <UserMenu close={() => setOpenUserMenu(false)} />
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={redirectToLoginPage} className="font-medium">
                  Login
                </button>
              )}
            </div>

            {/* CART */}
            <button
              onClick={() => setOpenCartSection(true)}
              className="relative flex items-center gap-3 bg-green-700 hover:bg-green-600 px-4 py-2 rounded-full text-white transition"
            >
              <BsCart4 size={22} />

              {cartItem.length > 0 ? (
                <div className="text-xs leading-tight text-left">
                  <p className="font-semibold">{totalQty} Items</p>
                  <p>{DisplayPriceInRupees(totalPrice)}</p>
                </div>
              ) : (
                <span className="text-sm font-medium">My Cart</span>
              )}

              {totalQty > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {totalQty}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {/* MOBILE SEARCH */}
      <div className="container mx-auto px-4 lg:hidden pb-2">
        <Search />
      </div>

      {/* CART DRAWER */}
      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </header>
  );
};

export default Header;
