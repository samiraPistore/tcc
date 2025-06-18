import { spawn } from 'child_process';
import path from 'path';

export function analisarSensor(dados) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'prevent', 'prevent.py');

    const python = spawn('python', [scriptPath, JSON.stringify(dados)]);

    let resultado = '';
    python.stdout.on('data', (data) => {
      resultado += data.toString();
    });

    python.stderr.on('data', (data) => {
      console.error(`Erro Python: ${data}`);
    });

    python.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error('Erro ao executar o script Python.'));
      }
      resolve(resultado.trim());
    });
  });
}
