import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';


// REGISTRA ELEMENTOS DO CHART.JS
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';


ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);


function MeuGrafico() {
  const [dados, setDados] = useState(null);


  useEffect(() => {
    axios.get("http://localhost:3010/analise/resumo/geral")
      .then((res) => {
        console.log("Resposta da API:", res.data);


        const labels = res.data.map(item =>
          parseInt(item.resultado) === 1 ? "Falha" : "Normal"
        );


        const values = res.data.map(item => parseInt(item.quantidade));


        setDados({
          labels,
          datasets: [
            {
              label: "Ocorrências",
              data: values,
              backgroundColor: ['#3b82f6','#cc3b3bff']
            }
          ]
        });
      })
      .catch(err => {
        console.error("Erro ao carregar gráfico:", err);
      });
  }, []);


  if (!dados) return <p>Carregando gráfico...</p>;


  return <Bar key={JSON.stringify(dados)} data={dados} />;
}


export default MeuGrafico;


