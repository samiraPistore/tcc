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
    axios.get('/api/statusEquipamentos')
      .then((res) => {
        const data = res.data;
        setChartData({
          labels: data.labels,
          datasets: [{
            label: 'Ocorrências',
            data: data.values,
            backgroundColor: ['#36A2EB', '#FF6384'],
          }]
        });
      })
      .catch(() => {
        setChartData({
          labels: ['Normal', 'Falha'],
          datasets: [{
            label: 'Ocorrências',
            data: [230, 5],
            backgroundColor: ['#36A2EB', '#FF6384'],
          }]
        });
      });
  }, []);

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
      <button
        type="button"
        onClick={downloadCSV}
        className="botao-salvar"
      >
        Salvar CSV
      </button>
    </div>
  );
};

export default Graficos;
