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

export default function GraficoOs() {
  const [data, setData] = useState(null);

  const fetchData = () => {
    axios.get('http://localhost:3010/os')
      .then(res => {
        const ordens = res.data;
        const statusCount = ordens.reduce((acc, os) => {
          acc[os.status] = (acc[os.status] || 0) + 1;
          return acc;
        }, {});
        const labels = Object.keys(statusCount);
        const values = Object.values(statusCount);

        setData({
          labels,
          datasets: [{
            data: values,
            backgroundColor: labels.map(status => {
              if (status.toLowerCase() === 'aberta') return '#3498db';
              if (status.toLowerCase() === 'fechada') return '#8e44ad';
              return '#ccc';
            }),
          }]
        });
      })
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
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

  if (!data) return <div>Carregando gráfico...</div>;

  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <h3>Distribuição das Ordens de Serviço</h3>
      <Pie data={data} />
      <button
        onClick={downloadCSV}
        className="botao-salvar"
      >
        Salvar CSV
      </button>
    </div>
  );
}
