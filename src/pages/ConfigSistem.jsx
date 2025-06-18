import React from 'react';
import Main from '../template/Main';
import './ConfigSistem.css';

const configuracoes = () => {
  return (
    <Main icon="cogs" title="Configurações do Sistema" subtitle="Gerencie parâmetros, segurança e integrações.">
      <div className="config-container">

        {/* 🔐 Usuários e Permissões */}
        <section className="config-section">
          <h3>Usuários e Permissões</h3>
          <div className="button-group">
            <button className="btn-outline">Configurações de Usuários</button>
            <button className="btn-outline">Permissões de Acesso</button>
          </div>
        </section>

        <hr />

        {/* 🔗 Integrações */}
        <section className="config-section">
          <h3>Integrações</h3>
          <button className="btn-primary">Configurar Integrações</button>
        </section>

        <hr />

        {/* 📊 Análise preditiva */}
        <section className="config-section">
          <h3>Análise Preditiva</h3>
          <input
            type="text"
            className="input-field"
            placeholder="Parâmetros de análise"
          />
        </section>

        <hr />

        {/* 🔒 Segurança */}
        <section className="config-section">
          <h3>Segurança</h3>
          <div className="button-group">
            <button className="btn-outline">Alterar Senha</button>
            <button className="btn-outline">Autenticação em duas etapas</button>
            <button className="btn-outline">🔒 Postamento</button>
          </div>
        </section>

      </div>
    </Main>
  );
};

export default configuracoes;
