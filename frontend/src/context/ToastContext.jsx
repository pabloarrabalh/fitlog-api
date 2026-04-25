import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  // 1. Declaramos removeToast primero para que addToast la conozca
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // 2. Ahora addToast puede usar removeToast
  const addToast = useCallback((message, type = 'info', duration = 3000) => {
    // Use timestamp + random to guarantee unique IDs
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      // Usamos el id generado para programar el borrado
      setTimeout(() => removeToast(id), duration);
    }

    return id;
  }, [removeToast]); // Añadida removeToast como dependencia

  // 3. Helpers para tipos específicos
  const success = useCallback((message) => addToast(message, 'success'), [addToast]);
  const error = useCallback((message) => addToast(message, 'error', 4000), [addToast]);
  const info = useCallback((message) => addToast(message, 'info'), [addToast]);
  const warning = useCallback((message) => addToast(message, 'warning'), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning, toasts }}>
      {children}
    </ToastContext.Provider>
  );
};