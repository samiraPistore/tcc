import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TesteGrafico() {
  const data = {
    labels: ['Normal', 'Falha'],
    datasets: [{
      label: 'Equipamentos',
      data: [10, 5],  // dados fixos para teste
      backgroundColor: ['#4CAF50', '#F44336'],
      borderColor: ['#388E3C', '#D32F2F'],
      borderWidth: 1,
    }],
  };

  return (
    <div style={{ width: '400px', margin: 'auto' }}>
      <h3 style={{ textAlign: 'center' }}>Gráfico Teste</h3>
      <Pie data={data} />
    </div>
  );
}
