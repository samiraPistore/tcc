import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GraficoAnalise() {
  const [dados, setDados] = useState({ falha: 0, normal: 0 });


  useEffect(() => {
  fetch('http://localhost:3010/analise/resumo/geral')
    .then(res => res.json())
    .then(data => setDados(data))
    .catch(err => console.error("Erro ao carregar dados do gráfico", err));
}, []);

  const chartData = {
    labels: ['Funcionando Normalmente', 'Falhas Detectadas'],
    datasets: [{
      label: 'Quantidade de Equipamentos',
      data: [dados.normal, dados.falha],
      backgroundColor: ['#4CAF50', '#F44336'],
      borderColor: ['#388E3C', '#D32F2F'],
      borderWidth: 1
    }]
  };

  return (
    <div style={{ width: '400px', margin: 'auto' }}>
      <h3 style={{ textAlign: 'center' }}>Análise de Equipamentos</h3>
      <Pie data={chartData} />
    </div>
  );
}
