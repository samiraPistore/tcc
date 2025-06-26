import React, { Component } from "react";
import axios from "axios";
import Main from "../template/Main";
import "./ConfigSistem.css";

const headerProps = {
  icon: "cogs",
  title: "Configurações do Sistema",
  subtitle: "Gerencie parâmetros, segurança e integrações.",
};

const baseUrl = "http://localhost:3001/configs"; // Simulando backend de configs

const initialState = {
  predictiveParam: "",
  configs: [], // Exemplo futuro: carregar configs existentes
};

export default class ConfigSistem extends Component {
  state = { ...initialState };

  componentDidMount() {
    axios(baseUrl).then((resp) => {
      this.setState({ configs: resp.data });
    }).catch(err => {
      console.log("Erro ao carregar configs:", err);
    });
  }

  updateField(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  saveConfig() {
    const config = {
      predictiveParam: this.state.predictiveParam,
    };

    axios
      .post(baseUrl, config)
      .then((resp) => {
        alert("Configuração salva com sucesso!");
        this.setState({ predictiveParam: "" });
      })
      .catch((err) => {
        console.error("Erro ao salvar configuração:", err);
        alert("Erro ao salvar configuração");
      });
  }

  render() {
    return (
      <Main {...headerProps}>
        <div className="config-container">
          {/* Usuários e Permissões */}
          <section className="config-section">
            <h3>Usuários e Permissões</h3>
            <div className="button-group">
              <button className="btn-outline">Configurações de Usuários</button>
              <button className="btn-outline">Permissões de Acesso</button>
            </div>
          </section>

          <hr />

          {/* Integrações */}
          <section className="config-section">
            <h3>Integrações</h3>
            <button className="btn-primary">Configurar Integrações</button>
          </section>

          <hr />

          {/* Análise Preditiva */}
          <section className="config-section">
            <h3>Análise Preditiva</h3>
            <input
              type="text"
              className="input-field"
              name="predictiveParam"
              value={this.state.predictiveParam}
              onChange={(e) => this.updateField(e)}
              placeholder="Parâmetros de análise"
            />
            <button className="btn btn-success mt-2" onClick={() => this.saveConfig()}>
              Salvar Parâmetro
            </button>
          </section>

          <hr />

          {/* Segurança */}
          <section className="config-section">
            <h3>Segurança</h3>
            <div className="button-group">
              <button className="btn-outline">Alterar Senha</button>
              <button className="btn-outline">Autenticação em duas etapas</button>
              <button className="btn-outline">Postamento</button>
            </div>
          </section>
        </div>
      </Main>
    );
  }
}
