import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';

function MeuGrafico() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3010/analise/resumo/geral").then((res) => {
      // Transforma resultado em texto para o gráfico
      const labels = res.data.map(item => item.resultado === 1 ? "Falha" : "Normal");
      const values = res.data.map(item => Number(item.quantidade));

      setDados({
        labels,
        datasets: [
          {
            label: "Ocorrências",
            data: values,
            backgroundColor: ['#cc3b3bff', '#3b82f6']
          }
        ]
      });
    });
  }, []);

  if (!dados) return <p>Carregando gráfico...</p>;

  return <Bar data={dados} />;
}

export default MeuGrafico;
