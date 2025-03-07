import apiClient from "./apliClient";
//Definir el tipo de dato
type Compra = {
  id?: number;
  productoId: number;
  producto: string;
  cantidad: number;
  precio: number;
  precioVenta: number;
  presentacion: string;
  unidades: number;
  responsable: string;
  createdAt: Date;
};

//Crear una compra
export const addCompra = async (compra: Compra) => {
  try {
    const { data } = await apiClient.post("/compras/create", compra);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCompras = async (initialDate: string, finalDate: string) => {
  try {
    const { data } = await apiClient.post("/compras", {
      initialDate,
      finalDate,
    });
    return data;
  } catch (error) {
    throw new Error(error);
  }
};

export const deleteCompras = async (compraId: number) => {
  try {
    const { data } = await apiClient.delete(`/compras/${compraId}`);
    return data;
  } catch (error) {
    throw new Error(error);
  }
};
