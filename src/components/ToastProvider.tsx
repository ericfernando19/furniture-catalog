"use client";

import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 4000,
        style: {
          borderRadius: "16px",
          padding: "14px 20px",
          fontSize: "14px",
          fontWeight: "500",
          background: "#3E2723",
          color: "#FFFFFF",
          boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
        },
        success: {
          iconTheme: { primary: "#8B6914", secondary: "#FFFFFF" },
        },
        error: {
          iconTheme: { primary: "#EF4444", secondary: "#FFFFFF" },
        },
      }}
    />
  );
}
