import type React from "react";
import { useState, useEffect } from "react";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/solid";
import { getEmployees } from "../../api/apiEmpleados";
import { getProducts } from "../../api/apiProductos";
import { SearchableDropdown } from "../Ventas/Ventas";
import {
  createAssignment,
  deleteAssignment,
  getAssignments,
} from "../../api/apiInventario";

export interface Product {
  id: number;
  producto: string;
  cantidad: number;
}

interface Employee {
  id: number;
  nombre: string;
}

export interface Assignment {
  id?: number;
  empleadoId?: number;
  empleado: string;
  producto: string;
  productoId?: number;
  cantidad: number;
  createdAt: Date;
}

function Asignacion() {
  const [products, setProducts] = useState<Product[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );
  const [selectedInfoProduct, setSelectedInfoProduct] = useState<Product>();
  const [selectedInfoEmployee, setSelectedInfoEmployee] = useState<Employee>();
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [selectedEmployee, setSelectedEmployee] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

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
    if (selectedProduct && products) {
      setSelectedInfoProduct(
        products.find((producto) => selectedProduct === producto.id)
      );
    }
  }, [selectedProduct, products]);
  useEffect(() => {
    if (selectedEmployee && employees) {
      setSelectedInfoEmployee(
        employees.find((employee) => selectedEmployee === employee.id)
      );
    }
  }, [selectedProduct]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const assignments = await getAssignments();
        setAssignments(assignments);
      } catch (error) {
        console.error(error);
      }
    };
    fetchAssignments();
  }, []);

  const handleDelete = async (assignment: Assignment) => {
    try {
      await deleteAssignment(assignment.id ?? 0);
      setAssignments(assignments.filter((asig) => asig.id !== assignment.id));
      setProducts((prev) =>
        prev.map((producto) =>
          producto.id === assignment.productoId
            ? { ...producto, cantidad: producto.cantidad + assignment.cantidad }
            : producto
        )
      );
      //  await deleteEmployee(id);
    } catch (error) {
      console.log(error);
    }
    setDeleteConfirmation(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedProduct && selectedEmployee && quantity > 0) {
      const newAssignment: Assignment = {
        empleadoId: selectedInfoEmployee?.id,
        empleado: selectedInfoEmployee?.nombre || "",
        producto: selectedInfoProduct?.producto || "",
        productoId: selectedInfoProduct?.id,
        cantidad: quantity,
        createdAt: new Date(),
      };
      const assignment = await createAssignment(newAssignment);
      setAssignments((prev) =>
        [{ ...newAssignment, id: assignment.id }, ...prev].slice(0, 10)
      );
      setProducts((prev) =>
        prev.map((producto) =>
          producto.id === selectedProduct
            ? { ...producto, cantidad: producto.cantidad + quantity * -1 }
            : producto
        )
      );
      resetForm();
    }
  };

  const resetForm = () => {
    setSelectedProduct(0);
    setSelectedInfoProduct(undefined);
    setQuantity(1);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen max-h-60 overflow-y-auto">
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
            Cantidad disponible:{" "}
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
            onClick={() => console.log(assignment.id)}
            className="bg-white rounded-lg shadow-md p-4 hover:bg-gray-200 hover:cursor-pointer hover:shadow-lg transition-shadow duration-300 relative"
          >
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {assignment.producto}
            </h3>
            <p className="text-gray-600">Cantidad: {assignment.cantidad}</p>
            <p className="text-gray-600">Empleado: {assignment.empleado}</p>
            <p className="text-gray-500 text-sm">
              Asignado el: {new Date(assignment.createdAt).toLocaleDateString()}
            </p>
            <button
              onClick={() => setDeleteConfirmation(assignment.id ?? 0)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>

            {deleteConfirmation === assignment.id && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                <div className="text-center">
                  <p className="mb-2">
                    ¿Estás seguro de eliminar esta asignacion?
                  </p>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleDelete(assignment)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Sí
                    </button>
                    <button
                      onClick={() => setDeleteConfirmation(null)}
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Asignacion;
