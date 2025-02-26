import { motion } from "framer-motion";
import {
  BuildingOffice2Icon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

type Props = {
  title: string;
  icon: any;
  onClick: () => void;
};
const SettingsOption = ({ title, icon: Icon, onClick }: Props) => {
  return (
    <motion.div
      onClick={onClick}
      className="bg-white rounded-lg shadow-lg p-8 cursor-pointer flex flex-col items-center justify-center text-center"
      whileHover={{
        scale: 1.05,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Icon className="h-24 w-24 text-blue-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    </motion.div>
  );
};

function Settings() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-12">
        Opciones de Configuración
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <SettingsOption
          title="Configuración del Negocio"
          icon={BuildingOffice2Icon}
          onClick={() => navigate("/settings/negocio")}
        />
        <SettingsOption
          title="Usuarios"
          icon={UserGroupIcon}
          onClick={() => navigate("/settings/users")}
        />
      </div>
    </div>
  );
}

export default Settings;
