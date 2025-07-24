// App.jsx
import React, { useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRouteCargo from './auth/PrivateRouteCargo';
import PaginaAgendamentos from './pages/PaginaAgendamentos';
import NaoAutorizado from './pages/NaoAutorizado'; // Página de acesso negado
import "./App.css";
import { FaBell } from "react-icons/fa";

function App() {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const audioRef = useRef(null);

  const exibirAlerta = () => {
    setMostrarAlerta(true);

    if (audioRef.current) {
      audioRef.current.play();
    }

    setTimeout(() => {
      setMostrarAlerta(false);
    }, 40000); // 40 segundos
  };

  return (
    <Router>
      <div className="container">
        <button
          className={`botao-sino ${mostrarAlerta ? "ativo" : ""}`}
          onClick={exibirAlerta}
          title="Clique para ver o alerta"
        >
          <FaBell className="icone-sino" />
        </button>

        {/* Áudio do alerta */}
        <audio ref={audioRef} src="/alerta.mp3" preload="auto" />

        {/* Alerta visível */}
        {mostrarAlerta && (
          <div className="alerta">
            🔔 <strong>Alerta:</strong> Este é um aviso importante!
          </div>
        )}

        {/* Rotas */}
        <Routes>
          <Route
            path="/agendamentos"
            element={
              <PrivateRouteCargo permitido={['tecnico', 'engenheiro', 'supervisor']}>
                <PaginaAgendamentos />
              </PrivateRouteCargo>
            }
          />

          {/* Página de acesso negado */}
          <Route path="/nao-autorizado" element={<NaoAutorizado />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
