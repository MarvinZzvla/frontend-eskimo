import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home/Home";
import NavBar from "./components/NavBar/NavBar";
import Productos from "./pages/Productos/Productos";
import Asignacion from "./pages/Asignacion/Asignacion";
import Ventas from "./pages/Ventas/Ventas";
import Inventario from "./pages/Inventario/Inventario";
import Empleados from "./pages/Empleados/Empleados";
import Reportes from "./pages/Reportes/Reportes";
import InventarioEmpleado from "./pages/Inventario/components/InventarioEmpleado/InventarioEmpleado";
import ReportesVentas from "./pages/Reportes/pages/ReportesVentas/ReportesVentas";
import ReportesVentasEmpleado from "./pages/Reportes/pages/ReportesVentasEmpleado/ReportesVentasEmpleado";
import ReportesProducto from "./pages/Reportes/pages/ReportesProducto/ReportesProducto";
import Login from "./pages/Login/Login";
import Settings from "./pages/Settings/Settings";
import Users from "./pages/Settings/pages/Users/Users";
import Negocio from "./pages/Settings/pages/Negocio/Negocio";
import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute";
import InventarioNegocio from "./pages/Inventario/components/InventarioNegocio";
function App() {
  const location = useLocation();
  const hideNavBarRoutes = ["/login"];
  return (
    <div className="flex">
      {!hideNavBarRoutes.includes(location.pathname) && <NavBar />}
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/asignacion" element={<Asignacion />} />
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/inventario/negocio" element={<InventarioNegocio />} />
            <Route
              path="/inventario/empleado"
              element={<InventarioEmpleado />}
            />
            <Route path="/inventario" element={<Inventario />} />
            <Route path="/empleados" element={<Empleados />} />
            <Route path="/reportes" element={<Reportes />} />
            <Route path="/reportes/sales" element={<ReportesVentas />} />
            <Route
              path="reportes/employee-sales"
              element={<ReportesVentasEmpleado />}
            />
            <Route path="/reportes/products" element={<ReportesProducto />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/negocio" element={<Negocio />} />
            <Route path="/settings/users" element={<Users />} />
          </Route>
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
