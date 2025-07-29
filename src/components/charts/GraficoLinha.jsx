// GraficoOrdensServico.jsx
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function GraficoOrdensServico() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3010/os/quantidade')
      .then(res => {
        const labels = res.data.map(item => item.data);
        const abertas = res.data.map(item => item.abertas);
        const fechadas = res.data.map(item => item.fechadas);

        setDados({
          labels,
          datasets: [
            {
              label: 'Ordens Abertas',
              data: abertas,
              borderColor: 'blue',
              backgroundColor: 'rgba(59,130,246,0.2)',
            },
            {
              label: 'Ordens Fechadas',
              data: fechadas,
              borderColor: 'green',
              backgroundColor: 'rgba(34,197,94,0.2)',
            }
          ]
        });
      })
      .catch(err => {
        console.error('Erro ao carregar gráfico OS:', err);
      });
  }, []);

  if (!dados) return <p>Carregando gráfico...</p>;

  return <Line data={dados} />;
}
