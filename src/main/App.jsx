import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const usuarioPadrao = {
    email: "usuario@email.com",
    senha: "123456"
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setErro('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (email === usuarioPadrao.email && senha === usuarioPadrao.senha) {
        localStorage.setItem("auth", "true");
        navigate("/home");
      } else {
        setErro('Email ou senha incorretos.');
      }
    }, 1000);
  };

  return (
    <div className="login-container" role="main" aria-labelledby="login-title">
      <div className="login-box">
        <h2 id="login-title">Bem-vindo</h2>
        <div className="logo" aria-label="Logo SEMJ TECH">
          <img src="/logo.png" alt="Logo SEMJ TECH" />
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-describedby={erro ? "erro-login" : undefined}
              disabled={loading}
            />
          </div>
          <div className="input-group">
            <label htmlFor="senha" className="sr-only">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              aria-describedby={erro ? "erro-login" : undefined}
              disabled={loading}
            />
          </div>
          {erro && (
            <div id="erro-login" className="login-error" role="alert" aria-live="assertive">
              {erro}
            </div>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
