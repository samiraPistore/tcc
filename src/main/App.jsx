import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; 
import './App.css'; 

import React, { useState, useEffect } from 'react'; // React e hooks useState/useEffect
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Rotas React Router v6

// Importa componentes da aplicação
import Logo from '../components/template/Logo';
import Nav from '../components/template/Nav';
import Footer from '../components/template/Footer';
import Login from '../pages/Login';
import Home from '../components/home/Home';
import UserCrud from '../components/user/UserCrud';

// Componente Layout: estrutura visual comum (logo, nav, footer)
const Layout = ({ children }) => (
  <div className="app">
    <Logo />
    <Nav />
    <main>{children}</main> {/* Conteúdo dinâmico da página */}
    <Footer />
  </div>
);

// Componente PrivateRoute: protege rotas que só usuários autenticados podem acessar
const PrivateRoute = ({ isAuthenticated, children }) => {
  return isAuthenticated ? children : <Navigate to="/" replace />; 
  // Se autenticado, renderiza o conteúdo. Senão, redireciona para login "/"
};

const App = () => {
  // Estado para controlar se o usuário está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Função que verifica no localStorage se o usuário está autenticado
    const checkAuth = () => {
      setIsAuthenticated(localStorage.getItem("auth") === "true");
    };

    checkAuth(); // Verifica no carregamento do componente

    // Evento para atualizar autenticação se o localStorage mudar (ex: logout em outra aba)
    window.addEventListener("storage", checkAuth);

    // Limpa o event listener quando o componente desmontar
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública de login */}
        <Route 
          path="/" 
          element={
            isAuthenticated 
              ? <Navigate to="/home" replace /> // Se já autenticado, vai direto pra home
              : <Login /> // Senão mostra a tela de login
          } 
        />

        {/* Rota privada para home */}
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

        {/* Rota privada para CRUD de usuários */}
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

        {/* Rota catch-all para redirecionar qualquer caminho inválido */}
        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />} 
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
