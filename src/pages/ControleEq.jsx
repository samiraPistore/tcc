import React, { Component } from 'react';
import axios from 'axios';
import './ControleEq.css';
import Main from '../components/template/Main';

/*
const Controle = () => {
  <Main>
    return (
    <div>
        <button>
            Teste
        </button>
    </div>e

);

</Main>
}
*/




// CODIGO BASE PROF 


const headerProps = {
    icon: 'controle',
    title: 'Controle',
    subtitle: 'Cadastro de Equipamentos: Incluir, Listar, Alterar e Excluir!'
}

// Define a URL base da API
const baseUrl = 'http://localhost:3010/equipamentos'

const initialState = {
    equipamento: { nome: '', tipo: '', descricao: '', parametrosMonitorados: ''},
    list: []
}

// Componente de classe para CRUD de usuários
export default class ControleCrud extends Component{
    state = { ...initialState}


   componentDidMount() {
  axios.get(baseUrl).then(resp => {
    this.setState({ list: resp.data })
  })
}



    clear(){
        this.setState({
            equipamento: initialState.equipamento
        })
    }


    save = () => {
        const equipamento = this.state.equipamento
        const method = equipamento.id ? 'put': "post"
        const url = equipamento.id ? `${baseUrl}/${equipamento.id}` : baseUrl
        axios[method](url, equipamento)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({
                    equipamento: initialState.equipamento,
                    list
                })
            })
    }


    getUpdatedList(equipamento, add = true){
        const list = this.state.list.filter(u => u.id !== equipamento.id)
        if(add) list.unshift(equipamento)
            return list
    }


    updateField = (event) => {
        const equipamento = {
            ...this.state.equipamento
        };
        equipamento[event.target.name] = event.target.value;
        this.setState({ equipamento });
    }


    load(equipamento){
        this.setState({ equipamento })
    }


    remove(equipamento){
        axios.delete(`${baseUrl}/${equipamento.id}`).then(resp => {
            const list = this.getUpdatedList(equipamento, false)
            this.setState({ list })
        })
    }

  renderForm() {
        return (
            <div className="form-container">
                <div className="form-row">
                    <div className="form-group">
                        <label>Equipamento</label>
                        <input name="nome" value={this.state.equipamento.nome}
                            onChange={this.updateField} placeholder="Nome" />
                    </div>
                    <div className="form-group">
                        <label>Tipo de Equipamento</label>
                        <input name="tipo" value={this.state.equipamento.tipo}
                            onChange={this.updateField} placeholder="Digite aqui" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Descrição</label>
                        <textarea name="descricao" value={this.state.equipamento.descricao}
                            onChange={this.updateField} placeholder="Escreva uma descrição" />
                    </div>

                    <div className="form-group">
                        <label>Parâmetros Monitorados</label>
                        <select name="parametrosMonitorados"
                            value={this.state.equipamento.parametrosMonitorados}
                            onChange={this.updateField}>
                            <option value="">Selecione</option>
                            <option value="Peças">Peças</option>
                            <option value="Temperatura">Temperatura</option>
                            <option value="Vibração">Vibração</option>
                        </select>

                        <div className="button-group">
                            <button className="btn add" onClick={this.save}>
                                <i className="fas fa-plus"></i> Adicionar
                            </button>
                            <button className="btn cancel" onClick={this.clear}>
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderTable() {
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Descrição</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.list.map(equip => (
                        <tr key={equip.id}>
                            <td>{equip.nome}</td>
                            <td>{equip.tipo}</td>
                            <td>{equip.descricao}</td>
                            <td>
                                <button onClick={() => this.load(equip)}>Editar</button>
                                <button onClick={() => this.remove(equip)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }

    render() {
        return (
            <Main {...headerProps}>
                <h2>Controle Equipamentos</h2>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        );
    }
}
