import React from 'react';
import './IntegracoesSistema.css';

function Integracoes() {
  return (
    <div className="integracoes-container">
      <section className="integracoes-section">
        <h2>Integrações do Sistema</h2>

        <label className="integracoes-label">Token de Acesso:</label>
        <input type="text" className="integracoes-input" />

        <label className="integracoes-label">URL da API:</label>
        <input type="text" className="integracoes-input" />

        <button className="integracoes-button">Salvar Alterações</button>

        <p className="integracoes-status">Configurações salvas com sucesso!</p>
      </section>
    </div>
  );
}

export default Integracoes;
