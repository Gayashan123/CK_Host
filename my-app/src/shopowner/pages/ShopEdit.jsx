import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import ShopEditModal from "../components/ShopEdit";
import { toast } from "react-toastify";

const ShopEditPage = () => {
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 const API_URL = import.meta.env.VITE_API_URL || "https://observant-vibrancy-production.up.railway.app";
  
 const goBack = () => window.history.back();

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`${API_URL}/api/shops/my-shop`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        
        if (res.data && res.data.shop) {
          setShop(res.data.shop);
        } else {
          throw new Error("Invalid shop data received");
        }
      } catch (error) {
        console.error("Failed to fetch shop data", error);
        setError(error.response?.data?.message || "Failed to load shop data");
        toast.error(error.response?.data?.message || "Failed to load shop data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchShop();
  }, [API_URL]);

  const handleShopUpdateSuccess = (updatedShop) => {
    setShop(updatedShop);
    toast.success("Shop updated successfully!");
  };

  return (
    <div className="min-h-screen bg-[#f9fafa] flex flex-col items-center py-6 px-2 sm:px-4 md:px-8 relative font-sans">
      {/* Back Button */}
      <div className="w-full max-w-full sm:max-w-2xl mb-4">
        <button
          onClick={goBack}
          className="flex items-center text-blue-600 hover:text-blue-800 transition text-xs sm:text-sm md:text-base lowercase sm:normal-case"
          aria-label="Go back to settings"
        >
          <FaArrowLeft className="mr-2" />
          back to settings
        </button>
      </div>

      {/* Heading */}
      <div className="w-full max-w-full sm:max-w-2xl text-center mb-4">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold text-gray-800 lowercase sm:normal-case">
          edit your shop
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 lowercase sm:normal-case">
          update shop profile, image, and contact info
        </p>
      </div>

      {/* Shop Form */}
      <div className="w-full max-w-full sm:max-w-2xl bg-white rounded-2xl shadow-xl p-3 sm:p-6 md:p-8">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 text-sm sm:text-base mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Try Again
            </button>
          </div>
        ) : shop ? (
          <ShopEditModal 
            shop={shop} 
            onClose={goBack} 
            onSuccess={handleShopUpdateSuccess}
            apiUrl={API_URL}
          />
        ) : (
          <p className="text-red-500 text-center text-xs sm:text-base lowercase sm:normal-case py-8">
            No shop information available.
          </p>
        )}
      </div>
    </div>
  );
};

export default ShopEditPage;