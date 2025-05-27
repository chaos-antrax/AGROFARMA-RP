import React from "react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./layout/Layout";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <div>
      <BrowserRouter>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
