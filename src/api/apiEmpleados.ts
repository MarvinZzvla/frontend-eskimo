import apiClient from "./apliClient";

type Empleado = {
  id?: number;
  nombre: string;
  telefono: string;
};

//Actualizar empleado
export const updateEmployee = async (empleado: Empleado) => {
  try {
    console.log("Empleado ID", empleado.id);
    const { data } = await apiClient.put(`/empleados/${empleado.id}`, empleado);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

// Agregar empleados
export const addEmployee = async (empleado: Empleado) => {
  try {
    const { data } = await apiClient.post("/empleados", empleado);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getEmployees = async () => {
  try {
    const { data } = await apiClient.get("/empleados");
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

//Borrar empleado
export const deleteEmployee = async (id: number) => {
  try {
    await apiClient.delete(`/empleados/${id}`);
  } catch (error) {
    throw new Error(error);
  }
};
