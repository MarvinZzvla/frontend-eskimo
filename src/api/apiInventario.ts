import { Assignment } from "../pages/Asignacion/Asignacion";
import apiClient from "./apliClient";

export const getAssignments = async () => {
  try {
    const { data } = await apiClient.get("/inventarioempleado");
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const createAssignment = async (assignment: Assignment) => {
  try {
    const { data } = await apiClient.post("/inventarioempleado", assignment);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteAssignment = async (id: number) => {
  try {
    const { data } = await apiClient.delete(`/inventarioempleado/${id}`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
