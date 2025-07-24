import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AgendaManu.css';

const AgendaManu = () => {
  // Estado para o nome do equipamento que o usuário digita para buscar
  const [nomeEquipamento, setNomeEquipamento] = useState('');
  
  // Estado para armazenar os dados do formulário de manutenção
  const [form, setForm] = useState({
    equipamentoId: '',
    equipamentoNome: '',
    data: '',
    status: '',
    tecnico: '',
    descricao: ''
  });
  
  // Estado para controlar a data selecionada no calendário
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  
  // Estado para indicar se está carregando a busca do equipamento
  const [loading, setLoading] = useState(false);

  // Atualiza o estado nomeEquipamento conforme o usuário digita
  const handleNomeEquipChange = (e) => {
    setNomeEquipamento(e.target.value);
  };

  // Função para buscar equipamento na API pelo nome digitado
  const buscarEquipamento = async () => {
    if (!nomeEquipamento.trim()) {
      alert('Digite o nome do equipamento');
      return;
    }

    setLoading(true); // começa a carregar

    try {
      // Monta a URL com o nome codificado para buscar no backend
      const url = `http://localhost:3010/equipamentos?nome=${encodeURIComponent(nomeEquipamento)}`;
      const response = await fetch(url);

      // Se o status não for OK, lança erro
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

      // Converte a resposta para JSON (array de equipamentos)
      const equipamentos = await response.json();

      // Verifica se é array e se tem equipamentos
      if (!Array.isArray(equipamentos) || equipamentos.length === 0) {
        alert('Nenhum equipamento encontrado');
        return;
      }

      // Busca o equipamento com nome exatamente igual (ignora maiúsc/minúsc)
      const equipamentoEncontrado = equipamentos.find(
        e => e.nome.toLowerCase() === nomeEquipamento.trim().toLowerCase()
      );

      // Se não achou o equipamento com nome exato, avisa e retorna
      if (!equipamentoEncontrado) {
        alert('Nenhum equipamento encontrado com nome exato');
        return;
      }

      // Atualiza o estado do formulário com os dados do equipamento encontrado
      setForm({
        equipamentoId: equipamentoEncontrado.id || null,
        equipamentoNome: equipamentoEncontrado.nome || '',
        status: equipamentoEncontrado.status || '',
        tecnico: equipamentoEncontrado.tecnico || '',
        descricao: equipamentoEncontrado.descricao || '',
        data: equipamentoEncontrado.data || ''
      });

      // Se tiver data, converte para Date e atualiza o calendário
      if (equipamentoEncontrado.data) setDataSelecionada(new Date(equipamentoEncontrado.data));

    } catch (error) {
      // Caso ocorra erro na busca, mostra no console e alerta
      console.error('Erro ao buscar equipamento:', error);
      alert('Erro ao buscar equipamento. Veja console para detalhes.');
    } finally {
      setLoading(false); // termina o loading
    }
  };

  // Função para atualizar qualquer campo do formulário conforme o usuário digita
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Quando o usuário seleciona uma data no calendário, atualiza os estados
  const handleDateChange = (date) => {
    setDataSelecionada(date);
    // Formata a data para yyyy-mm-dd para o input date
    const dataFormatada = date.toISOString().split('T')[0];
    setForm(prev => ({ ...prev, data: dataFormatada }));
  };

  // Ao enviar o formulário, evita refresh e mostra dados no console + alerta
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Agendamento:', form);
    alert('Manutenção agendada com sucesso!');
  };

  // JSX que renderiza a interface do componente
  return (
    <div className="agenda-container">
      <div className="calendario">
        {/* Calendário para selecionar a data */}
        <Calendar value={dataSelecionada} onChange={handleDateChange} />
      </div>

      <form onSubmit={handleSubmit} className="formulario">
        <h2>Nova Manutenção</h2>

        <label>
          Nome do Equipamento:
          {/* Input controlado para o nome do equipamento */}
          <input 
            type="text" 
            value={nomeEquipamento} 
            onChange={handleNomeEquipChange} 
            placeholder="Digite o nome do equipamento" 
          />
          {/* Botão para buscar o equipamento na API */}
          <button 
            type="button" 
            onClick={buscarEquipamento}
            disabled={loading}
            style={{ marginLeft: '10px', padding: '6px 12px' }}
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </label>

        <label>
          Data:
          {/* Input para editar a data manualmente */}
          <input type="date" name="data" value={form.data} onChange={handleChange} />
        </label>

        <label>
          Status:
          <input type="text" name="status" value={form.status} onChange={handleChange} />
        </label>

        <label>
          Técnico:
          <input type="text" name="tecnico" value={form.tecnico} onChange={handleChange} />
        </label>

        <label>
          Descrição:
          <textarea name="descricao" value={form.descricao} onChange={handleChange} placeholder="(opcional)" />
        </label>

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default AgendaManu;
