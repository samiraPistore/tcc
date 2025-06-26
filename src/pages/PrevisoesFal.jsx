import React, { useEffect, useState } from 'react';
import './PrevisoesFal.css';

const PrevisoesFalhas = () => {
  const [previsoes, setPrevisoes] = useState([]);
  const [alertaUrgente, setAlertaUrgente] = useState(null);

  useEffect(() => {
    // Previsões de falhas
    fetch('http://localhost:3000/api/previsoes')
      .then(res => res.json())
      .then(data => setPrevisoes(data));

    // Alerta mais crítico
    fetch('http://localhost:3000/api/alertas')
      .then(res => res.json())
      .then(data => {
        const urgente = data.find(a => a.gravidade === 'alta');
        setAlertaUrgente(urgente);
      });
  }, []);

  return (
    <div className="maintenance-container">
      <h2>Previsões de Falhas</h2>

      {/* Tabela */}
      <table>
        <thead>
          <tr>
            <th>Previsão</th>
            <th>Alerta</th>
          </tr>
        </thead>
        <tbody>
          {previsoes.map(item => (
            <tr key={item.id}>
              <td>{item.dataPrevista} - {item.equipamento}</td>
              <td className={`risco-${item.gravidade}`}>{item.mensagem}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Gráfico de tendência */}
      <div className="grafico-tendencia-placeholder">
        <p>📈 Gráfico de Tendência (em construção)</p>
      </div>

      {/* Alerta crítico */}
      {alertaUrgente && (
        <div className="alerta-urgente">
          ⚠️ Alerta: {alertaUrgente.mensagem}
        </div>
      )}
    </div>
  );
};

export default PrevisoesFalhas;
