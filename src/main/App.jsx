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
  const [loading, setLoading] = useState(true); // novo estado loading


  const handleLogout = () => {
    localStorage.removeItem('authToken'); //apaga o token
    setIsAuthenticated(false); // Atualiza o estado para deslogar
  };

  // useEffect que verifica se o usuário está autenticado no localStorage quando o app carrega
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken'); // verifica se tem token salvo
        // Só autentica se token existir
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false); // só depois de verificar
  };
    checkAuth(); // Verifica na primeira renderização

    

    // Escuta mudanças no localStorage para atualizar autenticação em tempo real (ex: logout em outra aba)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  
  if (loading) {
    // Aqui pode ser um loader, spinner, ou apenas null
    return <div>Carregando...</div>;
  }

  return (
    // BrowserRouter envolve todas as rotas
    <BrowserRouter>
      <AppRoutes 
        isAuthenticated={isAuthenticated} 
        setIsAuthenticated={setIsAuthenticated} 
        handleLogout={handleLogout} // Passe a função aqui
        />
    </BrowserRouter>
  );
};


export default App;
