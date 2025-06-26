import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook para navegação programática
import "./Login.css"; // Estilos específicos para a tela de login
import logo from "../assets/img/simbolo-logo.png"; // ajuste o caminho conforme a localização do arquivo
import fundo from "../assets/img/fundo-login.jpg";

const Login = ({ setIsAuthenticated }) => {
  // Estados para armazenar o email, senha, mensagem de erro e loading (loading para desabilitar inputs e botão)
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  // Hook para navegação
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
  // Usuário padrão para validação (em app real, faria chamada API)
  const usuarioPadrao = {
    email: "usuario@email.com",
    senha: "123456"
  };

 

  // Função que trata o envio do formulário de login
  /*const handleSubmit = (event) => {
    event.preventDefault();  // Previne o reload da página
    setErro('');             // Limpa erro anterior
    setLoading(true);        // Ativa loading para bloquear inputs

    // Simula uma requisição assíncrona (ex: chamada API)
    setTimeout(() => {
      setLoading(false);     // Remove loading

      // Valida se email e senha batem com o usuário padrão
      if (email === usuarioPadrao.email && senha === usuarioPadrao.senha) {
        localStorage.setItem("authToken", "true"); // Marca como autenticado
        setIsAuthenticated(true); // Atualiza o estado do App
        navigate("/home");                     // Redireciona para a página home
      } else {
        setErro('Email ou senha incorretos.'); // Exibe erro na tela
      }
    }, 1000); // Delay de 1 segundo só para simular processamento
  };
*/

  return (
    <div className="login-container" role="main" aria-labelledby="login-title">
      <div className="login-box">
        <h2 id="login-title">Bem-vindo</h2>
        <div className="logo" aria-label="Logo SEMJ TECH">
          <img src={logo} alt="Logo SEMJ TECH" />
        </div>
        <h3 className="company-name">SEMJ TECH</h3>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            {/* Input para email */}
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
              disabled={loading} // Desabilita input quando está carregando
            />
          </div>

          <div className="input-group">
            {/* Input para senha */}
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

          {/* Exibe mensagem de erro caso exista */}
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

          {/* Botão para enviar formulário */}
          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
