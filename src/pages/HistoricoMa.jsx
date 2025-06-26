import React from 'react';
import './HistoricoMa.css';

const MaintenanceScreen = () => {
  return (
    <div className="maintenance-container">
      <h2>Histórico de Manutenção</h2>
      
      {/* Filtros */}
      <div className="filters">
        <label>
          {/*Data*/}
          <input type="date" />
        </label>
        <label>
          {/*Tipo*/}
          <select>
            <option>Preventiva</option>
            <option>Corretiva</option>
            <option>Preditiva</option>
          </select>
        </label>
        <label>
          {/*Equipamento*/}
          <select>
            <option>Todos</option>
            <option>Motor Elétrico</option>
            <option>Bomba Hidráulica</option>
          </select>
        </label>
        <button>Filtrar</button>
      </div>

      {/* Tabela de Manutenção */}
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Tipo</th>
            <th>Equipamento</th>
            <th>Responsável</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>17/06/2025</td>
            <td>Preventiva</td>
            <td>Motor Elétrico</td>
            <td>João</td>
            <td className="status concluido">Concluído</td>
          </tr>
          <tr>
            <td>15/06/2025</td>
            <td>Corretiva</td>
            <td>Bomba Hidráulica</td>
            <td>Ana</td>
            <td className="status em-andamento">Em Andamento</td>
          </tr>
          <tr>
            <td>12/06/2025</td>
            <td>Preditiva</td>
            <td>Esteira</td>
            <td>Carlos</td>
            <td className="status pendente">Pendente</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceScreen;
