import React, { useEffect, useState } from 'react';

function AgendamentosList() {
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3010/agendamentos')
      .then(res => res.json())
      .then(data => setAgendamentos(data));
  }, []);

  return (
    <div>
      <h2>Agendamentos</h2>
      <ul>
        {agendamentos.map((ag, index) => (
          <li key={index}>
            <strong>{ag.maquina}</strong> - {ag.tipo} - {ag.data} - {ag.responsavel}
            <br />
            {ag.observacoes}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AgendamentosList;