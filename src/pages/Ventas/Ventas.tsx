import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  PlusIcon,
  ChevronDownIcon,
  CheckIcon,
  ShoppingCartIcon,
  TrashIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { getEmployees } from "../../api/apiEmpleados";
import { getProducts } from "../../api/apiProductos";

interface Employee {
  id: number;
  nombre: string;
}

interface Product {
  id: number;
  producto: string;
  precio: number;
}

interface SaleItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

const initialProducts: Product[] = [
  { id: 1, producto: "Producto 1", precio: 10.99 },
  { id: 2, producto: "Producto 2", precio: 15.99 },
  { id: 3, producto: "Producto 3", precio: 20.99 },
  { id: 4, producto: "Producto 4", precio: 25.99 },
  { id: 5, producto: "Producto 5", precio: 30.99 },
];

interface SearchableDropdownProps {
  items: Array<{ id: number; nombre?: string; producto?: string }>;
  selectedItem: number;
  setSelectedItem: (id: number) => void;
  placeholder: string;
  disabled?: boolean;
}

export function SearchableDropdown({
  items,
  selectedItem,
  setSelectedItem,
  placeholder,
  disabled = false,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredItems = items.filter(
    (item) =>
      item.producto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center ${
          disabled ? "bg-gray-100" : ""
        }`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span>
          {selectedItem
            ? items.find((i) => i.id === selectedItem)?.producto ||
              items.find((i) => i.id === selectedItem)?.nombre
            : placeholder}
        </span>
        <ChevronDownIcon
          className={`h-5 w-5 ${disabled ? "text-gray-400" : "text-gray-600"}`}
        />
      </div>
      {isOpen && !disabled && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          <input
            type="text"
            className="w-full px-3 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <ul className="max-h-60 overflow-y-auto">
            {filteredItems.map((item) => (
              <li
                key={item.id}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 flex justify-between items-center ${
                  selectedItem === item.id ? "bg-blue-100" : ""
                }`}
                onClick={() => {
                  setSelectedItem(item.id);
                  setIsOpen(false);
                }}
              >
                {item.nombre || item.producto}
                {selectedItem === item.id && (
                  <CheckIcon className="h-5 w-5 text-blue-500" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Ventas() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedEmployee, setSelectedEmployee] = useState<number>(0);
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
      setProducts(await getProducts());
    };
    fetchProductos();
  }, []);

  useEffect(() => {
    const product = products.find((p) => p.id === selectedProduct);
    if (product) {
      setSalePrice(product.precio);
    }
  }, [selectedProduct, products]);

  const handleAddToCart = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedEmployee && selectedProduct && salePrice > 0 && quantity > 0) {
      const newSale: SaleItem = {
        id: Date.now(),
        productId: selectedProduct,
        productName:
          products.find((p) => p.id === selectedProduct)?.producto || "",
        quantity: quantity,
        price: salePrice,
        total: salePrice * quantity,
      };
      setCart((prev) => [...prev, newSale]);
      setSelectedProduct(0);
      setSalePrice(0);
      setQuantity(1);
    }
  };

  const handleRemoveFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    if (cart.length === 1) {
      setSelectedEmployee(0);
    }
  };

  const handleSubmitSales = () => {
    console.log("Submitting sales:", {
      employee: employees.find((e) => e.id === selectedEmployee),
      sales: cart,
    });
    setCart([]);
    setSelectedEmployee(0);
  };

  const totalSales = cart.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="container overflow-y-auto max-h-screen p-4 bg-gray-100 min-h-screen">
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
            />
          </div>
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Cantidad
            </label>
            <input
              type="number"
              id="quantity"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              min="1"
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
