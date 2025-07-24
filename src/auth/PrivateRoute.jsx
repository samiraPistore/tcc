import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const PrivateRouteCargo = ({ children, permitido }) => {
  const { authenticated, cargo, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Carregando...</div>; // Pode ser um spinner
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!permitido.includes(cargo)) {
    return <Navigate to="/nao-autorizado" replace />;
  }

  return children;
};

export default PrivateRouteCargo;
