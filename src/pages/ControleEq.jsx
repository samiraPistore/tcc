import React, { Component } from 'react';
import axios from 'axios';
import './ControleEq.css';
import Main from '../components/template/Main';

// Configuração do cabeçalho que será passado para o componente Main
const headerProps = {
  icon: 'gamepad',
  title: 'Controle',
  subtitle: 'Cadastro de Equipamentos e Sensores'
};

// URLs base para as requisições de equipamentos e sensores
const baseUrlEquip = 'http://localhost:3010/equipamentos';
const baseUrlSensor = 'http://localhost:3010/sensores';

// Estado inicial do componente com estrutura para equipamentos, sensores e controle da UI
const initialState = {
  equipamento: {
    id: '',
    nome_equipamento: '',
    modelo: '',
    local: '',
    status: '',
    fabricante: '',
    ano_aquisicao: '',
    descricao: ''
  },
  listEquipamentos: [],

  sensor: {
    id: '',
    equipamentoId: '',
    nome_sensor: '',
    tipo_sensor: ''
  },
  listSensores: [],

  equipamentoSelecionadoParaSensor: null,  // Guarda o equipamento que está selecionado para gerenciar sensores
  showSensorForm: false                     // Controla a visibilidade do formulário de sensores
};

export default class ControleCrud extends Component {
  state = { ...initialState };

  componentDidMount() {
    this.loadEquipamentos();
  }

  loadEquipamentos() {
    axios.get(baseUrlEquip)
      .then(resp => {
        this.setState({ listEquipamentos: resp.data });
      })
      .catch(err => {
        console.error('Erro ao carregar equipamentos:', err);
      });
  }

  loadSensores(equipamentoId) {
    axios.get(`${baseUrlSensor}?equipamento_id=${equipamentoId}`)
      .then(resp => {
        this.setState({ listSensores: resp.data });
      })
      .catch(err => {
        console.error('Erro ao carregar sensores:', err);
      });
  }

  clearEquipamento() {
    this.setState({ equipamento: initialState.equipamento });
  }

  clearSensor() {
    this.setState({ sensor: initialState.sensor });
  }

  saveEquipamento = (e) => {
    e.preventDefault();
    const equipamento = this.state.equipamento;
    const method = equipamento.id ? 'put' : 'post';
    const url = equipamento.id ? `${baseUrlEquip}/${equipamento.id}` : baseUrlEquip;

    axios[method](url, equipamento)
      .then(() => {
        this.loadEquipamentos();
        this.setState({ equipamento: initialState.equipamento });
      })
      .catch(err => {
        console.error('Erro ao salvar equipamento:', err);
      });
  }

  saveSensor = (e) => {
    e.preventDefault();
    const sensor = this.state.sensor;
    const sensorParaEnviar = {
      nome: sensor.nome_sensor,
      tipo: sensor.tipo_sensor,
      equipamento_id: sensor.equipamentoId
    };
    const method = sensor.id ? 'put' : 'post';
    const url = sensor.id ? `${baseUrlSensor}/${sensor.id}` : baseUrlSensor;

    axios[method](url, sensorParaEnviar)
      .then(() => {
        this.loadSensores(sensor.equipamentoId);
        this.clearSensor();
        this.setState({ showSensorForm: false });
      })
      .catch(err => {
        console.error('Erro ao salvar sensor:', err);
      });
  }

  updateFieldEquipamento = (event) => {
    const equipamento = { ...this.state.equipamento };
    equipamento[event.target.name] = event.target.value;
    this.setState({ equipamento });
  }

  updateFieldSensor = (event) => {
    const sensor = { ...this.state.sensor };
    sensor[event.target.name] = event.target.value;
    this.setState({ sensor });
  }

  loadEquipamento = (equipamento) => {
    this.setState({ equipamento });
  }

  removeEquipamento(equipamento) {
    axios.delete(`${baseUrlEquip}/${equipamento.id}`)
      .then(() => {
        this.loadEquipamentos();
      })
      .catch(err => {
        console.error('Erro ao remover equipamento:', err);
      });
  }

  removeSensor(sensor) {
    axios.delete(`${baseUrlSensor}/${sensor.id}`)
      .then(() => {
        this.loadSensores(sensor.equipamentoId);
      })
      .catch(err => {
        console.error('Erro ao remover sensor:', err);
      });
  }

  openSensorForm = (equipamento) => {
    this.setState({
      equipamentoSelecionadoParaSensor: equipamento,
      sensor: { ...initialState.sensor, equipamentoId: equipamento.id },
      showSensorForm: true
    }, () => {
      this.loadSensores(equipamento.id);
    });
  }

  closeSensorForm = () => {
    this.setState({
      showSensorForm: false,
      equipamentoSelecionadoParaSensor: null,
      listSensores: [],
      sensor: initialState.sensor
    });
  }

