import React, { useEffect, useState } from "react";
import UploadCategoryModel from "../components/UploadCategoryModel";
import Loading from "../components/Loading";
import NoData from "../components/NoData";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import EditCategory from "../components/EditCategory";
import CofirmBox from "../components/CofirmBox";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const CategoryPage = () => {
  const [openUploadCategory, setOpenUploadCategory] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    image: "",
  });
  const [openConfimBoxDelete, setOpenConfirmBoxDelete] = useState(false);
  const [deleteCategory, setDeleteCategory] = useState({
    _id: "",
  });

  /* ================= FETCH ================= */

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setCategoryData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  /* ================= DELETE ================= */

  const handleDeleteCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteCategory,
        data: deleteCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchCategory();
        setOpenConfirmBoxDelete(false);
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  /* ================= UI ================= */

  return (
    <section className="min-h-screen bg-gray-50 p-6">

      {/* HEADER */}
      <div className="bg-white rounded-xl shadow-sm border p-5 flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Categories
          </h2>
          <p className="text-sm text-gray-500">
            Manage product categories
          </p>
        </div>

        <button
          onClick={() => setOpenUploadCategory(true)}
          className="bg-primary-200 hover:bg-primary-300 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
        >
          + Add Category
        </button>
      </div>

      {/* EMPTY STATE */}
      {!categoryData[0] && !loading && (
        <div className="bg-white rounded-xl shadow-sm border p-10">
          <NoData />
        </div>
      )}

      {/* CATEGORY GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">

        {categoryData.map((category) => (
          <div
            key={category._id}
            className="bg-white rounded-xl shadow-sm border hover:shadow-md transition overflow-hidden"
          >
            {/* IMAGE */}
            <div className="h-40 bg-gray-50 flex items-center justify-center p-4">
              <img
                alt={category.name}
                src={category.image}
                className="h-full object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* NAME */}
            <div className="px-3 py-2 border-t">
              <h3 className="text-sm font-medium text-gray-700 truncate">
                {category.name}
              </h3>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-2 p-3 pt-0">

              <button
                onClick={() => {
                  setOpenEdit(true);
                  setEditData(category);
                }}
                className="flex-1 bg-green-100 hover:bg-green-200 text-green-600 text-sm font-medium py-1.5 rounded-md transition"
              >
                Edit
              </button>

              <button
                onClick={() => {
                  setOpenConfirmBoxDelete(true);
                  setDeleteCategory(category);
                }}
                className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 text-sm font-medium py-1.5 rounded-md transition"
              >
                Delete
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* LOADING */}
      {loading && <Loading />}

      {/* MODALS */}
      {openUploadCategory && (
        <UploadCategoryModel
          fetchData={fetchCategory}
          close={() => setOpenUploadCategory(false)}
        />
      )}

      {openEdit && (
        <EditCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchCategory}
        />
      )}

      {openConfimBoxDelete && (
        <CofirmBox
          close={() => setOpenConfirmBoxDelete(false)}
          cancel={() => setOpenConfirmBoxDelete(false)}
          confirm={handleDeleteCategory}
        />
      )}
    </section>
  );
};

export default CategoryPage;