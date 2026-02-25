import React, { useState } from "react";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import AxiosToastError from "../utils/AxiosToastError";

const HomeBanner = () => {
  const [image, setImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await Axios({
        ...SummaryApi.updateHomeBanner,
        data: { image }
      });

      if (response.data.success) {
        toast.success("Home banner updated successfully");
        setImage("");
      }
    } catch (error) {
      AxiosToastError(error);
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">
        Update Home Page Banner
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
        <input
          type="text"
          placeholder="Paste banner image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="border px-4 py-2 rounded"
        />

        {image && (
          <img
            src={image}
            alt="preview"
            className="w-full h-40 object-cover rounded"
          />
        )}

        <button className="bg-green-700 hover:bg-green-600 text-white py-2 rounded">
          Update Banner
        </button>
      </form>
    </section>
  );
};

export default HomeBanner;
