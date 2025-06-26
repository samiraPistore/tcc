import React from 'react';
import './GestaoUsers.css';

const GestaoUsers = () => {
  const cadastrarSamira = async () => {
    try {
      const res = await fetch('http://localhost:3010/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Samira',
          email: 'samira@email.com',
          senha: '123456',
          cargo: 'admin'
        })
      });

      const data = await res.json();
      console.log('[Cadastro]:', data);

      if (res.ok) {
        alert('Usuário cadastrado com sucesso!');
      } else {
        alert(`Erro: ${data.msg}`);
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      alert('Erro ao conectar com o servidor.');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Cadastro Manual</h2>
      <button onClick={cadastrarSamira}>Cadastrar Samira</button>
    </div>
  );
};

export default GestaoUsers;
