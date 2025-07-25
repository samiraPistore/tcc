import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AgendaManu.css';

const AgendaManu = () => {
  const [nomeEquipamento, setNomeEquipamento] = useState('');
  const [equipamentosDisponiveis, setEquipamentosDisponiveis] = useState([]);
  const [form, setForm] = useState({
    equipamentoId: '',
    equipamentoNome: '',
    data: '',
    status: '',
    tecnico: '',
    descricao: ''
  });
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregarEquipamentos() {
      try {
        const response = await fetch('http://localhost:3010/equipamentos');
        if (!response.ok) throw new Error('Erro ao carregar equipamentos');
        const data = await response.json();
        setEquipamentosDisponiveis(data);
      } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
      }
    }

    carregarEquipamentos();
  }, []);

  const buscarEquipamento = async () => {
    if (!nomeEquipamento.trim()) {
      alert('Digite ou selecione o nome do equipamento');
      return;
    }

    setLoading(true);

    try {
      const url = `http://localhost:3010/equipamentos?nome=${encodeURIComponent(nomeEquipamento)}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const equipamentos = await response.json();

      if (!Array.isArray(equipamentos) || equipamentos.length === 0) {
        alert('Nenhum equipamento encontrado');
        return;
      }

      const equipamentoEncontrado = equipamentos.find(
        e => e.nome.toLowerCase() === nomeEquipamento.trim().toLowerCase()
      );

      if (!equipamentoEncontrado) {
        alert('Nenhum equipamento encontrado com nome exato');
        return;
      }

      setForm({
        equipamentoId: equipamentoEncontrado.id || '',
        equipamentoNome: equipamentoEncontrado.nome || '',
        status: equipamentoEncontrado.status || '',
        tecnico: equipamentoEncontrado.tecnico || '',
        descricao: equipamentoEncontrado.descricao || '',
        data: equipamentoEncontrado.data || ''
      });

      if (equipamentoEncontrado.data) {
        setDataSelecionada(new Date(equipamentoEncontrado.data));
      }
    } catch (error) {
      console.error('Erro ao buscar equipamento:', error);
      alert('Erro ao buscar equipamento. Veja console para detalhes.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setDataSelecionada(date);
    const dataFormatada = date.toISOString().split('T')[0];
    setForm(prev => ({ ...prev, data: dataFormatada }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para agendar.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3010/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          equipamento_id: form.equipamentoId,
          data_agendada: form.data,
          status: form.status,
          responsavel: form.tecnico,
          observacoes: form.descricao,
        }),
      });

      if (response.ok) {
        alert('Manutenção agendada com sucesso!');
        setForm({
          equipamentoId: '',
          equipamentoNome: '',
          data: '',
          status: '',
          tecnico: '',
          descricao: ''
        });
        setNomeEquipamento('');
      } else {
        const data = await response.json();
        alert(`Erro: ${data.msg || 'Não foi possível agendar'}`);
      }
    } catch (error) {
      console.error('Erro ao enviar agendamento:', error);
      alert('Erro ao enviar agendamento, tente novamente.');
    }
  };

  return (
    <div className="agenda-container">
      <div className="calendario">
        <Calendar value={dataSelecionada} onChange={handleDateChange} />
      </div>

      <form onSubmit={handleSubmit} className="formulario">
        <h2>Nova Manutenção</h2>

        <label>
          Nome do Equipamento:
          <select
            value={nomeEquipamento}
            onChange={(e) => setNomeEquipamento(e.target.value)}
          >
            <option value="">Selecione um equipamento</option>
            {equipamentosDisponiveis.map(eq => (
              <option key={eq.id} value={eq.nome}>
                {eq.nome}
              </option>
            ))}
          </select>

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
          Selecione o Equipamento:
          <select
            value={form.equipamentoId}
            onChange={(e) => {
              const id = e.target.value;
              const equipamento = equipamentosDisponiveis.find(eq => eq.id === parseInt(id));
              setForm(prev => ({
                ...prev,
                equipamentoId: id,
                equipamentoNome: equipamento?.nome || ''
              }));
            }}
          >
            <option value="">Selecione um equipamento</option>
            {equipamentosDisponiveis.map(eq => (
              <option key={eq.id} value={eq.id}>{eq.nome}</option>
            ))}
          </select>
        </label>

        <label>
          Data:
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
