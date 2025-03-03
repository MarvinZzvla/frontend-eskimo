import apiClient from "./apliClient";
//Definir el tipo de dato
type Compra = {
  id: number;
  productoId: number;
  producto: string;
  cantidad: number;
  precio: number;
  precioVenta: number;
  presentacion: string;
  unidades: number;
  responsable: string;
  fecha: Date;
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

export const getCompras = async (initialDate: Date, finalDate: Date) => {
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
