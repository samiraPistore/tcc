import React, { Component } from 'react';
import axios from 'axios';
import './ControleEq.css';
import Main from '../components/template/Main';
import { v4 as uuidv4 } from 'uuid'; // npm install uuid

const headerProps = {
  icon: 'controle',
  title: 'Controle',
  subtitle: 'Cadastro de Equipamentos: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'http://localhost:3010/equipamentos';

const initialState = {
  equipamento: {
    id: '',
    nome_equipamento: '',
    tipo: '',
    local: '',
    estado_atual: ''
  },
  list: []
}

export default class ControleCrud extends Component {
  state = { ...initialState }

  componentDidMount() {
    axios.get(baseUrl).then(resp => {
      this.setState({ list: resp.data })
    }).catch(err => {
      console.error('Erro ao buscar equipamentos:', err)
    });
  }

  clear = () => {
    this.setState({ equipamento: initialState.equipamento });
  }

  save = () => {
    let equipamento = { ...this.state.equipamento };

    if (!equipamento.id) {
      equipamento.id = uuidv4();
    }

    const method = equipamento.id && this.state.list.some(e => e.id === equipamento.id) ? 'put' : 'post';
    const url = method === 'put' ? `${baseUrl}/${equipamento.id}` : baseUrl;

    axios[method](url, equipamento).then(resp => {
      const list = this.getUpdatedList(resp.data);
      this.setState({ equipamento: initialState.equipamento, list });
    }).catch(err => {
      console.error('Erro ao salvar equipamento:', err)
    });
  }

  getUpdatedList(equipamento, add = true) {
    const list = this.state.list.filter(e => e.id !== equipamento.id);
    if (add) list.unshift(equipamento);
    return list;
  }

  updateField = (event) => {
    const { name, value } = event.target;
    const equipamento = { ...this.state.equipamento };
    equipamento[name] = value;
    this.setState({ equipamento });
  }

  load = (equipamento) => {
    this.setState({ equipamento });
  }

  remove = (equipamento) => {
    axios.delete(`${baseUrl}/${equipamento.id}`).then(() => {
      const list = this.getUpdatedList(equipamento, false);
      this.setState({ list });
    }).catch(err => {
      console.error('Erro ao remover equipamento:', err);
    });
  }

  renderForm() {
    return (
      <div className="form-container">
        <div className="form-row">
          <div className="form-group">
            <label>Nome do Equipamento</label>
            <input
              name="nome_equipamento"
              value={this.state.equipamento.nome_equipamento}
              onChange={this.updateField}
              placeholder="Digite o nome"
            />
          </div>

          <div className="form-group">
            <label>Tipo</label>
            <input
              name="tipo"
              value={this.state.equipamento.tipo}
              onChange={this.updateField}
              placeholder="Tipo do equipamento"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Local</label>
            <input
              name="local"
              value={this.state.equipamento.local}
              onChange={this.updateField}
              placeholder="Local onde está instalado"
            />
          </div>

          <div className="form-group">
            <label>Estado Atual</label>
            <select
              name="estado_atual"
              value={this.state.equipamento.estado_atual}
              onChange={this.updateField}
            >
              <option value="">Selecione</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Manutenção">Manutenção</option>
            </select>
          </div>

          <div className="button-group">
            <button className="btn add" onClick={this.save}>
              <i className="fas fa-plus"></i> Salvar
            </button>
            <button className="btn cancel" onClick={this.clear}>
              <i className="fas fa-trash"></i> Cancelar
            </button>
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
            <th>Local</th>
            <th>Estado Atual</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {this.state.list.map(equip => (
            <tr key={equip.id}>
              <td>{equip.nome_equipamento}</td>
              <td>{equip.tipo}</td>
              <td>{equip.local}</td>
              <td>{equip.estado_atual}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => this.load(equip)}>Editar</button>
                <button className="btn btn-danger" onClick={() => this.remove(equip)}>Excluir</button>
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
        <h2>Controle de Equipamentos</h2>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    );
  }
}
