import React, { useEffect, useState } from 'react'; 
import './HistoricoMa.css';
import Main from '../components/template/Main';
import axios from 'axios';

const MaintenanceScreen = () => {
  const [manutencoes, setManutencoes] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [filtros, setFiltros] = useState({
    data: '',
    tipo: '',
    equipamento: '',
    status: '',
    descricao: '',
  });

  const [editandoId, setEditandoId] = useState(null);
  const [novoStatus, setNovoStatus] = useState('');

  useEffect(() => {
    const carregar = async () => {
      try {
        const resManutencao = await axios.get('http://localhost:3010/manutencoes');
        setManutencoes(resManutencao.data);

        const resEquipamentos = await axios.get('http://localhost:3010/equipamentos');
        setEquipamentos(resEquipamentos.data);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
      }
    };
    carregar();
  }, []);

  const handleFiltroChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const manutencoesFiltradas = manutencoes.filter((item) => {
    const matchData = !filtros.data || item.data_manutencao === filtros.data;
    const matchTipo = !filtros.tipo || (item.tipo && filtros.tipo && item.tipo.toLowerCase().trim() === filtros.tipo.toLowerCase().trim());
    const matchEquipamento = !filtros.equipamento || (item.nome_equipamento && filtros.equipamento && item.nome_equipamento.toLowerCase().trim() === filtros.equipamento.toLowerCase().trim());
    const matchStatus = !filtros.status || (item.status && filtros.status && item.status.toLowerCase().trim() === filtros.status.toLowerCase().trim());
    return matchData && matchTipo && matchEquipamento && matchStatus;
  });

  const iniciarEdicao = (id, statusAtual) => {
    setEditandoId(id);
    setNovoStatus(statusAtual);
  };

  const salvarStatus = async (id) => {
    try {
      await axios.patch(`http://localhost:3010/manutencoes/${id}`, {
        status: novoStatus
      });

      setManutencoes(prev =>
        prev.map(item =>
          item.id === id ? { ...item, status: novoStatus } : item
        )
      );

      setEditandoId(null);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      alert('Erro ao atualizar status.');
    }
  };

  return (
    <Main 
      icon="desktop" 
      title="Histórico de Manutenção"
      subtitle="Controle de manutenções dos equipamentos"
    >
      <div className="maintenance-container">
        <div className="filters">
          <label>
            <span>Data:</span><br />
            <input type="date" name="data" value={filtros.data} onChange={handleFiltroChange} />
          </label>
          
          <label>
            <span>Equipamento:</span><br />
            <select name="equipamento" value={filtros.equipamento} onChange={handleFiltroChange}>
              <option value="">Todos os Equipamentos</option>
              {equipamentos.map((eq) => (
                <option key={eq.id} value={eq.nome_equipamento}>
                  {eq.nome_equipamento}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Status:</span><br />
            <select name="status" value={filtros.status} onChange={handleFiltroChange}>
              <option value="">Todas as Situações</option>
              <option value="Pendente">Pendente</option>
              <option value="Concluído">Concluído</option>
              <option value="Em Andamento">Em Andamento</option>
            </select>
          </label>
        </div>

        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Equipamento</th>
              <th>Responsável</th>
              <th>Descrição</th>
              <th>Status</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {manutencoesFiltradas.length > 0 ? (
              manutencoesFiltradas.map((item, i) => (
                <tr key={i}>
                  <td>{item.data_manutencao}</td>
                  <td>{item.nome_equipamento}</td>
                  <td>{item.nome_responsavel}</td>
                  <td>{item.descricao}</td>
                  <td>
                    {editandoId === item.id ? (
                      <select value={novoStatus} onChange={(e) => setNovoStatus(e.target.value)}>
                        <option value="Pendente">Pendente</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Em Andamento">Em Andamento</option>
                      </select>
                    ) : (
                      <span className={`status ${
                      item.status.toLowerCase()
                        .normalize("NFD")           // Remove acentos
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/\s+/g, '-')       // Substitui espaços por hífen
                    }`}>
                      {item.status}
                    </span>
                    )}
                  </td>
                  <td>
                    {editandoId === item.id ? (
                      <button onClick={() => salvarStatus(item.id)}>Salvar</button>
                    ) : (
                      <button onClick={() => iniciarEdicao(item.id, item.status)}>📝</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">Nenhuma manutenção encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Main>
  );
};

export default MaintenanceScreen;
