import React, { useState } from 'react';
import Calendar from 'react-calendar'; // Componente de calendário
import 'react-calendar/dist/Calendar.css'; // Estilo padrão do calendário
import './AgendaManu.css'; // Estilo personalizado da página

const AgendaManu = () => {
  // Estado do formulário de manutenção
  const [form, setForm] = useState({
    data: '',
    horaInicio: '',
    horaFim: '',
    tecnico: '',
    tipo: 'preventiva',
    descricao: '',
    ferramentas: false,
    pecas: false
  });

  // Estado para o calendário
  const [dataSelecionada, setDataSelecionada] = useState(new Date());

  // Atualiza qualquer campo do formulário
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  // Atualiza a data selecionada no calendário e formata para o formulário
  const handleDateChange = (date) => {
    setDataSelecionada(date);
    const dataFormatada = date.toISOString().split('T')[0]; // yyyy-mm-dd
    setForm({ ...form, data: dataFormatada });
  };

  // Envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Agendamento:', form);
    alert('Manutenção agendada com sucesso!');
  };

  // Estrutura visual: calendário ao lado do formulário
  return (
    <div className="agenda-container">
      <div className="calendario">
        <Calendar value={dataSelecionada} onChange={handleDateChange} />
      </div>

      <form onSubmit={handleSubmit} className="formulario">
        <h2>Nova Manutenção</h2>

        {/* Campos do formulário */}
        <label>Horário Início:
          <input type="time" name="horaInicio" value={form.horaInicio} onChange={handleChange} />
        </label>

        <label>Horário Fim:
          <input type="time" name="horaFim" value={form.horaFim} onChange={handleChange} />
        </label>

        <label>Técnico:
          <input type="text" name="tecnico" value={form.tecnico} onChange={handleChange} />
        </label>

        <label>Tipo de Manutenção:
          <select name="tipo" value={form.tipo} onChange={handleChange}>
            <option value="preventiva">Preventiva</option>
            <option value="corretiva">Corretiva</option>
            <option value="preditiva">Preditiva</option>
          </select>
        </label>

        <label>Descrição:
          <textarea name="descricao" value={form.descricao} onChange={handleChange} />
        </label>

        <label>
          <input type="checkbox" name="ferramentas" checked={form.ferramentas} onChange={handleChange} />
          Ferramentas
        </label>

        <label>
          <input type="checkbox" name="pecas" checked={form.pecas} onChange={handleChange} />
          Peças
        </label>

        <button type="submit">Salvar</button>
      </form>
    </div>
  );
};

export default AgendaManu;
