import './Nav.css';
import React from 'react';
import { Link } from 'react-router-dom'

const Nav = ({ handleLogout }) => (
    <aside className="menu-area">
        <nav className="menu">
            <Link to="/">
                <i className="fa fa-home"></i> Início
            </Link>

            <Link to="/equipamentos">
                <i className="fa fa-gamepad"></i> Controle Equipamentos
            </Link>

            <Link to="/agenda-manutencao">
                <i className="fa fa-calendar-check-o"></i> Agendamento de Manutenção
            </Link>

            <Link to="/historico">
                <i className="fa fa-history"></i> Histórico de Manutenção
            </Link>

            <Link to="/alertas">
                <i className="fa fa-bell"></i> Alertas e Notificações
            </Link>

            <Link to="/previsoes">
                <i className="fa fa-line-chart"></i> Previsões de Falha
            </Link>
            
            <Link to="/relatorios">
                <i className="fa fa-bar-chart"></i> Relatórios e Análises
            </Link>

            <Link to="/configuracoes">
                <i className="fa fa-sliders"></i> Configurações do Sistema
            </Link>

            <button onClick={handleLogout}>Sair</button>
        </nav>
    </aside>
)
export default Nav;
