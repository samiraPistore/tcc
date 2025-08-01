import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Main from '../template/Main';
import './home.css';
import GraficoAnalise from '../charts/Graficos.jsx';

const Home = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState([
    { icon: '✅', iconLabel: 'Status bom', number: '...', description: 'Ativos em bom estado', iconClass: 'green' },
    { icon: '⚠️', iconLabel: 'Alerta', number: '...', description: 'Ativos em alerta', iconClass: 'yellow' },
    { icon: '🛠️', iconLabel: 'Preventiva', number: '...', description: 'Intervalo médio entre preventivas', iconClass: 'blue' },
  ]);

  const [loading, setLoading] = useState(true);
  const [resumoManutencoes, setResumoManutencoes] = useState([]);
  const [alertasPorGravidade, setAlertasPorGravidade] = useState([]);

  async function buscarIndicadores() {
    try {
      const resp = await fetch('http://localhost:3010/dashboard/indicadores');
      if (!resp.ok) throw new Error('Erro indicadores: ' + resp.status);
      return await resp.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async function buscarResumoManutencoes() {
    try {
      const resp = await fetch('http://localhost:3010/resumo-manutencoes');
      if (!resp.ok) throw new Error('Erro resumo');
      return await resp.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async function buscarAlertasPorGravidade() {
    try {
      const resp = await fetch('http://localhost:3010/alertas');
      if (!resp.ok) throw new Error('Erro alertas');
      const data = await resp.json();

      const alertas = data.map(a => ({ ...a, nivel_gravidade: String(a.nivel_gravidade) }));
      const gravs = ['1', '2', '3'];
      const filtrado = gravs.map(g => alertas.find(a => a.nivel_gravidade === g)).filter(Boolean);
      setAlertasPorGravidade(filtrado);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    (async () => {
      setLoading(true);
      const ind = await buscarIndicadores();
      if (ind) {
        setDashboardData([
          { icon: '✅', iconLabel: 'Status bom', number: ind.bons, description: 'Ativos em bom estado', iconClass: 'green' },
          { icon: '⚠️', iconLabel: 'Alerta', number: ind.risco, description: 'Ativos em alerta', iconClass: 'yellow' },
          {
            icon: '🛠️', iconLabel: 'Preventiva',
            number: typeof ind.intervaloPreventivo === 'number' ? `${ind.intervaloPreventivo.toFixed(0)} dias` : 'N/A',
            description: 'Intervalo médio entre preventivas', iconClass: 'blue'
          },
        ]);
      }
      setResumoManutencoes(await buscarResumoManutencoes());
      await buscarAlertasPorGravidade();
      setLoading(false);
    })();
  }, []);

  return (
    <Main icon="home" title="DASHBOARD" subtitle="Manutenção Preditiva">
      <div className="scroll-container">
        {loading ? (
          <p style={{ textAlign: 'center' }}>Carregando indicadores...</p>
        ) : (
          <>
            <section className="dashboard-container">
              {dashboardData.map((d, i) => (
                <article key={i} className="dashboard-card" aria-label={d.iconLabel}>
                  <div className={`dashboard-icon ${d.iconClass}`}>{d.icon}</div>
                  <div>
                    <strong className="dashboard-number">{d.number}</strong>
                    <p>{d.description}</p>
                  </div>
                </article>
              ))}
            </section>

            <section className="grafico-e-cards">
              <div className="grafico-analise">
                <GraficoAnalise />
              </div>
              <div className="cards-laterais">
                {/* ALERTAS FORMATADOS */}
                <div className="alerta-container">
                  <h2 className="alerta-titulo">Alertas</h2>
                  {alertasPorGravidade.length === 0 ? (
                    <p className="alerta-texto">Nenhum alerta recente</p>
                  ) : (
                    alertasPorGravidade.map((alerta, idx) => {
                      let mensagem = '';
                      if (alerta.nivel_gravidade === '3') mensagem = 'Alta probabilidade de falha detectada';
                      else if (alerta.nivel_gravidade === '2') mensagem = 'Média probabilidade de falha detectada';
                      else if (alerta.nivel_gravidade === '1') mensagem = 'Pouca probabilidade de falha detectada';

                      return (
                        <div key={idx} className={`card-alerta gravidade-${alerta.nivel_gravidade}`}>
                          <span className="emoji-alerta">⚠️</span>
                          <div>
                            <p className="mensagem-alerta">{mensagem}</p>
                            <p className="gravidade-alerta">Gravidade: {alerta.nivel_gravidade}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <button className="botao" onClick={() => navigate('/alertas')}>
                    Ver Mais
                  </button>
                </div>
                {/* RESUMO MANUTENÇÕES */}
                <div className="resumoManuten">
                  <h2 className="resumoManutenc">Resumo Manutenções</h2>
                  {resumoManutencoes.length === 0 ? (
                    <p className="manuten">Nenhuma Manutenção Recente</p>
                  ) : (
                    resumoManutencoes.map((item, idx) => (
                      <p key={idx} className="manuten">
                        {item.nome_equipamento}: <strong>{item.status}</strong>
                      </p>
                    ))
                  )}

                  <button className="botao" onClick={() => navigate('/historico')}>
                    Ver Histórico
                  </button>
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
