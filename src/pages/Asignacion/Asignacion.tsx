import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
  PlusIcon,
  ChevronDownIcon,
  CheckIcon,
} from "@heroicons/react/24/solid";

interface Product {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  name: string;
}

interface Assignment {
  id: number;
  employeeName: string;
  productName: string;
  quantity: number;
  assignedAt: Date;
}

const initialProducts: Product[] = [
  { id: 1, name: "Producto 1" },
  { id: 2, name: "Producto 2" },
  { id: 3, name: "Producto 3" },
  { id: 4, name: "Producto 4" },
  { id: 5, name: "Producto 5" },
  { id: 6, name: "Producto 6" },
  { id: 7, name: "Producto 7" },
  { id: 8, name: "Producto 8" },
  { id: 9, name: "Producto 9" },
  { id: 10, name: "Producto 10" },
];

const initialEmployees: Employee[] = [
  { id: 1, name: "Juan Pérez" },
  { id: 2, name: "María García" },
  { id: 3, name: "Carlos Rodríguez" },
  { id: 4, name: "Ana Martínez" },
  { id: 5, name: "Luis Fernández" },
  { id: 6, name: "Laura González" },
  { id: 7, name: "Pedro Sánchez" },
  { id: 8, name: "Sofia Ruiz" },
  { id: 9, name: "Diego López" },
  { id: 10, name: "Elena Torres" },
];

interface SearchableDropdownProps {
  items: Array<{ id: number; name: string }>;
  selectedItem: number;
  setSelectedItem: (id: number) => void;
  placeholder: string;
}

function SearchableDropdown({
  items,
  selectedItem,
  setSelectedItem,
  placeholder,
}: SearchableDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: any) {
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
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>
          {selectedItem
            ? items.find((i) => i.id === selectedItem)?.name
            : placeholder}
        </span>
        <ChevronDownIcon className="h-5 w-5 text-gray-400" />
      </div>
      {isOpen && (
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
                {item.name}
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

function Asignacion() {
  const [products] = useState<Product[]>(initialProducts);
  const [employees] = useState<Employee[]>(initialEmployees);
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [selectedEmployee, setSelectedEmployee] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    // In a real application, you would fetch the initial assignments from an API
    const initialAssignments: Assignment[] = [
      {
        id: 1,
        employeeName: "Juan Pérez",
        productName: "Producto 1",
        quantity: 5,
        assignedAt: new Date(2023, 5, 1),
      },
      {
        id: 2,
        employeeName: "María García",
        productName: "Producto 2",
        quantity: 3,
        assignedAt: new Date(2023, 5, 2),
      },
      {
        id: 3,
        employeeName: "Carlos Rodríguez",
        productName: "Producto 3",
        quantity: 2,
        assignedAt: new Date(2023, 5, 3),
      },
    ];
    setAssignments(initialAssignments);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && selectedEmployee && quantity > 0) {
      const newAssignment: Assignment = {
        id: Date.now(),
        employeeName:
          employees.find((e) => e.id === selectedEmployee)?.name || "",
        productName: products.find((p) => p.id === selectedProduct)?.name || "",
        quantity,
        assignedAt: new Date(),
      };
      setAssignments((prev) => [newAssignment, ...prev].slice(0, 10));
      setSelectedProduct(0);
      setSelectedEmployee(0);
      setQuantity(1);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Asignar Productos a Empleado
      </h1>

      <form
        onSubmit={handleSubmit}
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
          />
        </div>
        <div className="mb-4">
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
        <div className="mb-4">
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
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <PlusIcon className="h-5 w-5 inline-block mr-2" />
          Asignar Producto
        </button>
      </form>

      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        Últimas 10 Asignaciones
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {assignments.map((assignment) => (
          <div
            key={assignment.id}
            className="bg-white rounded-lg shadow-md p-4"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {assignment.productName}
            </h3>
            <p className="text-gray-600">Cantidad: {assignment.quantity}</p>
            <p className="text-gray-600">Empleado: {assignment.employeeName}</p>
            <p className="text-gray-500 text-sm">
              Asignado el: {assignment.assignedAt.toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Asignacion;
