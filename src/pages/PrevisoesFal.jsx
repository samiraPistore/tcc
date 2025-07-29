import React from 'react';
import './PrevisoesFal.css';

const PrevisoesFalhas = () => {
  return (
    <div className="falhas-layout">
  {/* Tabela de previsões */}
  <div className="tabela-previsoes">
    <h2 className="titulo-centralizado">Previsões de Falhas</h2>
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
    <h3 className="titulo-grafico">Gráfico de Tendência</h3>
    <div className="grafico-box">
      {/* Aqui vai o gráfico futuramente */}
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
