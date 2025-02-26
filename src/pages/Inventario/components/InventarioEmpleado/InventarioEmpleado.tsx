import { useState } from "react";
import {
  UserIcon,
  PhoneIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";

interface Employee {
  id: number;
  name: string;
  phone: string;
  email: string;
  department: string;
}

interface InventoryItem {
  id: number;
  productName: string;
  quantity: number;
}

interface Sale {
  id: number;
  productName: string;
  quantity: number;
  totalAmount: number;
  saleDate: string;
}

const employees: Employee[] = [
  {
    id: 1,
    name: "Juan Pérez",
    phone: "123-456-7890",
    email: "juan@example.com",
    department: "Ventas",
  },
  {
    id: 2,
    name: "María García",
    phone: "098-765-4321",
    email: "maria@example.com",
    department: "Marketing",
  },
  {
    id: 3,
    name: "Carlos Rodríguez",
    phone: "555-123-4567",
    email: "carlos@example.com",
    department: "Ventas",
  },
];

const inventoryItems: InventoryItem[] = [
  { id: 1, productName: "Laptop Dell XPS", quantity: 15 },
  { id: 2, productName: 'Monitor LG 27"', quantity: 8 },
  { id: 3, productName: "Teclado Mecánico", quantity: 20 },
  { id: 4, productName: "Mouse Inalámbrico", quantity: 12 },
  { id: 5, productName: "Auriculares Bluetooth", quantity: 6 },
  { id: 6, productName: "Cámara Web HD", quantity: 4 },
  { id: 7, productName: "Disco Duro Externo", quantity: 10 },
  { id: 8, productName: "Impresora Multifuncional", quantity: 3 },
];

const sales: Sale[] = [
  {
    id: 1,
    productName: "Laptop Dell XPS",
    quantity: 2,
    totalAmount: 2500,
    saleDate: "2023-05-17",
  },
  {
    id: 2,
    productName: 'Monitor LG 27"',
    quantity: 1,
    totalAmount: 300,
    saleDate: "2023-05-18",
  },
  {
    id: 3,
    productName: "Teclado Mecánico",
    quantity: 5,
    totalAmount: 500,
    saleDate: "2023-05-19",
  },
  {
    id: 4,
    productName: "Mouse Inalámbrico",
    quantity: 8,
    totalAmount: 320,
    saleDate: "2023-05-20",
  },
  {
    id: 5,
    productName: "Auriculares Bluetooth",
    quantity: 3,
    totalAmount: 450,
    saleDate: "2023-05-21",
  },
  {
    id: 6,
    productName: "Cámara Web HD",
    quantity: 4,
    totalAmount: 200,
    saleDate: "2023-05-22",
  },
  {
    id: 7,
    productName: "Disco Duro Externo",
    quantity: 2,
    totalAmount: 180,
    saleDate: "2023-05-23",
  },
  {
    id: 8,
    productName: "Impresora Multifuncional",
    quantity: 1,
    totalAmount: 350,
    saleDate: "2023-05-24",
  },
  {
    id: 9,
    productName: "Laptop Dell XPS",
    quantity: 1,
    totalAmount: 1250,
    saleDate: "2023-05-25",
  },
  {
    id: 10,
    productName: 'Monitor LG 27"',
    quantity: 2,
    totalAmount: 600,
    saleDate: "2023-05-26",
  },
];

function InventarioEmpleado() {
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null
  );
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleEmployeeSelect = (employeeId: number) => {
    const employee = employees.find((e) => e.id === employeeId);
    setSelectedEmployee(employee || null);
  };

  const filteredInventory = inventoryItems.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
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
              {employee.name}
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
                <span>{selectedEmployee.name}</span>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span>{selectedEmployee.phone}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span>{selectedEmployee.email}</span>
              </div>
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span>{selectedEmployee.department}</span>
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
                        {item.productName}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap font-medium ${getQuantityColor(
                          item.quantity
                        )}`}
                      >
                        {item.quantity}
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
                        {sale.productName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sale.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${sale.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {sale.saleDate}
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
