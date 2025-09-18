import { useState, useEffect } from "react";
import { CheckCircle, XCircle, AlertCircle, Info, X } from "lucide-react";

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, title, message, duration = 5000) => {
    const id = Date.now();
    const notification = { id, type, title, message };

    setNotifications((prev) => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  // Función global para agregar notificaciones
  useEffect(() => {
    window.addNotification = addNotification;
    return () => {
      delete window.addNotification;
    };
  }, []);

  return (
    <>
      {children}
      <NotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    </>
  );
};

const NotificationContainer = ({ notifications, onRemove }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          notification={notification}
          onRemove={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

const Notification = ({ notification, onRemove }) => {
  const { type, title, message } = notification;

  const getNotificationStyle = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: CheckCircle,
          iconColor: "text-green-500",
        };
      case "error":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: XCircle,
          iconColor: "text-red-500",
        };
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: AlertCircle,
          iconColor: "text-yellow-500",
        };
      case "info":
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: Info,
          iconColor: "text-blue-500",
        };
    }
  };

  const style = getNotificationStyle();
  const Icon = style.icon;

  return (
    <div
      className={`${style.bg} ${style.border} border rounded-lg p-4 shadow-lg transition-all duration-300 ease-in-out transform translate-x-0`}
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-800">{title}</h3>
          {message && <p className="text-sm text-gray-600 mt-1">{message}</p>}
        </div>
        <button
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Función de utilidad para agregar notificaciones desde cualquier lugar
export const showNotification = (type, title, message, duration) => {
  if (window.addNotification) {
    window.addNotification(type, title, message, duration);
  }
};

export default NotificationProvider;
