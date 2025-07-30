import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Main from '../template/Main';
import './home.css';
import GraficoAnalise from '../charts/Graficos.jsx';

const Home = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState([
    {
      icon: '✅',
      iconLabel: 'Status bom',
      number: '...',
      description: 'Ativos em bom estado',
      iconClass: 'green',
    },
    {
      icon: '⚠️',
      iconLabel: 'Alerta',
      number: '...',
      description: 'Ativos em alerta',
      iconClass: 'yellow',
    },
    {
      icon: '%',
      iconLabel: 'Desempenho',
      number: '...',
      description: 'Desempenho geral',
      iconClass: 'blue',
    },
  ]);

  const [loading, setLoading] = useState(true);

  async function buscarIndicadores() {
    try {
      const response = await fetch('http://localhost:3010/dashboard/indicadores');
      if (!response.ok) throw new Error('Erro ao buscar indicadores, status: ' + response.status);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Erro na requisição:', error);
      return null;
    }
  }

  useEffect(() => {
    async function carregarIndicadores() {
      setLoading(true);
      const dados = await buscarIndicadores();
      if (dados) {
        setDashboardData([
          {
            icon: '✅',
            iconLabel: 'Status bom',
            number: dados.bons,
            description: 'Ativos em bom estado',
            iconClass: 'green',
          },
          {
            icon: '⚠️',
            iconLabel: 'Alerta',
            number: dados.risco,
            description: 'Ativos em alerta',
            iconClass: 'yellow',
          },
          {
            icon: '%',
            iconLabel: 'Desempenho',
            number: typeof dados.mtbf === 'number' ? `${dados.mtbf.toFixed(2)}h` : 'N/A',
            description: 'Desempenho geral (MTBF)',
            iconClass: 'blue',
          },
        ]);
      }
      setLoading(false);
    }

    carregarIndicadores();
  }, []);

  return (
    <Main icon="home" title="DASHBOARD" subtitle="Manutenção Preditiva">
      <div className="scroll-container">
        {loading ? (
          <p style={{ textAlign: 'center' }}>Carregando indicadores...</p>
        ) : (
          <>
            {/* Cards principais */}
            <section className="dashboard-container">
              {dashboardData.map(({ icon, iconLabel, number, description, iconClass }, index) => (
                <article key={index} className="dashboard-card" aria-label={iconLabel}>
                  <div className={`dashboard-icon ${iconClass}`}>{icon}</div>
                  <div>
                    <strong className="dashboard-number">{number}</strong>
                    <p>{description}</p>
                  </div>
                </article>
              ))}
            </section>

            {/* Gráfico + Cards Laterais */}
            <section className="grafico-e-cards">
              <div className="grafico-analise">
                <GraficoAnalise />
              </div>

              <div className="cards-laterais">
                <div className="alerta-container">
                  <h2 className="alerta-titulo">Alertas</h2>
                  <p className="alerta-texto">Falha detectada em Equipamento C</p>
                  <p className="alerta-texto">Anomalia detectada em Equipamento C</p>
                  <p className="alerta-texto">Falha detectada em Equipamento C</p>
                  <button className="botao" onClick={() => navigate('/alertas')}>
                    Ver Mais
                  </button>
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
            </section>
          </>
        )}
      </div>
    </Main>
  );
};

export default Home;
