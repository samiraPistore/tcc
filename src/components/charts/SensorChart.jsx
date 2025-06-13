// SensorChart.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const SensorChart = () => {
  const data = {
    labels: ['10:00', '10:05', '10:10', '10:15', '10:20'],
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: [35.2, 36.5, 38.0, 37.2, 36.0],
        borderColor: 'red',
        tension: 0.4
      },
      {
        label: 'Vibração (Hz)',
        data: [120, 125, 130, 128, 122],
        borderColor: 'blue',
        tension: 0.4
      },
      {
        label: 'Ruído (dB)',
        data: [70, 72, 75, 74, 71],
        borderColor: 'green',
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Line data={data} options={options} />;
};

export default SensorChart;
