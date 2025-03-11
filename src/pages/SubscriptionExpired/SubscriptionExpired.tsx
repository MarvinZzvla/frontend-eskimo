import type React from "react";

import { useState } from "react";
import { KeyIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import toast, { Toaster } from "react-hot-toast";
import { renewSubscription } from "../../api/apiBillings";
import { useNavigate } from "react-router-dom";

export default function SubscriptionExpired() {
  const [activationCode, setActivationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!activationCode.trim()) {
      toast.error("Por favor ingresa un código de activación");
      return;
    }

    setIsLoading(true);

    try {
      await renewSubscription(activationCode);
      toast.success("¡Tu suscripción ha sido renovada correctamente!");
      navigate("/");
      // Aquí podrías redirigir al usuario a la página principal
    } catch (error) {
      toast.error("Ha ocurrido un problema al procesar tu solicitud");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 space-y-1">
          <h2 className="text-2xl font-bold text-center">
            Suscripción Expirada
          </h2>
          <p className="text-gray-500 text-center">
            Tu período ha finalizado. Por favor ingresa un nuevo código de
            activación para continuar utilizando el sistema.
          </p>
        </div>
        <div className="px-6 pb-4">
          <div className="flex items-center justify-center mb-6">
            <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center">
              <KeyIcon className="h-12 w-12 text-red-500" />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="activationCode" className="text-sm font-medium">
                  Código de Activación
                </label>
                <input
                  id="activationCode"
                  type="text"
                  placeholder="Ingresa tu código de activación"
                  value={activationCode}
                  onChange={(e) => setActivationCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Si no tienes un código, por favor contacta a soporte técnico.
                </p>
              </div>
            </div>
          </form>
        </div>
        <div className="px-6 pb-6">
          <button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Procesando...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                Activar Suscripción
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </span>
            )}
          </button>
        </div>
        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-gray-500">
            Para obtener un nuevo código, contacta a nuestro equipo de soporte
            al <span className="font-medium">zavaladev0405@gmail.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}
