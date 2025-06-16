import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from '../pages/Login';
import Home from '../components/home/Home';
import UserCrud from '../components/user/UserCrud';

import Logo from '../components/template/Logo';
import Nav from '../components/template/Nav';
import Footer from '../components/template/Footer';

// Layout das páginas internas
const Layout = ({ children }) => (
  <div className="app">
    <Logo />
    <Nav />
    {/* Aqui você pode colocar seu header/nav/footer */}
    <main>{children}</main>
    <Footer />
  </div>
);

// Proteção de rota
const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Definição das rotas
const AppRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
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
            <Layout>
              <Home />
            </Layout>
          </PrivateRoute>
        } 
      />

      <Route 
        path="/users" 
        element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Layout>
              <UserCrud />
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
