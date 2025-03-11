import apiClient from "./apliClient";

export const verifySubscription = async () => {
  try {
    const { data } = await apiClient.get("/billings/check");
    return data.msg;
  } catch (error) {
    throw new Error(error);
  }
};

export const renewSubscription = async (token: string) => {
  try {
    const { data } = await apiClient.post("/billings", { token: token });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
