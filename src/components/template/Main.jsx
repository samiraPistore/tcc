import './Main.css';
import React from 'react';
import Header from './Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const Main = (props) => (
  <>
    <Header {...props} />
    <main className="content">
      <div className="main-wrapper">
        {/* Conteúdo dinâmico das páginas será inserido aqui */}
        {props.children}
      </div>
      <div className='scroll-container'></div>
    </main>
  </>
);

export default Main;
