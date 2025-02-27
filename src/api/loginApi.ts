import apiClient from "./apliClient";

export const login = async (email: string, password: string) => {
  const { data } = await apiClient.post("/login", { email, password });
  return data;
};
