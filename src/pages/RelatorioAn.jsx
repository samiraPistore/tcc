import React from 'react';
import './RelatorioAn.css';
import GraficoAnalise from '../components/charts/Graficos';
import GraficoOrdensServico from '../components/charts/GraficoLinha';
import GraficoPizzaOrdens from '../components/charts/GraficoOs';
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
          Status
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

      {/* Gráfico - Status dos Equipamentos */}
      <section className="grafico-analise-section">
        <h2 style={{ textAlign: 'center', marginTop: '30px' }}>Status dos Equipamentos</h2>
        <GraficoAnalise />
      </section>

      {/* Gráfico - Ordens de Serviço */}
      <section className="grafico-analise-section">
        <GraficoPizzaOrdens/>
      </section>


      <section className="grafico-analise-section">
        <GraficoOrdensServico/>
      </section>
    </div>

  )
};

export default RelatorioAn;
