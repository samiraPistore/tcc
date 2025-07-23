import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // estilos do login
import fundo from "../assets/img/fundo-login.jpg"; // imagem de fundo (aplicada via CSS)

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3010/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.msg || "Email ou senha incorretos");
        return;
      }

      localStorage.setItem("authToken", data.token);
      setIsAuthenticated(true);
      navigate("/home");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErro("Erro na conexão com o servidor");
    }

    setLoading(false);
  };

  return (
    <div
      className="login-container"
      role="main"
      aria-labelledby="login-title"
      style={{ backgroundImage: `url(${fundo})` }}
    >
      <div className="login-box">
        <h2 id="login-title">Bem-vindo</h2>

        <div className="logo" aria-label="Logo SEMJ TECH">
          <img src="/logo-semj.png" alt="Logo SEMJ TECH" />
        </div>

        <h3 className="company-name">SEMJ TECH</h3>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
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
            <label htmlFor="senha" className="sr-only">
              Senha
            </label>
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
            <div
              id="erro-login"
              className="login-error"
              role="alert"
              aria-live="assertive"
            >
              {erro}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
