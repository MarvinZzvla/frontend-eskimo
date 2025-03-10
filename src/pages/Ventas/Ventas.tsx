import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  PlusIcon,
  ShoppingCartIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { getEmployees } from "../../api/apiEmpleados";
import { getProductsByEmpleado } from "../../api/apiProductos";
import SearchableDropdown from "./components/SearchableDropdown";
import { createVenta, Venta } from "../../api/apiVentas";
import toast, { Toaster } from "react-hot-toast";

interface Employee {
  id: number;
  nombre: string;
}

interface Product {
  id: number;
  producto: string;
  precioCompra: number;
  precio: number;
  cantidad: number;
}

interface SaleItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  pricePurchase: number;
  price: number;
  total: number;
}

function Ventas() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<number>(0);
  const [selectedInfoProduct, setSelectedInfoProduct] = useState<Product>();
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [salePrice, setSalePrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<SaleItem[]>([]);

  useEffect(() => {
    const fetchEmpleados = async () => {
      setEmployees(await getEmployees());
    };
    fetchEmpleados();
  }, []);
  useEffect(() => {
    const fetchProductos = async () => {
      if (selectedEmployee) {
        setProducts(await getProductsByEmpleado(selectedEmployee));
      }
    };
    fetchProductos();
  }, [selectedEmployee]);

  useEffect(() => {
    const product = products.find((p) => p.id === selectedProduct);
    if (product) {
      //console.log(product);
      setSalePrice(product.precio);
      setSelectedInfoProduct(product);
    }
  }, [selectedProduct, products]);

  const updateQuantity = (id: number, cantidad: number) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id
          ? { ...product, cantidad: product.cantidad + cantidad }
          : product
      )
    );
  };

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity > (selectedInfoProduct?.cantidad || 0)) {
      toast.error("No dispone de la cantidad suficiente");
      return;
    }
    updateQuantity(selectedProduct, quantity * -1);
    if (selectedEmployee && selectedProduct && salePrice > 0 && quantity > 0) {
      const newSale: SaleItem = {
        id: Date.now(),
        productId: selectedProduct,
        productName:
          products.find((p) => p.id === selectedProduct)?.producto || "",
        quantity: quantity,
        price: salePrice,
        pricePurchase: selectedInfoProduct?.precioCompra || 0,
        total: salePrice * quantity,
      };
      setCart((prev) => [...prev, newSale]);
      resetForm();
    }
  };

  const resetForm = () => {
    // setSelectedProduct(0);
    setSalePrice(0);
    setQuantity(1);
  };

  const handleRemoveFromCart = (id: number) => {
    const productRestored = cart.find((item) => item.id === id);
    updateQuantity(
      productRestored?.productId || 0,
      productRestored?.quantity || 0
    );
    setCart((prev) => prev.filter((item) => item.id !== id));
    if (cart.length === 1) {
      setSelectedEmployee(0);
      setSelectedProduct(0);
      setSelectedInfoProduct(undefined);
    }
  };

  const handleSubmitSales = async () => {
    try {
      await createVenta(parseCart(cart));
      setCart([]);
      setSelectedEmployee(0);
      setSelectedProduct(0);
      setSelectedInfoProduct(undefined);
    } catch (error) {
      console.error(error);
    }
  };

  const parseCart = (cart: SaleItem[]): Venta[] => {
    const ventas: Venta[] = [];
    cart.map((item) => {
      const venta: Venta = {
        productoId: item.productId,
        producto: item.productName,
        empleadoId: selectedEmployee,
        empleado:
          employees.find((emp) => emp.id === selectedEmployee)?.nombre ?? "",
        precio: item.pricePurchase,
        precioVenta: item.price,
        cantidad: item.quantity,
      };
      ventas.push(venta);
    });

    return ventas;
  };

  const totalSales = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="container overflow-y-auto max-h-screen p-4 bg-gray-100 min-h-screen">
      <Toaster />
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Registro de Ventas
      </h1>

      <form
        onSubmit={handleAddToCart}
        className="bg-white rounded-lg shadow-md p-6 mb-8"
      >
        <div className="mb-4">
          <label
            htmlFor="employee"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Empleado
          </label>
          <SearchableDropdown
            items={employees}
            selectedItem={selectedEmployee}
            setSelectedItem={setSelectedEmployee}
            placeholder="Seleccionar empleado"
            disabled={cart.length > 0}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="product"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Producto
            </label>
            <SearchableDropdown
              items={products}
              selectedItem={selectedProduct}
              setSelectedItem={setSelectedProduct}
              placeholder="Seleccionar producto"
              disabled={!selectedEmployee}
            />
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cantidad:{" "}
              <span
                className={`${
                  (selectedInfoProduct?.cantidad ?? 0) > 10
                    ? "text-green-500"
                    : (selectedInfoProduct?.cantidad ?? 0) > 5
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              >
                {selectedInfoProduct?.cantidad}
              </span>
            </label>
            <input
              type="number"
              id="quantity"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
              disabled={!selectedEmployee}
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Precio de Venta
            </label>
            <input
              type="number"
              id="price"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={salePrice}
              onChange={(e) => setSalePrice(Number(e.target.value))}
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              disabled={!selectedEmployee}
            >
              <PlusIcon className="h-5 w-5 inline-block mr-2" />
              Agregar al Carrito
            </button>
          </div>
        </div>
      </form>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Carrito de Ventas
        </h2>
        {selectedEmployee > 0 && (
          <div className="mb-4 p-3 bg-blue-100 rounded-md flex items-center">
            <UserIcon className="h-5 w-5 text-blue-500 mr-2" />
            <span className="font-medium">
              Empleado:{" "}
              {employees.find((e) => e.id === selectedEmployee)?.nombre}
            </span>
          </div>
        )}
        <div className="max-h-60 overflow-y-auto mb-4">
          {cart.length === 0 ? (
            <p className="text-gray-600">No hay ventas en el carrito.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {cart.map((item) => (
                <li
                  key={item.id}
                  className="py-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">
                      Cantidad: {item.quantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Precio: ${item.price.toFixed(2)}
                    </p>
                    <p className="text-sm font-medium text-gray-800">
                      Total: ${item.total.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-xl font-bold">Total: ${totalSales.toFixed(2)}</p>
          <button
            onClick={handleSubmitSales}
            disabled={cart.length === 0}
            className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            <ShoppingCartIcon className="h-5 w-5 inline-block mr-2" />
            Enviar Ventas
          </button>
        </div>
      </div>
    </div>
  );
}

export default Ventas;
