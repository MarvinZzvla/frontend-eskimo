import { Product } from "../pages/Productos/Productos";
import apiClient from "./apliClient";

export const getProducts = async () => {
  try {
    const { data } = await apiClient.get("/products");
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
export const getProductsByEmpleado = async (id: number) => {
  try {
    const { data } = await apiClient.get(`/products/${id}`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const addProduct = async (product: Product) => {
  try {
    await apiClient.post("/products", product);
  } catch (error) {
    throw new Error(error);
  }
};

export const editProduct = async (product: Product) => {
  try {
    await apiClient.put(`/products/${product.id}`, product);
  } catch (error) {
    throw new Error(error);
  }
};
