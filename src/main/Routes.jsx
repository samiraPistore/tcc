import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import Home from '../components/home/Home';
import AgendaManu from '../pages/AgendaManu';
import AlertasNoti from '../pages/AlertasNoti';
import Config from '../pages/Config';
import ControleEq from '../pages/ControleEq';
import GestaoUsers from '../pages/GestaoUsers';
import HistoricoMa from '../pages/HistoricoMa';
import RelatorioAn from '../pages/RelatorioAn';


import Logo from '../components/template/Logo';
import Nav from '../components/template/Nav';
import Footer from '../components/template/Footer';

// Layout das páginas internas
const Layout = ({ children, handleLogout }) => (
  <div className="app">
    <Logo />
    <Nav handleLogout={handleLogout} />
    <main>{children}</main>
    <Footer />
  </div>
);

// Proteção de rota
const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Definição das rotas
const AppRoutes = ({ isAuthenticated, setIsAuthenticated, handleLogout }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />
        }
      />

      <Route
        path="/home"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout handleLogout={handleLogout}>
              <Home />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/agenda-manutencao"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout handleLogout={handleLogout}>
              <AgendaManu />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/alertas"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout handleLogout={handleLogout}>
              <AlertasNoti />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/configuracoes"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout handleLogout={handleLogout}>
              <Config />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/equipamentos"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout handleLogout={handleLogout}>
              <ControleEq />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/gestao-usuarios"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout handleLogout={handleLogout}>
              <GestaoUsers />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/historico"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout handleLogout={handleLogout}>
              <HistoricoMa />
            </Layout>
          </PrivateRoute>
        }
      />

      <Route
        path="/relatorios"
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout handleLogout={handleLogout}>
              <RelatorioAn />
            </Layout>
          </PrivateRoute>
        }
      />

     
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />}
      />
    </Routes>
  );
};

export default AppRoutes;
