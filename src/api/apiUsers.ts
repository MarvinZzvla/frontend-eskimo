import apiClient from "./apliClient";

export const getUsers = async () => {
  try {
    const { data } = await apiClient.get("/users");
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
