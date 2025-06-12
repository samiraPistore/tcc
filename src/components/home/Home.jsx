import React from 'react';
import Main from '../template/Main';

const Home = () => (
    <Main icon="home" title="Inicio" subtitle="Primeiro Projeto do capitulo de React." >
        <div className='display-4'>Bem Vindo!</div>
        <hr/>
        <p className='mb-0'>Sistempa para exemplificar a construção de um cadastro desenvolvido em React!</p>
    </Main>
);
export default Home;