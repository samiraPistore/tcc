import React, { useEffect, useState } from 'react';
import './HistoricoMa.css';
import Main from '../components/template/Main';
import axios from 'axios'; // Biblioteca para chamadas HTTP

const MaintenanceScreen = () => {
  const [manutencoes, setManutencoes] = useState([]);
  const [filtros, setFiltros] = useState({
    data: '',
    tipo: '',
    equipamento: '',
  });

  // Buscar dados do backend
  useEffect(() => {
  const carregar = async () => {
    try {
      const res = await axios.get('http://localhost:3010/manutencoes');
      setManutencoes(res.data);
    } catch (err) {
      console.error('Erro ao buscar manutenções:', err);
    }
  };
  carregar();
}, []);

  // Atualiza os filtros ao digitar
  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  // Filtra localmente os dados (poderia ser no backend também)
  const manutencoesFiltradas = manutencoes.filter((item) => {
    const matchData = !filtros.data || item.data === filtros.data;
    const matchTipo = !filtros.tipo || item.tipo === filtros.tipo;
    const matchEquipamento = !filtros.equipamento || item.equipamento === filtros.equipamento;
    return matchData && matchTipo && matchEquipamento;
  });

  return (
    <Main 
      icon="desktop" 
      title="Histórico de Manutenção"
      subtitle="Controle de manutenções dos equipamentos"
    >
      <div className="maintenance-container">
        
        {/* Filtros */}
        <div className="filters">
          <label>
            <input type="date" name="data" value={filtros.data} onChange={handleFiltroChange} />
          </label>
          <label>
            <select name="tipo" value={filtros.tipo} onChange={handleFiltroChange}>
              <option value="">Stat</option>
              <option value="Pendente">Pendente</option>
              <option value="Concluido">Concluido</option>
              <option value="Atraso">Em Atraso</option>
            </select>
          </label>
          <label>
            <select name="equipamento" value={filtros.equipamento} onChange={handleFiltroChange}>
              <option value="">Todos os Equipamentos</option>
              <option value="Motor Elétrico">Motor Elétrico</option>
              <option value="Bomba Hidráulica">Bomba Hidráulica</option>
              <option value="Esteira">Esteira</option>
            </select>
          </label>
        </div>

        {/* Tabela */}
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
            {manutencoesFiltradas.length > 0 ? (
              manutencoesFiltradas.map((item, i) => (
                <tr key={i}>
                  <td>{item.data}</td>
                  <td>{item.tipo}</td>
                  <td>{item.equipamento}</td>
                  <td>{item.responsavel}</td>
                  <td className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Nenhuma manutenção encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Main>
  );
};

export default MaintenanceScreen;
