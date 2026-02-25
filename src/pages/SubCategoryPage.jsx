import React, { useEffect, useState } from "react";
import UploadSubCategoryModel from "../components/UploadSubCategoryModel";
import AxiosToastError from "../utils/AxiosToastError";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import DisplayTable from "../components/DisplayTable";
import { createColumnHelper } from "@tanstack/react-table";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { HiPencil } from "react-icons/hi";
import EditSubCategory from "../components/EditSubCategory";
import CofirmBox from "../components/CofirmBox";
import toast from "react-hot-toast";

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const columnHelper = createColumnHelper();

  const [ImageURL, setImageURL] = useState("");
  const [openEdit, setOpenEdit] = useState(false);
  const [editData, setEditData] = useState({ _id: "" });

  const [deleteSubCategory, setDeleteSubCategory] = useState({ _id: "" });
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false);

  /* ================= FETCH DATA ================= */
  const fetchSubCategory = async () => {
    try {
      setLoading(true);
      const response = await Axios({
        ...SummaryApi.getSubCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        setData(responseData.data);
      }
    } catch (error) {
      AxiosToastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubCategory();
  }, []);

  /* ================= TABLE COLUMN ================= */

  const column = [
    columnHelper.accessor("name", {
      header: "Name",
    }),

    columnHelper.accessor("image", {
      header: "Image",
      cell: ({ row }) => {
        return (
          <div className="flex justify-center">
            <img
              src={row.original.image}
              alt={row.original.name}
              className="w-10 h-10 rounded-md object-cover cursor-pointer border hover:scale-110 transition"
              onClick={() => setImageURL(row.original.image)}
            />
          </div>
        );
      },
    }),

    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => {
        return (
          <div className="flex flex-wrap gap-1">
            {row.original.category.map((c) => (
              <span
                key={c._id}
                className="bg-gray-100 text-xs px-2 py-1 rounded-md"
              >
                {c.name}
              </span>
            ))}
          </div>
        );
      },
    }),

    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => {
        return (
          <div className="flex items-center justify-center gap-3">
            {/* EDIT */}
            <button
              onClick={() => {
                setOpenEdit(true);
                setEditData(row.original);
              }}
              className="p-2 bg-green-100 rounded-full hover:bg-green-200 transition"
            >
              <HiPencil size={18} className="text-green-600" />
            </button>

            {/* DELETE */}
            <button
              onClick={() => {
                setOpenDeleteConfirmBox(true);
                setDeleteSubCategory(row.original);
              }}
              className="p-2 bg-red-100 rounded-full hover:bg-red-200 transition"
            >
              <MdDelete size={18} className="text-red-600" />
            </button>
          </div>
        );
      },
    }),
  ];

  /* ================= DELETE ================= */

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory,
      });

      const { data: responseData } = response;

      if (responseData.success) {
        toast.success(responseData.message);
        fetchSubCategory();
        setOpenDeleteConfirmBox(false);
        setDeleteSubCategory({ _id: "" });
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
            Sub Categories
          </h2>
          <p className="text-sm text-gray-500">
            Manage and organize your product sub categories
          </p>
        </div>

        <button
          onClick={() => setOpenAddSubCategory(true)}
          className="bg-primary-200 hover:bg-primary-300 text-white px-4 py-2 rounded-lg text-sm font-medium shadow transition"
        >
          + Add Sub Category
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-auto">
          <DisplayTable data={data} column={column} loading={loading} />
        </div>
      </div>

      {/* ADD */}
      {openAddSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {/* IMAGE VIEW */}
      {ImageURL && (
        <ViewImage url={ImageURL} close={() => setImageURL("")} />
      )}

      {/* EDIT */}
      {openEdit && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {/* DELETE CONFIRM */}
      {openDeleteConfirmBox && (
        <CofirmBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>
  );
};

export default SubCategoryPage;