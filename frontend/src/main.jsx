import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthProvider";
import { WalletProvider } from "./context/WalletProvider";
import "./styles/index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <WalletProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </WalletProvider>
    </BrowserRouter>
  </StrictMode>
);