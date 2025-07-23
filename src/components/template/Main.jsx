import './Main.css';
import React from 'react';
import Header from './Header';

const Main = (props) => (
  <>
    <Header {...props} />
    <main className="content">
      <div className="main-wrapper">
        {/* Conteúdo dinâmico das páginas será inserido aqui */}
        {props.children}
      </div>
    </main>
  </>
);

export default Main;
