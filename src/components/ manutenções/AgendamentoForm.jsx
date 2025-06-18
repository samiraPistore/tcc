import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function AgendamentoForm() {
  const [agendamento, setAgendamento] = useState({
    maquina: '',
    tipo: '',
    data: new Date(),
    responsavel: '',
    observacoes: '',
  });

  const handleChange = (e) => {
    setAgendamento({ ...agendamento, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setAgendamento({ ...agendamento, data: date });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('http://localhost:3010/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...agendamento, data: agendamento.data.toISOString() }),
    });

    if (response.ok) {
      alert('Agendamento feito com sucesso!');
      setAgendamento({ maquina: '', tipo: '', data: new Date(), responsavel: '', observacoes: '' });
    } else {
      alert('Erro ao agendar.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="maquina" value={agendamento.maquina} onChange={handleChange} placeholder="Máquina" required />
      <input name="tipo" value={agendamento.tipo} onChange={handleChange} placeholder="Tipo de manutenção" required />
      
      <DatePicker
        selected={agendamento.data}
        onChange={handleDateChange}
        showTimeSelect
        dateFormat="Pp"
        placeholderText="Selecione a data e hora"
      />

      <input name="responsavel" value={agendamento.responsavel} onChange={handleChange} placeholder="Responsável" required />
      <textarea name="observacoes" value={agendamento.observacoes} onChange={handleChange} placeholder="Observações" />
      <button type="submit">Agendar</button>
    </form>
  );
}

export default AgendamentoForm;
