import { analisarSensor } from './sensorSimulator.js';

analisarSensor({
  temperatura: 72,
  vibracao: 210,
  ruido: 91
})
  .then((resultado) => {
    console.log('Resultado:', resultado); // Deve imprimir "FALHA" ou "OK"
  })
  .catch((erro) => {
    console.error('Erro na análise:', erro.message);
  });
