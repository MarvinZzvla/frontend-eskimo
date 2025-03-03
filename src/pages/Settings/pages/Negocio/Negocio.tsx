import type React from "react";
import { useState } from "react";
import {
  BuildingOfficeIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

interface BusinessConfig {
  name: string;
  address: string;
  phone: string;
  openingTime: string;
  closingTime: string;
}

// This would typically come from an API or database
const initialConfig: BusinessConfig = {
  name: "Mi Negocio",
  address: "Calle Principal 123, Ciudad",
  phone: "123-456-7890",
  openingTime: "09:00",
  closingTime: "18:00",
};

function Negocio() {
  const [config, setConfig] = useState<BusinessConfig>(initialConfig);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setConfig((prevConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the updated config to your backend
    console.log("Saving business configuration:", config);
    // You might want to show a success message to the user here
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Configuración del Negocio
          </h1>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre del Negocio *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <BuildingOfficeIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={config.name}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Dirección del Negocio
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPinIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={config.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Número de Teléfono
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <PhoneIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={config.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <div className="flex-1">
                  <label
                    htmlFor="openingTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Horario de Apertura
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="time"
                      name="openingTime"
                      id="openingTime"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={config.openingTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label
                    htmlFor="closingTime"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Horario de Cierre
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ClockIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type="time"
                      name="closingTime"
                      id="closingTime"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      value={config.closingTime}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Guardar Configuración
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Negocio;
