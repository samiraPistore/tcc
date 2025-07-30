import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import axios from 'axios';

// Registrar os componentes do Chart.js (obrigatório)
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Graficos = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    // Simulação de chamada à API
    axios.get('/api/statusEquipamentos') // troque por sua URL real
      .then((res) => {
        const data = res.data;

        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: 'Ocorrências',
              data: data.values,
              backgroundColor: ['#36A2EB', '#FF6384'],
            }
          ]
        });
      })
      .catch(() => {
        // Se a API falhar, usa dados fixos
        setChartData({
          labels: ['Normal', 'Falha'],
          datasets: [
            {
              label: 'Ocorrências',
              data: [230, 5],
              backgroundColor: ['#36A2EB', '#FF6384'],
            }
          ]
        });
      });
  }, []);

  // Função para baixar o CSV
  const downloadCSV = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!chartData.labels.length) return;

    let csv = 'Status,Ocorrências\n';
    chartData.labels.forEach((label, index) => {
      csv += `${label},${chartData.datasets[0].data[index]}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'status_equipamentos.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div>
      <h3>Status dos Equipamentos</h3>
      <Bar data={chartData} />
      <button type="button" onClick={downloadCSV} style={{
        marginTop: '10px',
        padding: '8px 12px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}>
        Salvar CSV
      </button>
    </div>
  );
};

export default Graficos;
