import { useEffect, useState } from "react";
import { CalendarIcon } from "@heroicons/react/24/solid";
import { getProductosMasVentas } from "../../../../api/apiVentas";

interface ProductSales {
  id: number;
  name: string;
  quantitySold: number;
}

const initialProductSales: ProductSales[] = [
  { id: 1, name: "Laptop", quantitySold: 50 },
  { id: 2, name: "Mouse", quantitySold: 100 },
  { id: 3, name: "Monitor", quantitySold: 30 },
  { id: 4, name: "Keyboard", quantitySold: 75 },
  { id: 5, name: "Headphones", quantitySold: 60 },
  // Add more sample data as needed
];

function ReportesProducto() {
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [productSales, setProductSales] =
    useState<ProductSales[]>(initialProductSales);

  useEffect(() => {
    const fetchVentas = async () => {
      setProductSales(await getProductosMasVentas(startDate, endDate));
    };
    fetchVentas();
  }, [startDate, endDate]);

  const sortedProductSales = [...productSales].sort(
    (a, b) => b.quantitySold - a.quantitySold
  );
  const totalQuantitySold = sortedProductSales.reduce(
    (sum, product) => sum + product.quantitySold,
    0
  );

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Reporte de Productos Más Vendidos
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
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

        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ranking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad Vendida
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedProductSales.map((product, index) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {product.quantitySold}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-2">Resumen de Ventas</h2>
        <p className="text-2xl font-bold text-green-600">
          Total Unidades Vendidas: {totalQuantitySold}
        </p>
      </div>
    </div>
  );
}

export default ReportesProducto;
