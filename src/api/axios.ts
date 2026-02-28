import axios from "axios";

console.log("VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL);

// Base API URL
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1`;

// Axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   AUTH APIs
========================= */

// Register (Customer)
export const register = async (userData: {
  name: string;
  email: string;
  password: string;
  role: "customer";
}) => {
  try {
    const res = await axiosInstance.post("/auth/register", userData);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/* =========================
   CART APIs
========================= */

// ➕ Add to Cart
export const addToCart = async (data: {
  productId: string;
  quantity: number;
}) => {
  try {
    const res = await axiosInstance.post("/cart/add", data);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// ✏️ Update Cart Quantity
export const updateCartQuantity = async (data: {
  productId: string;
  quantity: number;
}) => {
  try {
    const res = await axiosInstance.patch("/cart/update", data);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// ❌ Remove Item from Cart
export const removeFromCart = async (productId: string) => {
  try {
    const res = await axiosInstance.delete(`/cart/remove/${productId}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// 👀 Get Cart
export const getCart = async () => {
  try {
    const res = await axiosInstance.get("/cart");
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

/* =========================
   PRODUCT APIs (User View)
========================= */

// 📦 Get All Products
export const getAllProducts = async (params?: {
  page?: number;
  limit?: number;
  category?: string;
  sort?: string;
}) => {
  try {
    const res = await axiosInstance.get("/products", { params });
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// 🔍 Get Product Details (by slug)
export const getProductDetails = async (slug: string) => {
  try {
    const res = await axiosInstance.get(`/products/${slug}`);
    return res.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export default axiosInstance;