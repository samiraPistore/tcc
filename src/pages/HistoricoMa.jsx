import React, { useEffect, useState } from 'react'; 
import './HistoricoMa.css';
import Main from '../components/template/Main';
import axios from 'axios';

const MaintenanceScreen = () => {
  // Estado para armazenar lista de manutenções
  const [manutencoes, setManutencoes] = useState([]);

  // Estado para armazenar lista de equipamentos
  const [equipamentos, setEquipamentos] = useState([]);

  // Estado para armazenar os filtros selecionados pelo usuário
  const [filtros, setFiltros] = useState({
    data: '',        // filtro por data
    tipo: '',        // filtro por tipo (não está no select no momento)
    equipamento: '', // filtro por equipamento
    status: '',      // filtro por status
    descricao:'',
  });

  // useEffect para carregar os dados quando o componente monta (apenas 1 vez)
  useEffect(() => {
    const carregar = async () => {
      try {
        // Busca a lista de manutenções da API
        const resManutencao = await axios.get('http://localhost:3010/manutencoes');
        setManutencoes(resManutencao.data);

        // Busca a lista de equipamentos da API
        const resEquipamentos = await axios.get('http://localhost:3010/equipamentos');
        setEquipamentos(resEquipamentos.data);
      } catch (err) {
        // Caso ocorra erro, exibe no console
        console.error('Erro ao buscar dados:', err);
      }
    };
    carregar();
  }, []); // [] garante que rode somente na montagem do componente

  // Função para atualizar o estado de filtros quando o usuário altera um filtro
  const handleFiltroChange = (e) => {
    setFiltros({ 
      ...filtros,           // mantém os outros filtros
      [e.target.name]: e.target.value,  // atualiza o filtro que mudou
    });
  };

  // Aplica os filtros à lista de manutenções para gerar a lista filtrada que será exibida
  const manutencoesFiltradas = manutencoes.filter((item) => {
    // Verifica se o filtro de data está vazio ou se o item bate exatamente com a data filtrada
    const matchData = !filtros.data || item.data === filtros.data;

    // Verifica o filtro de tipo (atenção: item.tipo pode não existir na sua API)
    const matchTipo = !filtros.tipo || 
      (item.tipo && filtros.tipo && item.tipo.toLowerCase().trim() === filtros.tipo.toLowerCase().trim());

    // Verifica filtro por equipamento (comparando nomes ignorando maiúsculas/minúsculas)
    const matchEquipamento = !filtros.equipamento || 
      (item.nome_equipamento && filtros.equipamento && item.nome_equipamento.toLowerCase().trim() === filtros.equipamento.toLowerCase().trim());

    // Verifica filtro por status (ex: Pendente, Concluído, Atrasado)
    const matchStatus = !filtros.status || 
      (item.status && filtros.status && item.status.toLowerCase().trim() === filtros.status.toLowerCase().trim());

    // Retorna true apenas se passar em todos os filtros
    return matchData && matchTipo && matchEquipamento && matchStatus;
  });

  return (
    <Main 
      icon="desktop" 
      title="Histórico de Manutenção"
      subtitle="Controle de manutenções dos equipamentos"
    >
      <div className="maintenance-container">

        {/* Seção de filtros */}
        <div className="filters">
          <label>
            <span>Data:</span><br />
            {/* Input para filtro por data */}
            <input
              type="date"
              name="data"
              value={filtros.data}
              onChange={handleFiltroChange}
            />
          </label>
          
          <label>
            <span>Equipamento:</span><br />
            {/* Select para filtro por equipamento, populado dinamicamente */}
            <select
              name="equipamento"
              value={filtros.equipamento}
              onChange={handleFiltroChange}
            >
              <option value="">Todos os Equipamentos</option>
              {equipamentos.map((eq) => (
                <option key={eq.id} value={eq.nome_equipamento}>
                  {eq.nome_equipamento}
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>STATUS:</span><br />
            {/* Select para filtro por status fixo */}
            <select
              name="status"
              value={filtros.status}
              onChange={handleFiltroChange}
            >
              <option value="">Todas as Situações</option>
              <option value="Pendente">Pendente</option>
              <option value="Concluído">Concluído</option>
              <option value="Atrasado">Atrasado</option>
            </select>
          </label>
        </div>

        {/* Tabela que exibe as manutenções filtradas */}
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Equipamento</th>
              <th>Responsável</th>
              <th>Descrição</th>
              <th>Status</th>
              
            </tr>
          </thead>
          <tbody>
            {manutencoesFiltradas.length > 0 ? (
              manutencoesFiltradas.map((item, i) => (
                <tr key={i}>
                  {/* Exibe a data da manutenção */}
                  <td>{item.data_manutencao}</td>
                  {/* Exibe o nome do equipamento */}
                  <td>{item.nome_equipamento}</td>
                  {/* Exibe o responsável pela manutenção */}
                  <td>{item.nome_responsavel}</td>
                  {/* Para Exibir a Descrição*/}
                  <td>{item.descricao}</td>
                  {/* Exibe o status com uma classe CSS para estilização */}
                   <td className={`status ${item.status.toLowerCase().replace(' ', '-')}`}>
                    {item.status}
                  </td>
                </tr>
              ))
            ) : (
              // Caso não haja registros para exibir
              <tr>
                <td colSpan="4">Nenhuma manutenção encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </Main>
  );
};

export default MaintenanceScreen;
