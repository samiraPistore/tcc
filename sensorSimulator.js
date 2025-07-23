import axios from 'axios';


const sensores = [
  { id: 'acee7d7b-0550-4999-8a1a-b1cb2a86b255', tipo: 'Temperatura', min: 20, max: 90 },
  { id: '109e4bc7-c25a-4fea-ac7d-de2b2b8b95bb', tipo: 'Vibração', min: 0, max: 100 },
  { id: 'ec556c0a-4645-4fa0-b9ef-fbfbcf1dfd1f', tipo: 'Pressão', min: 10, max: 50 }
];


function gerarLeitura(sensor) {
  const valor = parseFloat((Math.random() * (sensor.max - sensor.min) + sensor.min).toFixed(2));
  return {
    sensor_id: sensor.id,
    valor,
    timestamp: new Date().toISOString()
  };
}


async function enviarLeituras() {
  for (const sensor of sensores) {
    const leitura = gerarLeitura(sensor);
    console.log('Enviando leitura:', leitura);  // DEBUG
    try {
      await axios.post('http://localhost:3010/leituras', leitura);
      console.log(`✔ Leitura enviada: ${sensor.tipo} → ${leitura.valor}`);
    } catch (err) {
      console.error('Erro ao enviar leitura:', err.message);
    }
  }
}


setInterval(enviarLeituras, 10000);


