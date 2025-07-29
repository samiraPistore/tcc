import React, { useState } from 'react';
import './Config.css';
import { useNavigate } from 'react-router-dom';
import Main from '../components/template/Main';

function Config() {
  const navigate = useNavigate();

  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);

  const irParaGestaoUsuarios = () => {
    navigate('/gestao-usuarios');
  };

  const irParaIntegracoesDoSistema = () => {
    navigate('/integraco');
  };

  const salvarPreferencias = async () => {
    try {
      const resposta = await fetch('http://localhost:3010/configuracoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailNotif,
          smsNotif,
          pushNotif,
        }),
      });

      const dados = await resposta.json();
      if (resposta.ok) {
        alert('✅ Preferências salvas com sucesso!');
      } else {
        alert('❌ Erro ao salvar: ' + dados.msg);
      }
    } catch (err) {
      console.error('Erro ao salvar preferências:', err);
      alert('❌ Falha na comunicação com o servidor.');
    }
  };

  return (
    <Main icon="cogs" title="Configurações" subtitle="Configurações do Sistema">
      <div className="config-container">
        <div className="config-section"></div>
        <h3>Usuários e Permissões</h3>
        <button onClick={irParaGestaoUsuarios}>Gestão Usuários</button>

        <h3 className='notificacoes'>Notificações</h3>
        <div className="switch-row">
          <div className="switch">
            <span>Notificação por E-mail</span>
            <input
              type="checkbox"
              checked={emailNotif}
              onChange={() => setEmailNotif(!emailNotif)}
            />
          </div>

          <div className="switch">
            <span>Notificação por SMS</span>
            <input
              type="checkbox"
              checked={smsNotif}
              onChange={() => setSmsNotif(!smsNotif)}
            />
          </div>

          <div className="switch">
            <span>Notificação Push</span>
            <input
              type="checkbox"
              checked={pushNotif}
              onChange={() => setPushNotif(!pushNotif)}
            />
          </div>
        </div>

        <div className="config-section"></div>
        <h3>Integrações do Sistema</h3>
        <button onClick={irParaIntegracoesDoSistema}>Integrações do Sistema</button>

        <div className="config-section"></div>
        <h3>Análise Preditiva</h3>

        <div className="config-section"></div>
        <h3>Segurança</h3>

        <button className="btn-salvar" onClick={salvarPreferencias}>Salvar Alterações</button>
      </div>
    </Main>
  );
}

export default Config;
