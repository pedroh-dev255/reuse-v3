"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AlertType = "success" | "warning" | "error";

interface Alert {
  id: number;
  type: AlertType;
  message: string;
}

interface AlertContextProps {
  showAlert: (message: string, type?: AlertType, duration?: number) => void;
}

const AlertContext = createContext<AlertContextProps | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) throw new Error("useAlert must be used within AlertProvider");
  return context;
};

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const showAlert = (message: string, type: AlertType = "success", duration = 3000) => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setAlerts((prev) => prev.filter((a) => a.id !== id));
    }, duration);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      {/* Container dos alerts */}
      <div className="fixed top-5 right-5 space-y-3 z-50">
        <AnimatePresence>
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded shadow-lg text-white ${
                alert.type === "success"
                  ? "bg-green-500"
                  : alert.type === "warning"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
            >
              {alert.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </AlertContext.Provider>
  );
}
