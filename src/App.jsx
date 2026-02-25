import { Outlet, useLocation } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory,setAllSubCategory,setLoadingCategory } from './store/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import GlobalProvider from './provider/GlobalProvider';
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/autoplay";
import CartMobileLink from './components/CartMobile';
import AddAddress from "./components/AddAddress";

function App() {

  const dispatch = useDispatch()
  const location = useLocation()

  /* ================= ADDRESS POPUP STATE ================= */
  const [openAddressPopup, setOpenAddressPopup] = useState(false);

  const user = useSelector(state => state.user);
  const addressList = useSelector(
    state => state.addresses.addressList
  );

  /* ================= FETCH USER ================= */
  const fetchUser = async()=>{
      const userData = await fetchUserDetails()
      dispatch(setUserDetails(userData.data))
  }

  /* ================= FETCH CATEGORY ================= */
  const fetchCategory = async()=>{
    try {
        dispatch(setLoadingCategory(true))
        const response = await Axios({
            ...SummaryApi.getCategory
        })

        const { data : responseData } = response

        if(responseData.success){
           dispatch(setAllCategory(
             responseData.data.sort((a, b) => a.name.localeCompare(b.name))
           )) 
        }
    } finally{
      dispatch(setLoadingCategory(false))
    }
  }

  const fetchSubCategory = async()=>{
    try {
        const response = await Axios({
            ...SummaryApi.getSubCategory
        })

        const { data : responseData } = response

        if(responseData.success){
           dispatch(setAllSubCategory(
             responseData.data.sort((a, b) => a.name.localeCompare(b.name))
           )) 
        }
    } catch (error) {}
  }

  /* ================= INITIAL LOAD ================= */
  useEffect(()=>{
    fetchUser()
    fetchCategory()
    fetchSubCategory()
  },[])

  /* ================= FIRST TIME ADDRESS POPUP ================= */
  useEffect(() => {

    if (!user?._id) return;

    const popupShown = localStorage.getItem("addressPopupShown");

    if (!popupShown && addressList.length === 0) {

      setTimeout(() => {
        setOpenAddressPopup(true);
      }, 1500);

      localStorage.setItem("addressPopupShown", "true");
    }

  }, [user, addressList]);

  return (
    <GlobalProvider> 
      <Header/>

      <main className='min-h-[78vh]'>
          <Outlet/>
      </main>

      <Footer/>
      <Toaster/>

      {location.pathname !== '/checkout' && (
        <CartMobileLink/>
      )}

      {/* ADDRESS POPUP */}
      {openAddressPopup && (
        <AddAddress close={() => setOpenAddressPopup(false)} />
      )}

    </GlobalProvider>
  )
}

export default App