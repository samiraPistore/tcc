// src/auth/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

//contexto de autenticação
export const AuthContext = createContext();

//Estado de login e indica se o usuário está logado ou não
export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);

//ele indica se você já tem login ou se precisa logar se tiver ele considera usuário logado
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) setAuthenticated(true);
    }, []);

//usuário logado 
    const login = (token) => {
        localStorage.setItem('token', token);
        setAuthenticated(true);
    };

//usuário deslogado
    const logout = () => {
        localStorage.removeItem('token');
        setAuthenticated(false);
    };

//Retorna o contexto configurado, com os valores disponíveis
    return (
        <AuthContext.Provider value={{ authenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
