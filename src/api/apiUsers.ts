import apiClient from "./apliClient";

export interface User {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: string;
}

export const getUsers = async () => {
  try {
    const { data } = await apiClient.get("/users");
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const createUser = async (user: User) => {
  try {
    const { data } = await apiClient.post("/users/register", user);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateUser = async (id: number, user: User) => {
  try {
    const { data } = await apiClient.put(`/users/${id}`, user);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteUser = async (id: number) => {
  try {
    const { data } = await apiClient.delete(`/users/${id}`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
