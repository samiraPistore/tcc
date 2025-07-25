// // src/routes/PrivateRoute.jsx
// import React from "react";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ children, allowedRoles }) => {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const token = localStorage.getItem("authToken");

//   // Se não estiver logado, redireciona para login
//   if (!token || !user) {
//     return <Navigate to="/login" replace />;
//   }

//   // Se cargo do usuário NÃO estiver entre os permitidos, bloqueia acesso
//   if (allowedRoles && !allowedRoles.includes(user.cargo)) {
//     return <Navigate to="/unauthorized" replace />;
//   }

//   // Usuário autenticado e autorizado
//   return children;
// };

// export default PrivateRoute;
