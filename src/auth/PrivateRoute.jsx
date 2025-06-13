// src/auth/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';


const PrivateRoute = ({ children }) => {
    const { authenticated } = useContext(AuthContext);

//direciona o usuário não logado para tela de login 
    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

//Se o usuário estiver autenticado, mostra a página protegida
    return children;
};
//Exporta o componente para ser usado em qualquer parte do app
export default PrivateRoute;
