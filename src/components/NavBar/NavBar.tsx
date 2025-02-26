import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  DollarSign,
  Warehouse,
  Users,
  LogOut,
  FileText,
  Settings,
} from "lucide-react";

type Props = {};

const navItems = [
  { name: "Asignación", icon: ClipboardList, href: "/asignacion" },
  { name: "Ventas", icon: DollarSign, href: "/ventas" },
  { name: "Inventario", icon: Warehouse, href: "/inventario" },
  { name: "Empleados", icon: Users, href: "/empleados" },
  { name: "Reportes", icon: FileText, href: "/reportes" },
  { name: "Configuracion", icon: Settings, href: "/settings" },
];

function NavBar({}: Props) {
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  return (
    <nav
      className={`bg-gray-900 text-white h-screen transition-all duration-300 ease-in-out ${
        isExpanded ? "w-64" : "w-20"
      } flex flex-col`}
    >
      <div
        className="flex items-center justify-between p-4 border-b border-gray-700"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h1
          className={`font-bold text-xl transition-opacity duration-300 ${
            isExpanded ? "opacity-100" : "opacity-0 w-0"
          }`}
        >
          Mi Agencia
        </h1>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
        >
          {isExpanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
      </div>
      <ul className="flex-grow">
        {navItems.map((item) => (
          <li key={item.name}>
            <Link
              to={item.href}
              className="flex items-center p-4 hover:bg-gray-800 transition-colors duration-200"
            >
              <item.icon size={24} />
              <span
                className={`ml-4 transition-opacity duration-300 ${
                  isExpanded ? "opacity-100" : "opacity-0 w-0"
                }`}
              >
                {item.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <button
        className="flex items-center p-4 hover:bg-gray-800 transition-colors duration-200"
        onClick={() => navigate("/login")}
      >
        <LogOut size={24} />
        <span
          className={`ml-4 transition-opacity duration-300 ${
            isExpanded ? "opacity-100" : "opacity-0 w-0"
          }`}
        >
          Cerrar Sesión
        </span>
      </button>
    </nav>
  );
}

export default NavBar;
