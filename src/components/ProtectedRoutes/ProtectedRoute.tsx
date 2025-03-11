import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { verifySubscription } from "../../api/apiBillings";

const isAuthenticated = () => {
  const hasSession = document.cookie.includes("session=");
  const hasLocalStorageLogin = localStorage.getItem("login");

  return hasSession || hasLocalStorageLogin;
};

const ProtectedRoute = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const isSubscribed = await verifySubscription();
        setHasSubscription(isSubscribed);
      } catch (error) {
        console.error("Error verificando suscripción:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated()) {
      checkSubscription();
    } else {
      setIsLoading(false);
    }
  }, []);

  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (isLoading) return <div>Cargando...</div>;
  if (!hasSubscription) return <Navigate to="/subscription" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
