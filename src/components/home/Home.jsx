import React from 'react';
import Main from '../template/Main';
import './home.css';

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
  <Main icon="home" title="DASHBOARD" subtitle="Manutenção preditiva">

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
  </Main>
);



export default Home;
