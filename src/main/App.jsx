// Importação dos estilos CSS do Bootstrap, Font Awesome e do seu CSS personalizado
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'font-awesome/css/font-awesome.min.css';
import './App.css'; // Verifique se esse arquivo existe e o caminho está correto

import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';

// Importação dos componentes do layout e páginas
import AppRoutes from './Routes'; // ou o caminho correto para o seu Route.jsx


// Componente principal da aplicação que controla as rotas e autenticação
const App = () => {
  // Estado que armazena se o usuário está autenticado ou não
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // useEffect que verifica se o usuário está autenticado no localStorage quando o app carrega
  useEffect(() => {
    const checkAuth = () => {
     setIsAuthenticated(false); // Força mostrar o login sempre
    };
    checkAuth(); // Verifica na primeira renderização

    // Escuta mudanças no localStorage para atualizar autenticação em tempo real (ex: logout em outra aba)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    // BrowserRouter envolve todas as rotas
    <BrowserRouter>
      <AppRoutes 
          isAuthenticated={isAuthenticated} 
          setIsAuthenticated={setIsAuthenticated} 
        />
    </BrowserRouter>
  );
};


export default App;
