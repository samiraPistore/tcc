import React, { useState } from 'react';

function AgendamentoForm() {
  const [agendamento, setAgendamento] = useState({
    maquina: '',
    tipo: '',
    data: '',
    responsavel: '',
    observacoes: '',
  });

  const handleChange = (e) => {
    setAgendamento({ ...agendamento, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enviar os dados para o backend
    const response = await fetch('http://localhost:3010/agendamentos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agendamento),
    });

    if (response.ok) {
      alert('Agendamento feito com sucesso!');
      setAgendamento({ maquina: '', tipo: '', data: '', responsavel: '', observacoes: '' });
    } else {
      alert('Erro ao agendar.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="maquina" value={agendamento.maquina} onChange={handleChange} placeholder="Máquina" required />
      <input name="tipo" value={agendamento.tipo} onChange={handleChange} placeholder="Tipo de manutenção" required />
      <input type="datetime-local" name="data" value={agendamento.data} onChange={handleChange} required />
      <input name="responsavel" value={agendamento.responsavel} onChange={handleChange} placeholder="Responsável" required />
      <textarea name="observacoes" value={agendamento.observacoes} onChange={handleChange} placeholder="Observações" />
      <button type="submit">Agendar</button>
    </form>
  );
}

export default AgendamentoForm;
