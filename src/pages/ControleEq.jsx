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
  // Inicializa o estado do componente com a estrutura inicial
  state = { ...initialState };

  // Método do ciclo de vida do React: executa quando o componente é montado
  componentDidMount() {
    this.loadEquipamentos();  // Chama para carregar a lista de equipamentos do backend
  }

  // Método para carregar equipamentos da API e atualizar o estado
  loadEquipamentos() {
    axios.get(baseUrlEquip)
      .then(resp => {
        this.setState({ listEquipamentos: resp.data }); // Atualiza a lista de equipamentos
      })
      .catch(err => {
        console.error('Erro ao carregar equipamentos:', err); // Log de erro caso a requisição falhe
      });
  }

  // Método para carregar sensores associados a um equipamento específico
  loadSensores(equipamentoId) {
    axios.get(`${baseUrlSensor}?equipamento_id=${equipamentoId}`)
      .then(resp => {
        this.setState({ listSensores: resp.data });  // Atualiza lista de sensores no estado
      })
      .catch(err => {
        console.error('Erro ao carregar sensores:', err);
      });
  }

  // Método para limpar o formulário de equipamento, resetando os valores
  clearEquipamento() {
    this.setState({ equipamento: initialState.equipamento });
  }

  // Método para limpar o formulário de sensor, resetando os valores
  clearSensor() {
    this.setState({ sensor: initialState.sensor });
  }

  // Salvar equipamento: cria novo ou atualiza um existente (PUT ou POST)
  saveEquipamento = (e) => {
    e.preventDefault();  // Previne o comportamento padrão do form (reload da página)
    const equipamento = this.state.equipamento;

    // Define método HTTP e URL dependendo se o equipamento tem id (editar) ou não (criar)
    const method = equipamento.id ? 'put' : 'post';
    const url = equipamento.id ? `${baseUrlEquip}/${equipamento.id}` : baseUrlEquip;

    // Realiza a requisição para salvar
    axios[method](url, equipamento)
      .then(() => {
        this.loadEquipamentos();  // Atualiza lista de equipamentos na tela
        this.setState({ equipamento: initialState.equipamento }); // Limpa formulário
      })
      .catch(err => {
        console.error('Erro ao salvar equipamento:', err);
      });
  }

  // Salvar sensor: cria novo ou atualiza um existente
  saveSensor = (e) => {
    e.preventDefault();
    const sensor = this.state.sensor;

    // Ajusta os nomes dos campos para enviar para a API
    const sensorParaEnviar = {
      nome: sensor.nome_sensor,
      tipo: sensor.tipo_sensor,
      equipamento_id: sensor.equipamentoId
    };

    // Define método HTTP e URL para criar ou atualizar
    const method = sensor.id ? 'put' : 'post';
    const url = sensor.id ? `${baseUrlSensor}/${sensor.id}` : baseUrlSensor;

    // Realiza a requisição para salvar sensor
    axios[method](url, sensorParaEnviar)
      .then(() => {
        this.loadSensores(sensor.equipamentoId); // Atualiza lista de sensores após salvar
        this.clearSensor();                      // Limpa formulário de sensor
        this.setState({ showSensorForm: false }); // Fecha formulário de sensor
      })
      .catch(err => {
        console.error('Erro ao salvar sensor:', err);
      });
  }

  // Atualiza estado do equipamento conforme mudanças nos inputs do formulário
  updateFieldEquipamento = (event) => {
    const equipamento = { ...this.state.equipamento };
    equipamento[event.target.name] = event.target.value;
    this.setState({ equipamento });
  }

  // Atualiza estado do sensor conforme inputs do formulário
  updateFieldSensor = (event) => {
    const sensor = { ...this.state.sensor };
    sensor[event.target.name] = event.target.value;
    this.setState({ sensor });
  }

  // Carrega equipamento selecionado para edição no formulário
  loadEquipamento = (equipamento) => {
    this.setState({ equipamento });
  }

  // Remove equipamento da API e atualiza lista na tela
  removeEquipamento(equipamento) {
    axios.delete(`${baseUrlEquip}/${equipamento.id}`)
      .then(() => {
        this.loadEquipamentos();
      })
      .catch(err => {
        console.error('Erro ao remover equipamento:', err);
      });
  }

  // Remove sensor da API e atualiza lista na tela
  removeSensor(sensor) {
    axios.delete(`${baseUrlSensor}/${sensor.id}`)
      .then(() => {
        this.loadSensores(sensor.equipamentoId);
      })
      .catch(err => {
        console.error('Erro ao remover sensor:', err);
      });
  }

  // Abre o formulário de sensores para um equipamento selecionado
  openSensorForm = (equipamento) => {
    this.setState({
      equipamentoSelecionadoParaSensor: equipamento,                // Salva equipamento selecionado
      sensor: { ...initialState.sensor, equipamentoId: equipamento.id }, // Inicializa formulário de sensor com equipamentoId
      showSensorForm: true                                           // Mostra formulário de sensor
    }, () => {
      this.loadSensores(equipamento.id);                             // Carrega sensores do equipamento
    });
  }

  // Fecha formulário de sensor e limpa estado relacionado
  closeSensorForm = () => {
    this.setState({ 
      showSensorForm: false, 
      equipamentoSelecionadoParaSensor: null, 
      listSensores: [], 
      sensor: initialState.sensor 
    });
  }

  // Renderiza o formulário de equipamento (novo/editar)
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

  // Renderiza tabela com equipamentos e ações de editar, excluir e abrir sensores
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

  // Renderiza formulário para adicionar/editar sensores de um equipamento selecionado
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

  // Renderiza tabela com sensores do equipamento selecionado, com ações editar e excluir
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

  // Render principal do componente: mostra o layout geral
  render() {
    return (
      <Main {...headerProps}>
        <h2>Controle de Equipamentos</h2>
        {this.renderFormEquipamento()}          {/* Formulário equipamento */}
        {this.renderTableEquipamentos()}        {/* Tabela equipamentos */}
        {this.state.showSensorForm && this.renderFormSensor()}  {/* Formulário sensores, condicional */}
      </Main>
    );
  }
}
