import React, { useState, useRef } from "react";
import "./App.css";
import { FaBell } from "react-icons/fa";

function App() {
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const audioRef = useRef(null);

  const exibirAlerta = () => {
    setMostrarAlerta(true);

    // Toca o som
    if (audioRef.current) {
      audioRef.current.play();
    }

    // Oculta o alerta após 40 segundos
    setTimeout(() => {
      setMostrarAlerta(false);
    }, 40000);
  };

  return (
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
    </div>
  );
}

export default App;

