"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import {
  PlusIcon,
  MinusIcon,
  MagnifyingGlassIcon,
  CalendarIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { addCompra, deleteCompras, getCompras } from "../../../api/apiCompras";
import { getProducts } from "../../../api/apiProductos";
import SearchableDropdown from "../../Ventas/components/SearchableDropdown";

interface Product {
  id: number;
  producto: string;
  cantidad: number;
  precio: number;
  precioVenta: number;
  createdAt: string;
  responsable: string;
}

function InventarioNegocio() {
  const getLocalStartDate = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Ajusta la fecha a tu zona horaria
    return date.toISOString().split("T")[0];
  };

  const getEndDate = (daysToAdd = 0) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd); // Agrega los días necesarios
    date.setHours(23, 59, 59, 9999); // Ajusta la hora a las 00:00:00
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset()); // Ajusta a la zona horaria local
    return date.toISOString().split("T")[0];
  };
  const [products, setProducts] = useState<Product[]>([]);
  const [groupedProducts, setGroupedProducts] = useState<{
    [key: string]: Product;
  }>({});
  const [startDate, setStartDate] = useState<string>(getLocalStartDate());

  const [endDate, setEndDate] = useState<string>(getEndDate(1));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState<"add" | "subtract">("add");
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [quantity, setQuantity] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [precioVenta, setPrecioVenta] = useState(0);
  const [presentationType, setPresentationType] = useState("Unidad");
  const [unitsPerPackage, setUnitsPerPackage] = useState(1);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [quantityFilter, setQuantityFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      const result = await getCompras(startDate, endDate);
      setProducts(result);
    };
    fetchData();
  }, [startDate, endDate]);

  //Obtener productos
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await getProducts();
      setGroupedProducts(response);
    };
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (!startDate || !endDate) return true;
      const productDate = new Date(product.createdAt);
      return (
        productDate >= new Date(startDate) && productDate <= new Date(endDate)
      );
    });
  }, [products]); // Solo se recalcula cuando estos valores cambian

  const filteredGroupedProducts = useMemo(() => {
    return Object.values(groupedProducts).filter((product) => {
      const matchesSearch = product.producto
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesQuantity =
        quantityFilter === "all" ||
        (quantityFilter === "normal" && product.cantidad > 10) ||
        (quantityFilter === "medio" &&
          product.cantidad <= 10 &&
          product.cantidad > 5) ||
        (quantityFilter === "poco" && product.cantidad <= 5);
      return matchesSearch && matchesQuantity;
    });
  }, [groupedProducts, searchTerm, quantityFilter]);

  const resetForm = () => {
    setSelectedProduct(0);
    setQuantity(0);
    setPresentationType("Unidad");
    setPrecio(0);
    setPrecioVenta(0);
    setUnitsPerPackage(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalQuantity = quantity * unitsPerPackage;
    const productName = filteredGroupedProducts.find(
      (producto) => producto.id === selectedProduct
    );
    const newQuantity = formType === "add" ? totalQuantity : -totalQuantity;
    const userInfo = JSON.parse(localStorage.getItem("login") ?? "");

    const nuevaCompra = {
      productoId: selectedProduct,
      producto: productName?.producto,
      cantidad: newQuantity,
      precio: precio,
      precioVenta: precioVenta,
      presentacion: presentationType,
      unidades: unitsPerPackage,
      responsable: userInfo.name,
      createdAt: new Date().toISOString(),
    };

    const compra = await addCompra(nuevaCompra);
    const compraCard = {
      id: compra.id,
      productoId: compra.productoId,
      producto: compra.producto,
      cantidad: compra.cantidad,
      precio: compra.precio,
      precioVenta: compra.precioVenta,
      createdAt: compra.createdAt,
      responsable: compra.responsable,
    };
    setGroupedProducts((prevGroupedProducts) =>
      Object.values(prevGroupedProducts).map((product) =>
        product.id === compra.productoId
          ? { ...product, cantidad: product.cantidad + compra.cantidad }
          : product
      )
    );
    setProducts((prev) => [...prev, compraCard]);
    resetForm();
    // Here you would typically send this data to your backend
    setIsModalOpen(false);
  };

  const getQuantityColor = (quantity: number) => {
    if (quantity > 10) return "text-green-600";
    if (quantity > 5) return "text-orange-500";
    return "text-red-600";
  };

  const handleDelete = async (compra: any) => {
    try {
      console.log("Compra", compra);
      await deleteCompras(compra.id);
      setGroupedProducts((prevGroupedProducts) =>
        Object.values(prevGroupedProducts).map((product) =>
          product.id === compra.productoId
            ? { ...product, cantidad: product.cantidad + compra.cantidad * -1 }
            : product
        )
      );
      setProducts(products.filter((product) => product.id !== compra.id));
      setDeleteConfirmation(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container max-h-60 overflow-y-auto mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Inventario de Productos
      </h1>

      {/* Grouped Products */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Resumen de Productos</h2>
        <div className="flex space-x-4 mb-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar producto..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quantityFilter}
              onChange={(e) => setQuantityFilter(e.target.value)}
            >
              <option value="all">Todas las cantidades</option>
              <option value="normal">Normal (10)</option>
              <option value="medio">Medio (6-10)</option>
              <option value="poco">Poco (≤5)</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio de Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio de Venta
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGroupedProducts.map((product) => (
                <tr key={product.producto}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.producto}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap font-medium ${getQuantityColor(
                      product.cantidad
                    )}`}
                  >
                    {product.cantidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${product.precio.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${product.precioVenta.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Products with Date Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Registros Detallados</h2>
        <div className="flex space-x-4 mb-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha Inicio
            </label>
            <div className="relative">
              <input
                type="date"
                id="startDate"
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          <div>
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Fecha Fin
            </label>
            <div className="relative">
              <input
                type="date"
                id="endDate"
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
              <CalendarIcon className="h-5 w-5 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto max-h-60">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio de Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio de Venta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.producto}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.cantidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${product.precio.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${product.precioVenta.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(product.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {deleteConfirmation === product.id ? (
                      <div>
                        <span className="text-sm text-gray-600 mr-2">
                          ¿Estás seguro?
                        </span>
                        <button
                          onClick={() => handleDelete(product)}
                          className="text-red-600 hover:text-red-800 mr-2"
                        >
                          Sí
                        </button>
                        <button
                          onClick={() => setDeleteConfirmation(null)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmation(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 flex flex-col space-y-4">
        <button
          onClick={() => {
            setFormType("add");
            setIsModalOpen(true);
          }}
          className="bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          <PlusIcon className="h-6 w-6" />
        </button>
        <button
          onClick={() => {
            setFormType("subtract");
            setIsModalOpen(true);
          }}
          className="bg-red-500 text-white rounded-full p-3 shadow-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <MinusIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black opacity-95 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl p-6 m-4 max-w-xl w-full">
            <h3 className="text-lg font-semibold mb-4">
              {formType === "add" ? "Sumar Producto" : "Restar Producto"}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="product"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Producto
                </label>
                <SearchableDropdown
                  items={filteredGroupedProducts}
                  selectedItem={selectedProduct}
                  setSelectedItem={setSelectedProduct}
                  placeholder="Seleccionar producto"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="precio"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Precio compra
                </label>
                <input
                  type="number"
                  id="precio"
                  className="pl-3 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={precio}
                  onChange={(e) =>
                    setPrecio(Math.max(0, Number.parseInt(e.target.value)))
                  }
                  min="0"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="precioVenta"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Precio Venta
                </label>
                <input
                  type="number"
                  id="precioVenta"
                  className="pl-3 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={precioVenta}
                  onChange={(e) =>
                    setPrecioVenta(Math.max(0, Number.parseInt(e.target.value)))
                  }
                  min="0"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Cantidad
                </label>
                <input
                  type="number"
                  id="quantity"
                  className="pl-3 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(0, Number.parseInt(e.target.value)))
                  }
                  min="0"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="presentationType"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tipo de Presentación
                </label>
                <select
                  id="presentationType"
                  className="pl-3 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={presentationType}
                  onChange={(e) => setPresentationType(e.target.value)}
                  required
                >
                  <option value="Unidad">Unidad</option>
                  <option value="Caja">Caja</option>
                  <option value="Bolsa">Bolsa</option>
                </select>
              </div>
              {presentationType !== "Unidad" && (
                <div className="mb-4">
                  <label
                    htmlFor="unitsPerPackage"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Unidades por {presentationType}
                  </label>
                  <input
                    type="number"
                    id="unitsPerPackage"
                    className="pl-3 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={unitsPerPackage}
                    onChange={(e) =>
                      setUnitsPerPackage(
                        Math.max(1, Number.parseInt(e.target.value))
                      )
                    }
                    min="1"
                    required
                  />
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventarioNegocio;
