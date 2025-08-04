import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const GraficoLinha = () => {
  const [data, setData] = useState(null);

  const fetchData = () => {
    axios
      .get("http://localhost:3010/os/quantidade")
      .then((res) => {
        const dados = res.data;
        const labels = dados.map((d) => new Date(d.data).toISOString().slice(0, 10));
        const abertas = dados.map((d) => parseInt(d.abertas));
        const fechadas = dados.map((d) => parseInt(d.fechadas));


        setData({
          labels,
          datasets: [
            {
              label: "Ordens Abertas",
              data: abertas,
              borderColor: "blue",
              backgroundColor: "blue",
            },
            {
              label: "Ordens Fechadas",
              data: fechadas,
              borderColor: "green",
              backgroundColor: "green",
            },
          ],
        });
      })
  }

  useEffect(() => {
    fetchData(); // chamada inicial
    const interval = setInterval(fetchData, 10000); // atualiza a cada 10s

    return () => clearInterval(interval);
  }, []);

  const downloadCSV = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!data) return;

    let csv = "Data,Ordens Abertas,Ordens Fechadas\n";
    data.labels.forEach((label, i) => {
      csv += `${label},${data.datasets[0].data[i]},${data.datasets[1].data[i]}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "ordens_tempo.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  if (!data)
    return <div className="grafico-analise-section">Carregando gráfico...</div>;

  return (
    <div className="grafico-analise-section">
      <h3>Ordens ao Longo do Tempo</h3>
      <Line data={data} />
      <button className="botao-salvar" type="button" onClick={downloadCSV}>
        Salvar CSV
      </button>
    </div>
  );
};

export default GraficoLinha;