  renderFormEquipamento() {
    const eq = this.state.equipamento;
    return (
      <form className="form-container" onSubmit={this.saveEquipamento}>
        <div className="form-row">
          <div className="form-group">
            <label>Nome do Equipamento</label>
            <input
              name="nome_equipamento"
              value={eq.nome_equipamento}
              onChange={this.updateFieldEquipamento}
              placeholder="Digite o nome"
              required
            />
          </div>

          <div className="form-group">
            <label>Modelo</label>
            <input
              name="modelo"
              value={eq.modelo}
              onChange={this.updateFieldEquipamento}
              placeholder="Modelo do equipamento"
            />
          </div>

          <div className="form-group">
            <label>Local</label>
            <input
              name="local"
              value={eq.local}
              onChange={this.updateFieldEquipamento}
              placeholder="Local onde está instalado"
              required
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={eq.status}
              onChange={this.updateFieldEquipamento}
              required
            >
              <option value="">Selecione</option>
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Manutenção">Manutenção</option>
              <option value="Desativado">Desativado</option>
            </select>
          </div>

          <div className="form-group">
            <label>Fabricante</label>
            <input
              name="fabricante"
              value={eq.fabricante}
              onChange={this.updateFieldEquipamento}
              placeholder="Nome do fabricante"
            />
          </div>

          <div className="form-group">
            <label>Ano de Aquisição</label>
            <input
              type="number"
              name="ano_aquisicao"
              value={eq.ano_aquisicao}
              onChange={this.updateFieldEquipamento}
              placeholder="Ano de aquisição"
              min="2000"
              max={new Date().getFullYear()}
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              name="descricao"
              value={eq.descricao}
              onChange={this.updateFieldEquipamento}
              placeholder="Descrição adicional"
              rows={3}
            />
          </div>
        </div>

        <div className="button-group">
          <button className="btn add me-2" type="submit">Salvar</button>
          <button className="btn cancel" type="button" onClick={() => this.clearEquipamento()}>Cancelar</button>
        </div>
      </form>
    );
  }

  renderTableEquipamentos() {
    return (
      <div className="table-wrapper">
        <table className="table mt-4">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Modelo</th>
              <th>Local</th>
              <th>Status</th>
              <th>Fabricante</th>
              <th>Ano</th>
              <th>Descrição</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {this.state.listEquipamentos.map(equip => (
              <tr key={equip.id}>
                <td>{equip.nome_equipamento}</td>
                <td>{equip.modelo}</td>
                <td>{equip.local}</td>
                <td>{equip.status}</td>
                <td>{equip.fabricante}</td>
                <td>{equip.ano_aquisicao}</td>
                <td>{equip.descricao}</td>
                <td>
                  <button className="btn btn-warning me-2" onClick={() => this.loadEquipamento(equip)}>Editar</button>
                  <button className="btn btn-danger me-2" onClick={() => this.removeEquipamento(equip)}>Excluir</button>
                  <button className="btn btn-info" onClick={() => this.openSensorForm(equip)}>Sensores</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  renderFormSensor() {
    const s = this.state.sensor;
    return (
      <form className="form-container sensor-form" onSubmit={this.saveSensor}>
        <h4>Adicionar/Editar Sensor para: {this.state.equipamentoSelecionadoParaSensor?.nome_equipamento}</h4>
        <div className="form-row">
          <div className="form-group">
            <label>Nome do Sensor</label>
            <input
              name="nome_sensor"
              value={s.nome_sensor}
              onChange={this.updateFieldSensor}
              placeholder="Nome do sensor"
              required
            />
          </div>
          <div className="form-group">
            <label>Tipo do Sensor</label>
            <input
              name="tipo_sensor"
              value={s.tipo_sensor}
              onChange={this.updateFieldSensor}
              placeholder="Tipo do sensor"
            />
          </div>
        </div>

        <div className="button-group">
          <button className="btn add me-2" type="submit">Salvar Sensor</button>
          <button className="btn cancel" type="button" onClick={this.closeSensorForm}>Cancelar</button>
        </div>

        {this.renderTableSensores()}
      </form>
    );
  }

  renderTableSensores() {
    return (
      <table className="table mt-3">
        <thead>
          <tr>
            <th>Nome Sensor</th>
            <th>Tipo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {this.state.listSensores.map(sensor => (
            <tr key={sensor.id}>
              <td>{sensor.nome}</td>
              <td>{sensor.tipo}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => this.setState({
                  sensor: {
                    id: sensor.id,
                    equipamentoId: sensor.equipamento_id,
                    nome_sensor: sensor.nome,
                    tipo_sensor: sensor.tipo
                  },
                  showSensorForm: true
                })}>Editar</button>
                <button className="btn btn-danger" onClick={() => this.removeSensor(sensor)}>Excluir</button>
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
        {this.renderFormEquipamento()}
        {this.renderTableEquipamentos()}
        {this.state.showSensorForm && this.renderFormSensor()}
      </Main>
    );
  }
}
