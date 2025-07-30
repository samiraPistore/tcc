import React, { useState, useEffect } from 'react';
import './Config.css';
import { useNavigate } from 'react-router-dom';
import Main from '../components/template/Main';

function Config() {
  const navigate = useNavigate();

  const [emailNotif, setEmailNotif] = useState(null);
  const [smsNotif, setSmsNotif] = useState(null);
  const [pushNotif, setPushNotif] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    // Buscar configurações ao montar o componente
    async function fetchConfig() {
      try {
        const res = await fetch('http://localhost:3010/configuracoes');
        if (res.ok) {
          const data = await res.json();
          setEmailNotif(data.email_notif);
          setSmsNotif(data.sms_notif);
          setPushNotif(data.push_notif);
        } else {
          setMsg('Não foi possível carregar as configurações.');
        }
      } catch (err) {
        setMsg('Erro ao comunicar com o servidor.');
      }
    }

    fetchConfig();
  }, []);

  const salvarPreferencias = async () => {
    setLoading(true);
    setMsg('');
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
        setMsg('✅ Preferências salvas com sucesso!');
      } else {
        setMsg('❌ Erro ao salvar: ' + dados.msg);
      }
    } catch (err) {
      setMsg('❌ Falha na comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Main icon="cogs" title="Configurações" subtitle="Configurações do Sistema">
      <div className="config-container">
        <div className="config-section"></div>
        <h3>Usuários e Permissões</h3>
        <button onClick={() => navigate('/gestao-usuarios')}>Gestão Usuários</button>

        <h3 className="notificacoes">Notificações</h3>
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
        <button onClick={() => navigate('/integraco')}>Integrações do Sistema</button>

        <div className="config-section"></div>
        <h3>Análise Preditiva</h3>

        <div className="config-section"></div>
        <h3>Segurança</h3>

        <button
          className="btn-salvar"
          onClick={salvarPreferencias}
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Alterações'}
        </button>

        {msg && <p className="mensagem-feedback">{msg}</p>}
      </div>
    </Main>
  );
}

export default Config;
