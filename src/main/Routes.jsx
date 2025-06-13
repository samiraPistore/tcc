import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from '../pages/Login';
import Home from '../components/home/Home';
import UserCrud from '../components/user/UserCrud';

// Componente para proteger rotas privadas
function PrivateRoute({ children }) {
  const isAuthenticated = localStorage.getItem("auth") === "true";
  return isAuthenticated ? children : <Navigate to="/" replace />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rota pública */}
      <Route path="/" element={<Login />} />

      {/* Rotas privadas */}
      <Route 
        path="/home" 
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/users" 
        element={
          <PrivateRoute>
            <UserCrud />
          </PrivateRoute>
        } 
      />

      {/* Redireciona qualquer rota inválida para login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
