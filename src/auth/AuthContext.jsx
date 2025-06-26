// src/auth/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

//contexto de autenticação
export const AuthContext = createContext();

//Estado de login e indica se o usuário está logado ou não
export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);

//ele indica se você já tem login ou se precisa logar se tiver ele considera usuário logado
    useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) setAuthenticated(true);
}, []);

const login = (token) => {
    localStorage.setItem('authToken', token);
    setAuthenticated(true);
};

const logout = () => {
    localStorage.removeItem('authToken');
    setAuthenticated(false);
};


//Retorna o contexto configurado, com os valores disponíveis
    return (
        <AuthContext.Provider value={{ authenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
