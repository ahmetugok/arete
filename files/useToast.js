// src/hooks/useToast.js
import { useState, useCallback } from 'react';

let idCounter = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = ++idCounter;
    setToasts(prev => [...prev, { id, message, type, duration }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, duration + 400); // +400 for exit animation
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error:   (msg, duration) => addToast(msg, 'error',   duration),
    info:    (msg, duration) => addToast(msg, 'info',    duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
  };

  return { toasts, toast, removeToast };
};
