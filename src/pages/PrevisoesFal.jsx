import React from 'react';
import './PrevisoesFal.css';

const PrevisoesFalhas = () => {
  return (
    <div className="falhas-layout">
      {/* Tabela de previsões */}
      <div className="tabela-previsoes">
        <h2>Previsões de Falhas</h2>
        <table>
          <thead>
            <tr>
              <th>Previsão</th>
              <th>Alerta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>xx/xx/xxxx</td>
              <td>
                <strong>Motor</strong><br />
                falha prevista em 7 dias
              </td>
            </tr>
            <tr>
              <td>xx/xx/xxxx</td>
              <td>
                <strong>Esteira</strong><br />
                falha prevista em 15 dias
              </td>
            </tr>
            <tr>
              <td>xx/xx/xxxx</td>
              <td>
                <strong>Compressor</strong><br />
                falha prevista em 3 dias
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Gráfico + alerta */}
      <div className="grafico-area">
        <h3>Gráfico de Tendência</h3>
        <div className="grafico-box">
          <img
            src="https://quickchart.io/chart?c={type:'line',data:{labels:['Item 1','Item 2','Item 3','Item 4','Item 5'],datasets:[{label:'Falhas',data:[18,26,23,31,34,26,29,20,24],borderColor:'cyan',fill:false}]}}"
            alt="Gráfico de tendência"
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        {/* Alerta visual abaixo do gráfico */}
        <div className="alerta-visual">
          <img src="https://cdn-icons-png.flaticon.com/512/564/564619.png" alt="Alerta" />
          <div>
            <p className="alerta-titulo">Alerta</p>
            <p className="alerta-texto">falha eminente no motor</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrevisoesFalhas;
