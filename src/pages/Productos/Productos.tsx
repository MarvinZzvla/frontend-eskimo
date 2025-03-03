"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { addProduct, getProducts } from "../../api/apiProductos";

export interface Product {
  id: number;
  producto: string;
  precio: number;
  precioVenta: number;
  cantidad: number;
  presentation: "Caja" | "Bolsa" | "Unidad";
  units?: number;
}

function Productos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    producto: "",
    precio: 0,
    precioVenta: 0,
    cantidad: 0,
    presentation: "Unidad",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProducts(await getProducts());
      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.producto
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesQuantity =
      quantityFilter === "all" ||
      (quantityFilter === "normal" && product.cantidad > 10) ||
      (quantityFilter === "medium" &&
        product.cantidad <= 10 &&
        product.cantidad > 5) ||
      (quantityFilter === "low" && product.cantidad <= 5);
    return matchesSearch && matchesQuantity;
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]:
        name === "precio" ||
        name === "precioVenta" ||
        name === "cantidad" ||
        name === "units"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newProduct.producto &&
      newProduct.precio &&
      newProduct.precioVenta &&
      newProduct.cantidad
    ) {
      addProduct(newProduct as Product);
      setProducts((prev) => [
        ...prev,
        {
          ...(newProduct as Product),
          id: Date.now(),
          cantidad: (newProduct.cantidad || 1) * (newProduct.units || 1),
        },
      ]);

      setNewProduct({
        producto: "",
        precio: 0,
        precioVenta: 0,
        cantidad: 0,
        presentation: "Unidad",
      });
      setIsFormOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Productos</h1>

      <div className="mb-4 flex space-x-4">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
        <select
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={quantityFilter}
          onChange={(e) => setQuantityFilter(e.target.value)}
        >
          <option value="all">Todas las cantidades</option>
          <option value="normal">Normal</option>
          <option value="medium">Medio </option>
          <option value="low">Poco</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              {product.producto}
            </h2>
            <p className="text-gray-600">
              Precio de compra: ${product.precio.toFixed(2)}
            </p>
            <p className="text-gray-600">
              Precio de venta: ${product.precioVenta.toFixed(2)}
            </p>
            <p className="text-green-600 font-medium">
              Ganancia: ${(product.precioVenta - product.precio).toFixed(2)}
            </p>
            <p
              className={`font-medium ${
                product.cantidad > 10
                  ? "text-green-600"
                  : product.cantidad > 5
                  ? "text-orange-500"
                  : "text-red-600"
              }`}
            >
              Cantidad disponible: {product.cantidad}
            </p>
          </div>
        ))}
      </div>

      <button
        className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => setIsFormOpen(true)}
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black opacity-90 flex items-center justify-center">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              Agregar Nuevo Producto
            </h2>
            <label className="block mb-2 text-gray-700">
              Nombre del producto
            </label>
            <input
              type="text"
              name="producto"
              placeholder="Nombre del producto"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={newProduct.producto}
              onChange={handleInputChange}
              required
            />
            <label className="block mb-2 text-gray-700">Precio de compra</label>
            <input
              type="number"
              name="precio"
              placeholder="Precio de compra"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={newProduct.precio || ""}
              onChange={handleInputChange}
              required
            />
            <label className="block mb-2 text-gray-700">Precio de venta</label>
            <input
              type="number"
              name="precioVenta"
              placeholder="Precio de venta"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={newProduct.precioVenta || ""}
              onChange={handleInputChange}
              required
            />
            <label className="block mb-2 text-gray-700">
              Cantidad disponible
            </label>
            <input
              type="number"
              name="cantidad"
              placeholder="Cantidad disponible"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={newProduct.cantidad || ""}
              onChange={handleInputChange}
              required
            />
            <label className="block mb-2 text-gray-700">Presentación</label>
            <select
              name="presentation"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={newProduct.presentation}
              onChange={handleInputChange}
              required
            >
              <option value="Unidad">Unidad</option>
              <option value="Caja">Caja</option>
              <option value="Bolsa">Bolsa</option>
            </select>
            {(newProduct.presentation === "Caja" ||
              newProduct.presentation === "Bolsa") && (
              <>
                <label className="block mb-2 text-gray-700">
                  Unidades por caja/bolsa
                </label>
                <input
                  type="number"
                  name="units"
                  placeholder="Unidades por caja/bolsa"
                  className="w-full mb-2 px-3 py-2 border rounded"
                  value={newProduct.units || ""}
                  onChange={handleInputChange}
                  required
                />
              </>
            )}
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Agregar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Productos;
