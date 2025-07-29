// Importações de bibliotecas e estilos
import React, { useState, useEffect } from 'react'; // React e hooks
import Calendar from 'react-calendar'; // Componente de calendário
import 'react-calendar/dist/Calendar.css'; // Estilo do calendário
import './AgendaManu.css'; // Estilo próprio da página

// Componente principal
const AgendaManu = () => {
  // Estado para armazenar os equipamentos disponíveis
  const [equipamentosDisponiveis, setEquipamentosDisponiveis] = useState([]);

  // Estado para armazenar os usuários com cargo de técnico
  const [tecnicos, setTecnicos] = useState([]);

  // Estado do formulário de agendamento
  const [form, setForm] = useState({
    equipamentoId: '',
    data: '',
    status: '',
    tecnico: '',
    descricao: ''
  });

  // Estado da data selecionada no calendário
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  // Estado para exibir loading enquanto envia dados
  const [loading, setLoading] = useState(false);

  // useEffect para carregar os dados do backend ao montar o componente
  useEffect(() => {
    async function carregarDados() {
      try {
        // Requisições paralelas para pegar equipamentos e usuários
        const [resEquipamentos, resUsuarios] = await Promise.all([
          fetch('http://localhost:3010/equipamentos'),
          fetch('http://localhost:3010/users')
        ]);

        // Se alguma das respostas falhar, lança erro
        if (!resEquipamentos.ok || !resUsuarios.ok) throw new Error('Erro ao carregar dados');

        // Converte as respostas em JSON
        const equipamentos = await resEquipamentos.json();
        const usuarios = await resUsuarios.json();

        // Filtra apenas usuários com cargo 'tecnico'
        const tecnicosFiltrados = usuarios.filter(u => u.cargo?.toLowerCase() === 'tecnico');

        // Atualiza os estados
        setEquipamentosDisponiveis(equipamentos);
        setTecnicos(tecnicosFiltrados);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    }

    carregarDados(); // Chama a função ao montar o componente
  }, []); // Executa apenas uma vez (componenteDidMount)

  // Atualiza o estado do formulário ao alterar campos de texto/select
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Atualiza o estado da data ao selecionar no calendário
  const handleDateChange = (date) => {
    setDataSelecionada(date);
    const dataFormatada = date.toISOString().split('T')[0]; // Formata para yyyy-mm-dd
    setForm(prev => ({ ...prev, data: dataFormatada }));
  };

  // Envia o formulário para o backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verifica se o usuário está autenticado
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para agendar.');
      return;
    }

    try {
      setLoading(true); // Ativa o loading
      const response = await fetch('http://localhost:3010/manutencao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Envia o token no cabeçalho
        },
        body: JSON.stringify({
          equipamento_id: form.equipamentoId,
          data_agendada: form.data,
          status: form.status,
          tecnico: form.tecnico,
          descricao: form.descricao,
        }),
      });

      // Se o envio for bem-sucedido
      if (response.ok) {
        alert('Manutenção agendada com sucesso!');
        // Reseta o formulário
        setForm({
          equipamentoId: '',
          data: '',
          status: '',
          tecnico: '',
          descricao: ''
        });
      } else {
        // Exibe mensagem de erro vinda do servidor
        const data = await response.json();
        alert(`Erro: ${data.msg || 'Não foi possível agendar'}`);
      }
    } catch (error) {
      console.error('Erro ao enviar agendamento:', error);
      alert('Erro ao enviar agendamento, tente novamente.');
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  // JSX retornado (interface do usuário)
  return (
    <div className="agenda-container">
      {/* Calendário de seleção de data */}
      <div className="calendario">
        <Calendar value={dataSelecionada} onChange={handleDateChange} />
      </div>

      {/* Formulário de agendamento */}
      <form onSubmit={handleSubmit} className="formulario">
        <h2>Nova Manutenção</h2>

        {/* Seleção de equipamento */}
        <label>
          Equipamento:
          <select
            value={form.equipamentoId}
            onChange={(e) => setForm(prev => ({ ...prev, equipamentoId: e.target.value }))}
          >
            <option value="">Selecione um equipamento</option>
            {equipamentosDisponiveis.map(eq => (
              <option key={eq.id} value={eq.id}>
                {eq.nome_equipamento}
              </option>
            ))}
          </select>
        </label>

        {/* Campo de data */}
        <label>
          Data:
          <input type="date" name="data" value={form.data} onChange={handleChange} />
        </label>

        {/* Seleção de status */}
        <label>
          Status:
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="">Selecione o status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Andamento">Em Andamento</option>
          </select>
        </label>

        {/* Seleção de técnico responsável */}
        <label>
          Técnico:
          <select name="tecnico" value={form.tecnico} onChange={handleChange}>
            <option value="">Selecione um técnico</option>
            {tecnicos.map(tecnico => (
              <option key={tecnico.id} value={tecnico.name}>
                {tecnico.name}
              </option>
            ))}
          </select>
        </label>

        {/* Campo de descrição opcional */}
        <label>
          Descrição:
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            placeholder="(opcional)"
          />
        </label>

        {/* Botão de envio */}
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </form>
    </div>
  );
};

// Exporta o componente
export default AgendaManu;
