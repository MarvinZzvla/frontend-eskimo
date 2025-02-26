import {
  ChartBarIcon,
  UserGroupIcon,
  CubeIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";

type Props = {
  title: string;
  icon: any;
  link: string;
};

const ReportCard = ({ title, icon: Icon, link }: Props) => (
  <Link to={link}>
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center cursor-pointer">
      <Icon className="h-12 w-12 text-blue-500 mb-4" />
      <h2 className="text-xl font-semibold text-center">{title}</h2>
    </div>
  </Link>
);

function Reportes() {
  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Reportes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ReportCard
          title="Reporte de Ventas"
          icon={ChartBarIcon}
          link="/reportes/sales"
        />
        <ReportCard
          title="Reporte de Ventas por Empleado"
          icon={UserGroupIcon}
          link="/reportes/employee-sales"
        />
        <ReportCard
          title="Reporte de Producto Más Vendido"
          icon={CubeIcon}
          link="/reportes/products"
        />
      </div>
    </div>
  );
}

export default Reportes;
