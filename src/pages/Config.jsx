import React, { useState } from 'react';
import './Config.css';
import { useNavigate } from 'react-router-dom';
import Main from '../components/template/Main';

function Config() {
  const navigate = useNavigate();

  // Estados para notificações
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);

  const irParaGestaoUsuarios = () => {
    navigate('/gestao-usuarios');
  };

  return (
    <Main
      icon="cogs" 
      title="Configurações"
      subtitle="Configurações do Sistema"
    >
      <div className="config-container">
      

        {/* Usuários e Permissões */}
        <div className="config-section"></div>
        <h3>Usuários e Permissões</h3>
        <button onClick={irParaGestaoUsuarios}>Gestão Usuários</button>

        {/* Notificações */}
        <h3>Notificações</h3>
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
            <div className="switch-btn">
              <input
                type="checkbox"
                checked={pushNotif}
                onChange={() => setPushNotif(!pushNotif)}
              />
              <span className="slider round"></span>
            </div>
          </div>
        </div>

        {/* Integrações */}
        <div className="config-section"></div>
        <h3>Integrações do Sistema</h3>
        <button onClick={irParaGestaoUsuarios}>Integrações do Sistema</button>

        {/* Análise Preditiva */}
        <div className="config-section"></div>
        <h3>Análise preditiva</h3>

        {/* Segurança */}
        <div className="config-section"></div>
        <h3>Segurança</h3>

        <button className="btn-salvar">Salvar Alterações</button>
      </div>
    </Main>
  );
}

export default Config;
