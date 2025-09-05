import { toast } from "react-toastify";

// Common style templates
const baseStyle = {
  padding: "16px",
  margin: "8px 0",
  borderRadius: "8px",
  boxShadow: "none",
  minHeight: "auto",
};

export const successToast = (message) => {
  toast.success(message, {
    style: {
      ...baseStyle,
      backgroundColor: "#F0FDF4",
      color: "#166534",
    },
  });
};
  const MULTI_ERROR_TOAST_ID = "multi-error-toast";
export const errorToast = (message) => {
  toast.error(message, {
    toastId: MULTI_ERROR_TOAST_ID,
    style: {
      ...baseStyle,
      backgroundColor: "#FEF2F2",
      color: "#991B1B",
    },
  });
};
// For array of messages (like from validation errors)
export const multiErrorToast = (messages = []) => {
  messages.forEach((msg) => {
    errorToast(msg);
  });
};
