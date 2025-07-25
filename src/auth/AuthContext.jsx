// import React, { createContext, useState, useEffect } from 'react';

// // Cria o contexto de autenticação
// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [authenticated, setAuthenticated] = useState(false);
//   const [cargo, setCargo] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const savedCargo = localStorage.getItem('cargo');

//     if (token) {
//       setAuthenticated(true);
//       setCargo(savedCargo);
//     } else {
//       setAuthenticated(false);
//       setCargo(null);
//     }
//     setLoading(false);
//   }, []);

//   const login = (token, cargo) => {
//     localStorage.setItem('token', token);
//     localStorage.setItem('cargo', cargo);
//     setAuthenticated(true);
//     setCargo(cargo);
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('cargo');
//     setAuthenticated(false);
//     setCargo(null);
//   };

//   return (
//     <AuthContext.Provider value={{ authenticated, cargo, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
