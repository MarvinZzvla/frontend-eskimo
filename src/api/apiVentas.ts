import apiClient from "./apliClient";
export interface Venta {
  id?: number;
  productoId: number;
  producto: string;
  empleadoId: number;
  empleado: string;
  precio: number;
  precioVenta: number;
  cantidad: number;
  createdAt?: string;
}
//Crear una venta
export const createVenta = async (ventas: Venta[]) => {
  try {
    const { data } = await apiClient.post("/ventas", ventas);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
//Obtener todas las ventas
export const getVentas = async (startDate: string, endDate: string) => {
  try {
    const { data } = await apiClient.get(
      `/ventas?startDate=${startDate}&endDate=${endDate}`
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
export const getVentasByEmpleado = async (
  id: number,
  startDate: string,
  endDate: string
) => {
  try {
    const { data } = await apiClient.get(
      `/ventas/${id}?startDate=${startDate}&endDate=${endDate}`
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getEmpleadoMasVentas = async (
  startDate: string,
  endDate: string
) => {
  try {
    const { data } = await apiClient.get(
      `/ventas/reporte?startDate=${startDate}&endDate=${endDate}`
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getProductosMasVentas = async (
  startDate: string,
  endDate: string
) => {
  try {
    const { data } = await apiClient.get(
      `/products/reporte?startDate=${startDate}&endDate=${endDate}`
    );
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
