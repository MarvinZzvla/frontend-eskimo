"use client";

import type React from "react";
import { useEffect, useState } from "react";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  PhoneIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import {
  addEmployee,
  deleteEmployee,
  getEmployees,
  updateEmployee,
} from "../../api/apiEmpleados";

interface Employee {
  id: number;
  nombre: string;
  telefono: string;
}
function Empleados() {
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await getEmployees();
        setEmployees(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEmployees();
  }, []);

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [newEmployee, setNewEmployee] = useState({ nombre: "", telefono: "" });
  const [deleteConfirmation, setDeleteConfirmation] = useState<number | null>(
    null
  );

  const filteredEmployees = employees.filter((employee) =>
    employee.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (employee: Employee | null = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setNewEmployee({ nombre: employee.nombre, telefono: employee.telefono });
    } else {
      setEditingEmployee(null);
      setNewEmployee({ nombre: "", telefono: "" });
    }
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmployee.nombre && newEmployee.telefono) {
      //Si es editar empleado
      if (editingEmployee) {
        try {
          await updateEmployee({ ...newEmployee, id: editingEmployee.id });
          setEmployees(
            employees.map((emp) =>
              emp.id === editingEmployee.id ? { ...emp, ...newEmployee } : emp
            )
          );
        } catch (error) {
          console.log(error);
        }
        //Crear un nuevo empleado
      } else {
        setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
        try {
          await addEmployee({
            nombre: newEmployee.nombre,
            telefono: newEmployee.telefono,
          });
        } catch (error) {
          console.log(error);
        }
      }
      setNewEmployee({ nombre: "", telefono: "" });
      setIsFormOpen(false);
      setEditingEmployee(null);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      setEmployees(employees.filter((emp) => emp.id !== id));
      await deleteEmployee(id);
    } catch (error) {
      console.log(error);
    }
    setDeleteConfirmation(null);
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen relative">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Gestión de Empleados
      </h1>

      <div className="mb-4 relative">
        <input
          type="text"
          placeholder="Buscar empleado..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 relative"
          >
            <div
              onClick={() => handleOpenForm(employee)}
              className="cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2">{employee.nombre}</h2>
              <div className="flex items-center text-gray-600">
                <PhoneIcon className="h-5 w-5 mr-2" />
                <span>{employee.telefono}</span>
              </div>
            </div>
            <button
              onClick={() => setDeleteConfirmation(employee.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
            {deleteConfirmation === employee.id && (
              <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                <div className="text-center">
                  <p className="mb-2">
                    ¿Estás seguro de eliminar este empleado?
                  </p>
                  <div className="flex justify-center space-x-2">
                    <button
                      onClick={() => handleDelete(employee.id)}
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

      <button
        className="fixed bottom-8 right-8 bg-blue-500 text-white rounded-full p-4 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        onClick={() => handleOpenForm()}
      >
        <PlusIcon className="h-6 w-6" />
      </button>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black opacity-90 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingEmployee ? "Editar Empleado" : "Agregar Empleado"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newEmployee.nombre}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, nombre: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newEmployee.telefono}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, telefono: e.target.value })
                  }
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                {editingEmployee ? "Guardar Cambios" : "Agregar Empleado"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Empleados;
