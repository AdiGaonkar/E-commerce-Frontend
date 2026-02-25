import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import uploadImage from "../utils/UploadImage";
import Loading from "../components/Loading";
import ViewImage from "../components/ViewImage";
import { MdDelete } from "react-icons/md";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import AddFieldComponent from "../components/AddFieldComponent";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import AxiosToastError from "../utils/AxiosToastError";
import successAlert from "../utils/SuccessAlert";

const UploadProduct = () => {

  const [data,setData] = useState({
    name:"",
    image:[],
    category:[],
    subCategory:[],
    unit:"",
    stock:"",
    price:"",
    discount:"",
    description:"",
    more_details:{},
  });

  const [imageLoading,setImageLoading] = useState(false);
  const [ViewImageURL,setViewImageURL] = useState("");

  const allCategory = useSelector(state=>state.product.allCategory);
  const allSubCategory = useSelector(state=>state.product.allSubCategory);

  const [selectCategory,setSelectCategory] = useState("");
  const [selectSubCategory,setSelectSubCategory] = useState("");

  const [openAddField,setOpenAddField] = useState(false);
  const [fieldName,setFieldName] = useState("");

  /* ================= INPUT ================= */
  const handleChange = (e)=>{
    const {name,value} = e.target;
    setData(prev=>({...prev,[name]:value}));
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleUploadImage = async(e)=>{
    const file = e.target.files[0];
    if(!file) return;

    setImageLoading(true);

    const response = await uploadImage(file);
    const imageUrl = response.data.data.url;

    setData(prev=>({
      ...prev,
      image:[...prev.image,imageUrl]
    }));

    setImageLoading(false);
  };

  const handleDeleteImage=(index)=>{
    data.image.splice(index,1);
    setData({...data});
  };

  const handleRemoveCategory=(index)=>{
    data.category.splice(index,1);
    setData({...data});
  };

  const handleRemoveSubCategory=(index)=>{
    data.subCategory.splice(index,1);
    setData({...data});
  };

  const handleAddField=()=>{
    setData(prev=>({
      ...prev,
      more_details:{
        ...prev.more_details,
        [fieldName]:""
      }
    }));
    setFieldName("");
    setOpenAddField(false);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{
      const response = await Axios({
        ...SummaryApi.createProduct,
        data:data
      });

      if(response.data.success){
        successAlert(response.data.message);

        setData({
          name:"",
          image:[],
          category:[],
          subCategory:[],
          unit:"",
          stock:"",
          price:"",
          discount:"",
          description:"",
          more_details:{},
        });
      }

    }catch(error){
      AxiosToastError(error);
    }
  };

  /* ================= UI ================= */

  return (
<section className="bg-gray-50 min-h-screen p-6">

  {/* HEADER */}
  <div className="bg-white rounded-xl shadow-sm border p-5 mb-6">
    <h2 className="text-xl font-semibold text-gray-800">
      Upload Product
    </h2>
    <p className="text-sm text-gray-500">
      Add new product to your store
    </p>
  </div>

  <div className="max-w-6xl mx-auto">
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border p-6 space-y-6"
    >

      {/* NAME */}
      <div className="grid gap-2">
        <label className="font-medium">Product Name</label>
        <input
          name="name"
          value={data.name}
          onChange={handleChange}
          required
          className="border rounded-lg p-3 bg-gray-50 outline-none"
        />
      </div>

      {/* DESCRIPTION */}
      <div className="grid gap-2">
        <label className="font-medium">Description</label>
        <textarea
          rows={4}
          name="description"
          value={data.description}
          onChange={handleChange}
          required
          className="border rounded-lg p-3 bg-gray-50 resize-none"
        />
      </div>

      {/* IMAGE */}
      <div>
        <p className="font-medium mb-2">Images</p>

        <label className="border-2 border-dashed rounded-xl h-28 flex flex-col justify-center items-center cursor-pointer hover:bg-gray-50">
          {imageLoading ? <Loading/> :
          <>
            <FaCloudUploadAlt size={32}/>
            <p>Upload Image</p>
          </>}

          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleUploadImage}
          />
        </label>

        <div className="flex flex-wrap gap-4 mt-4">
          {data.image.map((img,index)=>(
            <div key={index} className="relative w-24 h-24 border rounded-lg overflow-hidden group">
              <img
                src={img}
                className="w-full h-full object-cover cursor-pointer"
                onClick={()=>setViewImageURL(img)}
              />
              <div
                onClick={()=>handleDeleteImage(index)}
                className="absolute bottom-1 right-1 bg-red-500 text-white p-1 rounded hidden group-hover:block"
              >
                <MdDelete/>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CATEGORY */}
      <div className="grid gap-2">
        <label className="font-medium">Category</label>

        <select
          value={selectCategory}
          onChange={(e)=>{
            const value=e.target.value;
            const category=allCategory.find(el=>el._id===value);

            setData(prev=>({
              ...prev,
              category:[...prev.category,category]
            }));

            setSelectCategory("");
          }}
          className="border rounded-lg p-3 bg-gray-50"
        >
          <option value="">Select Category</option>
          {allCategory.map(c=>(
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2">
          {data.category.map((c,index)=>(
            <div key={index} className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-sm">
              {c.name}
              <IoClose onClick={()=>handleRemoveCategory(index)} className="cursor-pointer"/>
            </div>
          ))}
        </div>
      </div>

      {/* SUBCATEGORY */}
      <div className="grid gap-2">
        <label className="font-medium">Sub Category</label>

        <select
          value={selectSubCategory}
          onChange={(e)=>{
            const value=e.target.value;
            const sub=allSubCategory.find(el=>el._id===value);

            setData(prev=>({
              ...prev,
              subCategory:[...prev.subCategory,sub]
            }));

            setSelectSubCategory("");
          }}
          className="border rounded-lg p-3 bg-gray-50"
        >
          <option value="">Select Sub Category</option>
          {allSubCategory.map(c=>(
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <div className="flex flex-wrap gap-2">
          {data.subCategory.map((c,index)=>(
            <div key={index} className="flex items-center gap-2 bg-purple-50 px-3 py-1 rounded-full text-sm">
              {c.name}
              <IoClose onClick={()=>handleRemoveSubCategory(index)} className="cursor-pointer"/>
            </div>
          ))}
        </div>
      </div>

      {/* PRICE GRID */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {["unit","stock","price","discount"].map(field=>(
          <input
            key={field}
            name={field}
            value={data[field]}
            onChange={handleChange}
            placeholder={field}
            required
            className="border rounded-lg p-3 bg-gray-50"
          />
        ))}
      </div>

      {/* MORE DETAILS */}
      {Object.keys(data.more_details).map(k=>(
        <input
          key={k}
          value={data.more_details[k]}
          placeholder={k}
          required
          onChange={(e)=>setData(prev=>({
            ...prev,
            more_details:{...prev.more_details,[k]:e.target.value}
          }))}
          className="border rounded-lg p-3 bg-gray-50"
        />
      ))}

      <div
        onClick={()=>setOpenAddField(true)}
        className="w-36 text-center border rounded-lg py-2 cursor-pointer hover:bg-primary-200"
      >
        + Add Field
      </div>

      <button className="w-full bg-primary-200 hover:bg-primary-300 text-white py-3 rounded-xl font-semibold">
        Submit Product
      </button>

    </form>
  </div>

  {ViewImageURL && (
    <ViewImage url={ViewImageURL} close={()=>setViewImageURL("")}/>
  )}

  {openAddField && (
    <AddFieldComponent
      value={fieldName}
      onChange={(e)=>setFieldName(e.target.value)}
      submit={handleAddField}
      close={()=>setOpenAddField(false)}
    />
  )}
</section>
  );
};

export default UploadProduct;