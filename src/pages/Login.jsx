import React, { useState } from 'react'; // Importa React e useState para controlar estado
import { useNavigate } from 'react-router-dom'; // Importa hook para navegação programada
import './Login.css'; // Importa estilos CSS específicos do Login

const Login = () => {
  // Declara estado para email, senha, erro e loading (carregando)
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  // Hook para navegar entre páginas
  const navigate = useNavigate();

  // Usuário fixo para comparação de login
  const usuarioPadrao = {
    email: "usuario@email.com",
    senha: "123456"
  };

  // Função que roda quando o formulário é enviado
  const handleSubmit = (event) => {
    event.preventDefault(); // Evita o reload da página
    setErro('');            // Limpa qualquer erro anterior
    setLoading(true);       // Seta loading como true para indicar processamento

    // Simula uma requisição que demora 1 segundo
    setTimeout(() => {
      setLoading(false); // Termina o loading

      // Verifica se o email e senha são iguais aos do usuário padrão
      if (email === usuarioPadrao.email && senha === usuarioPadrao.senha) {
        localStorage.setItem("auth", "true"); // Grava que está autenticado no localStorage
        navigate("/home");                     // Redireciona para a página home
      } else {
        setErro('Email ou senha incorretos.'); // Caso não seja igual, mostra erro
      }
    }, 1000);
  };

  // JSX que define a interface do componente
  return (
    <div className="login-container" role="main" aria-labelledby="login-title">
      <div className="login-box">
        <h2 id="login-title">Bem-vindo</h2>

        {/* Logo da aplicação */}
        <div className="logo" aria-label="Logo SEMJ TECH">
          <img src="/logo.png" alt="Logo SEMJ TECH" />
        </div>

        {/* Formulário de login */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Campo email */}
          <div className="input-group">
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email"
              value={email} // valor do estado email
              onChange={(e) => setEmail(e.target.value)} // atualiza o estado email quando usuário digita
              required
              aria-describedby={erro ? "erro-login" : undefined} // acessibilidade se tem erro
              disabled={loading} // desativa campo durante loading
            />
          </div>

          {/* Campo senha */}
          <div className="input-group">
            <label htmlFor="senha" className="sr-only">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="Senha"
              value={senha} // valor do estado senha
              onChange={(e) => setSenha(e.target.value)} // atualiza estado senha
              required
              aria-describedby={erro ? "erro-login" : undefined} // acessibilidade erro
              disabled={loading} // desativa campo durante loading
            />
          </div>

          {/* Mostra mensagem de erro se existir */}
          {erro && (
            <div id="erro-login" className="login-error" role="alert" aria-live="assertive">
              {erro}
            </div>
          )}

          {/* Botão para enviar o formulário */}
          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'} {/* Texto muda conforme loading */}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; // Exporta componente para ser usado em outros arquivos
