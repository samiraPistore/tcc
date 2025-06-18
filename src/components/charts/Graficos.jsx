import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registro dos elementos necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Grafico = ({ labels, valores, titulo = 'Gráfico', legenda = 'Dados' }) => {
  const data = {
    labels,
    datasets: [
      {
        label: legenda,
        data: valores,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: titulo },
    },
  };

  return (
    <div style={{ width: '700px', margin: '0 auto' }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default Grafico;
