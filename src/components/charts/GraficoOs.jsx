// GraficoPizzaOrdens.jsx
import { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function GraficoPizzaOrdens() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3010/os/quantidade-por-status')
      .then(res => {
        const labels = res.data.map(item => item.status);
        const valores = res.data.map(item => item.quantidade);

        setDados({
          labels,
          datasets: [
            {
              label: 'Ordens de Serviço',
              data: valores,
              backgroundColor: ['#3B82F6', '#8c2aceff', '#10B981'], // azul, amarelo, verde
              borderColor: '#fff',
              borderWidth: 1,
            }
          ]
        });
      })
      .catch(err => {
        console.error('Erro ao carregar gráfico de pizza:', err);
      });
  }, []);

  if (!dados) return <p>Carregando gráfico...</p>;

  return (
    <div>
      <h3>Distribuição das Ordens de Serviço</h3>
      <Pie data={dados} />
    </div>
  );
}
