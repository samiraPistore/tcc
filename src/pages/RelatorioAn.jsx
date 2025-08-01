import React from 'react';
import './RelatorioAn.css';
import GraficoAnalise from '../components/charts/Graficos';
import GraficoOrdensServico from '../components/charts/GraficoLinha';
import GraficoPizzaOrdens from '../components/charts/GraficoOs';

const RelatorioAn = () => {
  return (
    <div className="relatorio-container">
      <h2>Relatórios e Análises</h2>

      {/* Filtros */}
      <div className="filters">
        <label className="data">
          Data
          <input type="date" />
        </label>
        <label className="status">
          Status
          <select>
            <option>Concluído</option>
            <option>Pendente</option>
            <option>Atrasado</option>
            <option>Em andamento</option>
          </select>
        </label>
        <label className="equipamento">
          Equipamento
          <select>
            <option>Todos</option>
            <option>Motor Elétrico</option>
            <option>Bomba Hidráulica</option>
          </select>
        </label>
      </div>

      {/* Gráficos em layout responsivo */}
      <div className="graficos-grid">
        <div className="grafico-item">
          <GraficoPizzaOrdens />
        </div>

        <div className="grafico-item">
          <GraficoAnalise />
        </div>

        <div className="grafico-item">
          <GraficoOrdensServico />
        </div>
      </div>
    </div>
  );
};

export default RelatorioAn;
