import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { BrandProvider } from "./context/BrandContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BrandProvider>
          <App />
          <Toaster position="top-right" toastOptions={{ duration: 3500 }} />
        </BrandProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
