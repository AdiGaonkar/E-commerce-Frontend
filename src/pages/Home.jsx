import React from "react";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";
import { useNavigate } from "react-router-dom";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";

// 🔥 Swiper Imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Home = () => {
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  const handleRedirectProductListpage = (id, cat) => {
    const subcategory = subCategoryData.find((sub) => {
      const filterData = sub.category.some((c) => c._id == id);
      return filterData ? true : null;
    });

    const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(
      subcategory.name
    )}-${subcategory._id}`;

    navigate(url);
  };

  return (
    <section className="bg-white">

      {/* =============================== */}
      {/* 🔥 SWIPER BANNER SECTION */}
      {/* =============================== */}

      <div className="w-full px-6 lg:px-10 py-6">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1}
          loop
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation
          className="rounded-3xl overflow-hidden"
        >
          <SwiperSlide>
            <div className="w-full">
              <img
                src="https://images-eu.ssl-images-amazon.com/images/G/31/INSLGW/FebUBS26/serve_men_2x_febubs._CB787886866_.jpg"
                alt="banner1"
                className="w-full h-auto object-contain"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="w-full">
              <img
                src="https://m.media-amazon.com/images/I/81nykuVviZL._SX3000_.jpg"
                alt="banner2"
                className="w-full h-auto object-contain"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="w-full">
              <img
                src="https://images-eu.ssl-images-amazon.com/images/G/31/img18/HomeImprovement/harsmisc/2025/December25/5299-HI---Bathla-Telescopic-ladders---hero_3000X1200._CB777980618_.jpg"
                alt="banner3"
                className="w-full h-auto object-contain"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </div>


      {/* =============================== */}
      {/* CATEGORY GRID */}
      {/* =============================== */}

      <div className="container mx-auto px-4 my-4 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-7">
        {loadingCategory
          ? new Array(12).fill(null).map((c, index) => (
            <div
              key={index + "load"}
              className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse"
            >
              <div className="bg-blue-100 min-h-24 rounded"></div>
              <div className="bg-blue-100 h-8 rounded"></div>
            </div>
          ))
          : categoryData.map((cat) => (
            <div
              key={cat._id + "cat"}
              className="w-full h-full cursor-pointer"
              onClick={() =>
                handleRedirectProductListpage(cat._id, cat.name)
              }
            >
              <img
                src={cat.image}
                className="w-full h-full rounded-full object-scale-down"
                alt={cat.name}
              />
            </div>
          ))}
      </div>

      {/* =============================== */}
      {/* CATEGORY-WISE PRODUCT DISPLAY */}
      {/* =============================== */}

      {categoryData?.map((c) => (
        <CategoryWiseProductDisplay
          key={c?._id + "CW"}
          id={c?._id}
          name={c?.name}
        />
      ))}
    </section>
  );
};

export default Home;
