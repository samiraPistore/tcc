import React from 'react';
import Main from '../template/Main';
import './home.css';
import GraficoAnalise from '../charts/Graficos.jsx'; 

const dashboardData = [
  {
    icon: '✅',
    iconLabel: 'Status bom',
    number: 27,
    description: 'Ativos em bom estado',
    iconClass: 'green',
  },
  {
    icon: '⚠️',
    iconLabel: 'Alerta',
    number: 27,
    description: 'Ativos em alerta',
    iconClass: 'yellow',
  },
  {
    icon: '%',
    iconLabel: 'Desempenho',
    number: '98%',
    description: 'Desempenho geral',
    iconClass: 'blue',
  },
];

const Home = () => (
  <Main icon="home" title="DASHBOARD" subtitle="Manutenção Preditiva">

    {/* Cards principais */}
    <section className="dashboard-container" aria-label="Indicadores do sistema">
      {dashboardData.map(({ icon, iconLabel, number, description, iconClass }, index) => (
        <article key={index} className="dashboard-card" role="region" aria-labelledby={`card-title-${index}`}>
          <div className={`dashboard-icon ${iconClass}`} aria-label={iconLabel} role="img">
            {icon}
          </div>
          <div>
            <strong id={`card-title-${index}`} className="dashboard-number">{number}</strong>
            <p>{description}</p>
          </div>
        </article>
      ))}
    </section>


    <section className="grafico-analise-section">
      <h2 style={{ textAlign: 'center', marginTop: '30px' }}>Status dos Equipamentos</h2>
      <GraficoAnalise />
    </section>

    {/* Seção com Alertas e Manutenções */}
    <div className="extra-section">
      <div className="alerta-container">
        <h2 className="alerta-titulo">Alertas</h2>
        <p className="alerta-texto">Falha detectada em Equipamento C</p>
        <p className="alerta-texto">Anomalia detectada em Equipamento C</p>
        <p className="alerta-texto">Falha detectada em Equipamento C</p>
        <button className="botao">Ver Mais</button>
      </div>

      <div className="resumoManuten">
        <h2 className="resumoManutenc">Resumo Manutenções</h2>
        <p className="manuten">Manutenção A pendente</p>
        <p className="manuten">Manutenção A agendada</p>
        <p className="manuten">Manutenção A agendada</p>
        <p className="manuten">Manutenção A agendada</p>
        <p className="manuten">Manutenção A agendada</p>
      </div>
    </div>

  </Main>
);

export default Home;
