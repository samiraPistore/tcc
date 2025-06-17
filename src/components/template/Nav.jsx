import './Nav.css';
import React from 'react';
import { Link } from 'react-router-dom'

const Nav = ({ handleLogout }) => (
    <aside className="menu-area">
        <nav className="menu">
            <Link to="/">
                <i className="fa fa-home"></i> Início
            </Link>
            <Link to="/ControleEq.jsx">
                <i className="fa fa-users"></i> Controle Equipamentos
            </Link>
            <Link to="/HistoricoMa.jsx">
                <i className="fa fa-users"></i> Histórico de Manutenção
            </Link>
            <Link to="/RelatorioAn.jsx">
                <i className="fa fa-users"></i> Relatórios e Análises
            </Link>
            <Link to="/PrevisoesFal.jsx">
                <i className="fa fa-users"></i> Previsões de Falha
            </Link>
            <Link to="/AgendaManu.jsx">
                <i className="fa fa-users"></i> Agendamento de Manutenção
            </Link>
            <Link to="/AlertasNoti.jsx">
                <i className="fa fa-users"></i> Alertas e Notificações
            </Link>
            <Link to="/GestaoUsers.jsx">
                <i className="fa fa-users"></i> Gestão de Usuários
            </Link>
            <Link to="/config.jsx">
                <i className="fa fa-users"></i> Configurações do Sistema
            </Link>

            <button onClick={handleLogout}>Sair</button>
        </nav>
    </aside>
)
export default Nav;
