import React from 'react';
import './RelatorioAn.css';

const RelatorioAn = () => {
  return (
    <div className="maintenance-container">
      <h2>Relatórios e Análises</h2>
      
      {/* Filtros */}
      <div className="filters">
        <label>
          Data
          <input type="date" />
        </label>
        <label>
          Satatus
          <select>
            <option>Concluído</option>
            <option>Pendente</option>
            <option>Atrasado</option>
            <option>Em andamento</option>
          </select>
        </label>
        <label>
          Equipamento
          <select>
            <option>Todos</option>
            <option>Motor Elétrico</option>
            <option>Bomba Hidráulica</option>
          </select>
        </label>
        <button>Gerar relatórios</button>
      </div>
    </div>
   
  );
};

export default RelatorioAn;
