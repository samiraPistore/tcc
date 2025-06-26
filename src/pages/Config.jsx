import React, {useState} from 'react';
import './Config.css';
import { useNavigate } from 'react-router-dom';

function Config() {
    const navigate = useNavigate();


    // Estados para notificações
    const [emailNotif, setEmailNotif] = useState(true);
    const [smsNotif, setSmsNotif] = useState(false);
    const [pushNotif, setPushNotif] = useState(true);


    const irParaGestaoUsuarios = () => {
        navigate('/gestao-usuarios');
    };
    /*
    const irParaIntegraçoes = () => {
        navigate('/')
    }*/

  return (
    <div className="config-container">
      <h2 className="config-title"> Configurações do Sistema</h2>
      
      {/* Usuários e Permissões */}
        <div className="config-section"></div>
        <h3>Usuarios e Permissões</h3>
        <button onClick={irParaGestaoUsuarios}>Gestão Usuarios</button>

      {/* Notificações */}
        <div className="switch-row"></div>
        <h3>Notificações</h3>
        <label className="switch">
             <span>Notificação por E-mail</span>
            <input type="checkbox" checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)}
             />
        </label>
        <label className="switch">
        <span>Notificação por SMS</span>
            <input type="checkbox" checked={smsNotif} onChange={() => setSmsNotif(!smsNotif)}
             />
        </label>
        <label className="switch">
        <span>Notificação Push</span>
            <input type="checkbox" checked={pushNotif} onChange={() => setPushNotif(!pushNotif)}
             />
            <span className="slider round"></span>
        </label>
        


   
      {/* Integrações */}
        <div className="config-section"></div>
        <h3>Integrações do Sistema</h3>
        <button onClick={irParaGestaoUsuarios}>Integrações do Sistema</button>
        
      {/* Análise Preditiva */}
        <div className="config-section"></div>
        <h3>Analise preditiva</h3>
        
      {/* Segurança */}
        <div className="config-section"></div>
        <h3>Segurança</h3>

      <button className="btn-salvar">Salvar Alterações</button>
    </div>
  );
};

export default Config;
