import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { Link, useParams } from "react-router-dom";
import AxiosToastError from "../utils/AxiosToastError";
import Loading from "../components/Loading";
import CardProduct from "../components/CardProduct";
import { useSelector } from "react-redux";
import { valideURLConvert } from "../utils/valideURLConvert";

const ProductListPage = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPage, setTotalPage] = useState(1);

  const params = useParams();
  const AllSubCategory = useSelector(
    (state) => state.product.allSubCategory
  );

  const [DisplaySubCatory, setDisplaySubCategory] = useState([]);

  /* ================= URL DATA ================= */

  const subCategory = params?.subCategory?.split("-");
  const subCategoryName = subCategory
    ?.slice(0, subCategory?.length - 1)
    ?.join(" ");

  const categoryId = params.category.split("-").slice(-1)[0];
  const subCategoryId = params.subCategory.split("-").slice(-1)[0];

  /* ================= FETCH PRODUCTS ================= */

  const fetchProductdata = async () => {
    try {
      setLoading(true);

      const response = await Axios({
        ...SummaryApi.getProductByCategoryAndSubCategory,
        data: {
          categoryId,
          subCategoryId,
          page,
          limit: 8,
        },
      });

      const { data: responseData } = response;

      if (responseData.success) {
        if (responseData.page == 1) {
          setData(responseData.data);
        } else {
          setData([...data, ...responseData.data]);
        }

        setTotalPage(responseData.totalCount);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductdata();
  }, [params]);

  /* ================= FILTER SIDEBAR ================= */

  useEffect(() => {
    const sub = AllSubCategory.filter((s) => {
      const filterData = s.category.some(
        (el) => el._id == categoryId
      );
      return filterData ? filterData : null;
    });

    setDisplaySubCategory(sub);
  }, [params, AllSubCategory]);

  /* ================= UI ================= */

  return (
    <section className="bg-gray-50 min-h-screen pt-4">

      <div className="container mx-auto px-3 lg:px-6 grid 
      grid-cols-[90px,1fr] 
      md:grid-cols-[200px,1fr] 
      lg:grid-cols-[260px,1fr] gap-4">

        {/* ================= SIDEBAR ================= */}
        <div className="bg-white rounded-xl shadow-sm border 
        min-h-[88vh] max-h-[88vh] overflow-y-auto scrollbarCustom">

          <h3 className="font-semibold text-gray-700 px-4 py-3 border-b">
            Categories
          </h3>

          <div className="flex flex-col">
            {DisplaySubCatory.map((s) => {
              const link = `/${valideURLConvert(
                s?.category[0]?.name
              )}-${s?.category[0]?._id}/${valideURLConvert(
                s.name
              )}-${s._id}`;

              return (
                <Link
                  key={s._id}
                  to={link}
                  className={`flex items-center gap-3 px-3 py-3 border-b transition-all
                  hover:bg-green-50
                  ${
                    subCategoryId === s._id
                      ? "bg-green-100"
                      : ""
                  }`}
                >
                  <div className="bg-gray-50 rounded-md p-1">
                    <img
                      src={s.image}
                      alt={s.name}
                      className="w-10 h-10 rounded-xl object-contain"
                    />
                  </div>

                  <p className="text-xs md:text-sm font-medium text-gray-700">
                    {s.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* ================= PRODUCTS ================= */}
        <div>

          {/* HEADER */}
          <div className="bg-white rounded-xl shadow-sm border p-4 mb-4 sticky top-20 z-10">
            <h2 className="text-lg font-semibold text-gray-800">
              {subCategoryName}
            </h2>
          </div>

          {/* PRODUCT GRID */}
          <div className="bg-white rounded-xl shadow-sm border">

            <div className="min-h-[80vh] max-h-[80vh] overflow-y-auto relative">

              <div className="grid 
              grid-cols-2 
              md:grid-cols-3 
              lg:grid-cols-4 
              gap-5 p-4">

                {data.map((p, index) => (
                  <CardProduct
                    data={p}
                    key={p._id + "productSubCategory" + index}
                  />
                ))}

              </div>

              {loading && <Loading />}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductListPage;