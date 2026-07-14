"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3500,
        style: {
          borderRadius: "10px",
          padding: "12px 16px",
          fontSize: "13px",
          fontWeight: "500",
          fontFamily: "inherit",
          background: "#18181B",
          color: "#FAFAFA",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        },
        success: {
          iconTheme: { primary: "#059669", secondary: "#FFFFFF" },
        },
        error: {
          iconTheme: { primary: "#DC2626", secondary: "#FFFFFF" },
        },
      }}
    />
  );
}
