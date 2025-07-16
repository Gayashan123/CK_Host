import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";

const initialShopData = {
  name: "",
  activeTime: "",
  description: "",
  location: "",
  photo: null,
  priceRange: "",
  shopType: "",
  contact: "",
};

const ShopCreate = () => {
  const [shopData, setShopData] = useState(initialShopData);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://observant-vibrancy-production.up.railway.app";

  // Clean up URL object when photo changes or component unmounts to avoid memory leaks
  useEffect(() => {
    return () => {
      if (photoPreview) URL.revokeObjectURL(photoPreview);
    };
  }, [photoPreview]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "photo" && files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file (JPEG, PNG)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }
      setShopData((prev) => ({ ...prev, photo: file }));
      if (photoPreview) URL.revokeObjectURL(photoPreview);
      setPhotoPreview(URL.createObjectURL(file));
    } else {
      setShopData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(shopData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    });

    try {
      const response = await axios.post(`${API_URL}/api/shops`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Shop created successfully!");
      setShopData(initialShopData);
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
        setPhotoPreview(null);
      }

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         "Failed to create shop";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Apple-style UI components
  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/60 backdrop-blur-sm transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-gray-900 placeholder-gray-400 text-base outline-none font-medium disabled:opacity-60";
  const labelClass = "block text-xs font-semibold text-gray-700 mb-1 ml-1 tracking-wide";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f3f4f6] via-[#e9eaf0] to-[#f9fafb] px-4 sm:px-0">
      <div className="w-full max-w-xl bg-white/70 backdrop-blur-2xl shadow-2xl rounded-3xl border border-gray-100 p-8 sm:p-12 relative overflow-hidden">
        {/* Top Apple-style Glow */}
        <div className="absolute -top-24 left-[55%] w-72 h-72 bg-gradient-to-br from-blue-500/20 to-purple-400/10 blur-3xl rounded-full pointer-events-none" />

        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-gray-900 tracking-tight">
          Create Your Shop
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Shop Name */}
          <div>
            <label htmlFor="shop-name" className={labelClass}>
              Shop Name <span className="text-red-500">*</span>
            </label>
            <input
              id="shop-name"
              name="name"
              value={shopData.name}
              onChange={handleChange}
              placeholder="Apple Bistro"
              className={inputClass}
              required
              disabled={loading}
              maxLength={100}
            />
          </div>

          {/* Active Time & Price Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="active-time" className={labelClass}>
                Active Time
              </label>
              <input
                id="active-time"
                name="activeTime"
                value={shopData.activeTime}
                onChange={handleChange}
                placeholder="8AM - 10PM"
                className={inputClass}
                disabled={loading}
                maxLength={50}
              />
            </div>

            <div>
              <label htmlFor="price-range" className={labelClass}>
                Price Range
              </label>
              <input
                id="price-range"
                name="priceRange"
                value={shopData.priceRange}
                onChange={handleChange}
                placeholder="Rs.100 - Rs.1500"
                className={inputClass}
                disabled={loading}
                maxLength={50}
              />
            </div>
          </div>

          {/* Contact Number */}
          <div>
            <label htmlFor="contact" className={labelClass}>
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              id="contact"
              name="contact"
              value={shopData.contact}
              onChange={handleChange}
              placeholder="+94 7XXXXXXXX"
              className={inputClass}
              disabled={loading}
              type="tel"
              pattern="^(\+94\s?\d{9,10})$"
              maxLength={15}
              required
            />
          </div>

          {/* Shop Type */}
          <div>
            <label htmlFor="shop-type" className={labelClass}>
              Shop Type <span className="text-red-500">*</span>
            </label>
            <select
              id="shop-type"
              name="shopType"
              value={shopData.shopType}
              onChange={handleChange}
              required
              disabled={loading}
              className={inputClass}
            >
              <option value="" disabled>Select shop type</option>
              <option value="restaurant">Restaurant</option>
              <option value="small_food_shop">Small Food Shop</option>
              <option value="hotel">Hotel</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={shopData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Describe your shop briefly"
              className={inputClass}
              disabled={loading}
              maxLength={500}
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className={labelClass}>
              Location
            </label>
            <input
              id="location"
              name="location"
              value={shopData.location}
              onChange={handleChange}
              placeholder="Colombo, Kandy, ..."
              className={inputClass}
              disabled={loading}
              maxLength={100}
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className={labelClass}>Photo</label>
            <button
              type="button"
              onClick={handlePhotoClick}
              disabled={loading}
              className="flex items-center gap-2 w-full bg-gradient-to-tr from-blue-50 to-purple-50 text-blue-700 font-semibold py-3 px-4 rounded-xl border border-blue-100 shadow-sm hover:bg-blue-100/70 transition disabled:cursor-not-allowed"
            >
              <FiUpload className="w-5 h-5" />
              {photoPreview ? "Change Photo" : "Upload Photo"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              name="photo"
              id="photo"
              accept="image/*"
              onChange={handleChange}
              className="hidden"
              disabled={loading}
            />
            {photoPreview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={photoPreview}
                  alt="Shop preview"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200 shadow"
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-lg shadow-indigo-200/30 hover:from-blue-700 hover:to-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 text-lg flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiCheckCircle className="w-5 h-5" />
                  <span>Save Shop</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopCreate;