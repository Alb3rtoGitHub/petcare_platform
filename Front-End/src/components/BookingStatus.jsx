import React from "react";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  Heart,
} from "lucide-react";

const BookingStatusBadge = ({ status, className = "" }) => {
  const getStatusConfig = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          border: "border-yellow-300",
          icon: Clock,
          label: "Pendiente",
        };
      case "ACCEPTED":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-300",
          icon: CheckCircle,
          label: "Aceptada",
        };
      case "COMPLETED":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          border: "border-green-300",
          icon: Heart,
          label: "Completada",
        };
      case "REJECTED":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-300",
          icon: XCircle,
          label: "Rechazada",
        };
      case "CANCELLED":
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-300",
          icon: AlertCircle,
          label: "Cancelada",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          border: "border-gray-300",
          icon: AlertCircle,
          label: "Desconocido",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
};

const BookingProgressSteps = ({ currentStatus, className = "" }) => {
  const steps = [
    { key: "PENDING", label: "Enviada", icon: Clock },
    { key: "ACCEPTED", label: "Aceptada", icon: CheckCircle },
    { key: "COMPLETED", label: "Completada", icon: Heart },
  ];

  const getStepIndex = (status) => {
    return steps.findIndex((step) => step.key === status?.toUpperCase());
  };

  const currentStepIndex = getStepIndex(currentStatus);
  const isRejected = currentStatus?.toUpperCase() === "REJECTED";
  const isCancelled = currentStatus?.toUpperCase() === "CANCELLED";

  if (isRejected || isCancelled) {
    return (
      <div className={`flex items-center justify-center p-3 ${className}`}>
        <BookingStatusBadge status={currentStatus} />
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-between ${className}`}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <React.Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                  isActive
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-gray-100 border-gray-300 text-gray-400"
                } ${isCurrent ? "ring-4 ring-blue-100" : ""}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span
                className={`text-xs mt-1 font-medium ${
                  isActive ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {step.label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 ${
                  index < currentStepIndex ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const BookingCard = ({ booking, children, className = "" }) => {
  const getCardBorderColor = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "border-l-yellow-400";
      case "ACCEPTED":
        return "border-l-blue-400";
      case "COMPLETED":
        return "border-l-green-400";
      case "REJECTED":
        return "border-l-red-400";
      case "CANCELLED":
        return "border-l-gray-400";
      default:
        return "border-l-gray-300";
    }
  };

  return (
    <div
      className={`bg-white border border-gray-200 rounded-lg p-4 border-l-4 ${getCardBorderColor(
        booking.status
      )} ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            {booking.petName} - {booking.serviceType}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3" />
            {booking.date} a las {booking.time}
          </p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <BookingProgressSteps currentStatus={booking.status} className="mb-4" />

      {children}
    </div>
  );
};

export { BookingStatusBadge, BookingProgressSteps, BookingCard };
export default BookingStatusBadge;
