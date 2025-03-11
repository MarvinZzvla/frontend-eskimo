import { useEffect, useState } from "react";
import {
  UserIcon,
  PhoneIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { getEmployees } from "../../../../api/apiEmpleados";
import { getAssignmentsByEmpleado } from "../../../../api/apiInventario";
import { getVentasByEmpleado } from "../../../../api/apiVentas";

interface Employee {
  id: number;
  nombre: string;
  telefono: string;
}

interface InventoryItem {
  id: number;
  producto: string;
  cantidad: number;
}

interface Sale {
  id: number;
  producto: string;
  cantidad: number;
  totalAmount: number;
  saleDate: string;
}

function InventarioEmpleado() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);

  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleEmployeeSelect = (employeeId: number) => {
    const employee = employees.find((e) => e.id === employeeId);
    setSelectedEmployee(employee || null);
  };

  useEffect(() => {
    const fetchEmpleados = async () => {
      setEmployees(await getEmployees());
    };
    fetchEmpleados();
  }, []);
  useEffect(() => {
    const fetchInventario = async () => {
      if (selectedEmployee) {
        setInventoryItems(await getAssignmentsByEmpleado(selectedEmployee.id));
      }
    };
    fetchInventario();
  }, [selectedEmployee]);
  useEffect(() => {
    const fetchSales = async () => {
      if (selectedEmployee) {
        setSales(
          await getVentasByEmpleado(selectedEmployee.id, startDate, endDate)
        );
      }
    };
    fetchSales();
  }, [selectedEmployee, startDate, endDate]);

  const filteredInventory = inventoryItems.filter((item) =>
    item.producto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSales = sales.filter((sale) => {
    const saleDate = new Date(sale.saleDate);
    return saleDate >= new Date(startDate) && saleDate <= new Date(endDate);
  });

  const totalSales = filteredSales.reduce(
    (sum, sale) => sum + sale.totalAmount,
    0
  );

  const getQuantityColor = (quantity: number) => {
    if (quantity > 10) return "text-green-600";
    if (quantity > 5) return "text-orange-500";
    return "text-red-600";
  };

  return (
    <div className="container max-h-60 overflow-y-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Inventario y Ventas por Empleado
      </h1>

      <div className="mb-6">
        <label
          htmlFor="employee"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Seleccionar Empleado
        </label>
        <select
          id="employee"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => handleEmployeeSelect(Number(e.target.value))}
          value={selectedEmployee?.id || ""}
        >
          <option value="">Seleccionar empleado</option>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>
              {employee.nombre}
            </option>
          ))}
        </select>
      </div>

      {selectedEmployee && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              Información del Empleado
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span>{selectedEmployee.nombre}</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span>{selectedEmployee.telefono}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Inventario Asignado</h2>
            <div className="mb-4 relative">
              <input
                type="text"
                placeholder="Buscar producto..."
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="max-h-60 overflow-y-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad Disponible
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.producto}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap font-medium ${getQuantityColor(
                          item.cantidad
                        )}`}
                      >
                        {item.cantidad}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Resumen de Ventas</h2>
            <div className="flex space-x-4 mb-4">
              <div>
                <label
                  htmlFor="startDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fecha Inicio
                </label>
                <input
                  type="date"
                  id="startDate"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="endDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Fecha Fin
                </label>
                <input
                  type="date"
                  id="endDate"
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto mb-4">
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
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sale.producto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sale.cantidad}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${sale.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(sale.saleDate).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md">
              <span className="font-semibold">Total de Ventas:</span>
              <span className="text-xl font-bold text-green-600">
                ${totalSales.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default InventarioEmpleado;
