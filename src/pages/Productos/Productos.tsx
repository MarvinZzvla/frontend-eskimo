"use client";

import type React from "react";
import { useState } from "react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface Product {
  id: number;
  name: string;
  buyPrice: number;
  sellPrice: number;
  quantity: number;
  presentation: "Caja" | "Bolsa" | "Unidad";
  units?: number;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "Producto 1",
    buyPrice: 10,
    sellPrice: 15,
    quantity: 20,
    presentation: "Unidad",
  },
  {
    id: 2,
    name: "Producto 2",
    buyPrice: 20,
    sellPrice: 30,
    quantity: 8,
    presentation: "Caja",
    units: 12,
  },
  {
    id: 3,
    name: "Producto 3",
    buyPrice: 5,
    sellPrice: 8,
    quantity: 3,
    presentation: "Bolsa",
    units: 50,
  },
];

function Productos() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    buyPrice: 0,
    sellPrice: 0,
    quantity: 0,
    presentation: "Unidad",
  });

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesQuantity =
      quantityFilter === "all" ||
      (quantityFilter === "normal" && product.quantity > 10) ||
      (quantityFilter === "medium" &&
        product.quantity <= 10 &&
        product.quantity > 5) ||
      (quantityFilter === "low" && product.quantity <= 5);
    return matchesSearch && matchesQuantity;
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]:
        name === "buyPrice" ||
        name === "sellPrice" ||
        name === "quantity" ||
        name === "units"
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newProduct.name &&
      newProduct.buyPrice &&
      newProduct.sellPrice &&
      newProduct.quantity
    ) {
      setProducts((prev) => [
        ...prev,
        { ...(newProduct as Product), id: Date.now() },
      ]);
      setNewProduct({
        name: "",
        buyPrice: 0,
        sellPrice: 0,
        quantity: 0,
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
              {product.name}
            </h2>
            <p className="text-gray-600">
              Precio de compra: ${product.buyPrice.toFixed(2)}
            </p>
            <p className="text-gray-600">
              Precio de venta: ${product.sellPrice.toFixed(2)}
            </p>
            <p className="text-green-600 font-medium">
              Ganancia: ${(product.sellPrice - product.buyPrice).toFixed(2)}
            </p>
            <p
              className={`font-medium ${
                product.quantity > 10
                  ? "text-green-600"
                  : product.quantity > 5
                  ? "text-orange-500"
                  : "text-red-600"
              }`}
            >
              Cantidad disponible: {product.quantity}
            </p>
            <p className="text-gray-600">
              Presentación: {product.presentation}
            </p>
            {product.units && (
              <p className="text-gray-600">Unidades: {product.units}</p>
            )}
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
            <input
              type="text"
              name="name"
              placeholder="Nombre del producto"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={newProduct.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="buyPrice"
              placeholder="Precio de compra"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={newProduct.buyPrice || ""}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="sellPrice"
              placeholder="Precio de venta"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={newProduct.sellPrice || ""}
              onChange={handleInputChange}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Cantidad disponible"
              className="w-full mb-2 px-3 py-2 border rounded"
              value={newProduct.quantity || ""}
              onChange={handleInputChange}
              required
            />
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
              <input
                type="number"
                name="units"
                placeholder="Unidades por caja/bolsa"
                className="w-full mb-2 px-3 py-2 border rounded"
                value={newProduct.units || ""}
                onChange={handleInputChange}
                required
              />
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
