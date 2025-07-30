import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const GraficoOs = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('/api/ordens-servico') // Substitua pela sua rota
      .then((res) => {
        const dados = res.data;
        setData({
          labels: dados.labels,
          datasets: [{
            data: dados.values,
            backgroundColor: ['#8e44ad', '#3498db']
          }]
        });
      })
      .catch(() => {
        // fallback se a API falhar
        setData({
          labels: ['Fechada', 'Aberta'],
          datasets: [{
            data: [70, 30],
            backgroundColor: ['#8e44ad', '#3498db']
          }]
        });
      });
  }, []);

  const downloadCSV = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data) return;

    let csv = 'Status,Quantidade\n';
    data.labels.forEach((label, i) => {
      csv += `${label},${data.datasets[0].data[i]}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ordens_servico.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!data) return <div className="grafico-analise-section">Carregando gráfico...</div>;

  return (
    <div className="grafico-analise-section">
      <h3>Distribuição das Ordens de Serviço</h3>
      <Pie data={data} />
      <button type="button" onClick={downloadCSV} style={{
        marginTop: '60px',
        padding: '8px 12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
      }}>
        Salvar CSV
      </button>
    </div>
  );
};

export default GraficoOs;
