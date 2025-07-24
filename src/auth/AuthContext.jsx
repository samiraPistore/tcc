import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [cargo, setCargo] = useState(null);
    const [loading, setLoading] = useState(true); // <-- Novo estado

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedCargo = localStorage.getItem('cargo');

        if (token && savedCargo) {
            setAuthenticated(true);
            setCargo(savedCargo);
        }

        setLoading(false); // <-- Finaliza o carregamento
    }, []);

    const login = (token, cargo) => {
        localStorage.setItem('token', token);
        localStorage.setItem('cargo', cargo);
        setAuthenticated(true);
        setCargo(cargo);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cargo');
        setAuthenticated(false);
        setCargo(null);
    };

    return (
        <AuthContext.Provider value={{ authenticated, cargo, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
