import { useState } from "react";

const Alert = ({ type = "info", message, description, closable = false }) => {
  const [visible, setVisible] = useState(true);

  const getTypeClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-500";
      case "error":
        return "bg-red-100 text-red-800 border-red-500";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-500";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-500";
      default:
        return "bg-blue-100 text-blue-800 border-blue-500";
    }
  };

  const closeAlert = () => {
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className={`border-l-4 p-4 mb-4 ${getTypeClasses()} rounded flex items-start`}
    >
      <div className="flex-1">
        <p className="font-semibold">{message}</p>
        {description && <p>{description}</p>}
      </div>
      {closable && (
        <button
          onClick={closeAlert}
          className="ml-4 text-xl font-bold text-gray-600 hover:text-gray-800"
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
