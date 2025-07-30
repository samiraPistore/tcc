// Importações de bibliotecas e estilos
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./AgendaManu.css";

const AgendaManu = () => {
  const [equipamentosDisponiveis, setEquipamentosDisponiveis] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [form, setForm] = useState({
    equipamentoId: "",
    data: "",
    status: "",
    tecnico: "",
    descricao: "",
  });
  const [dataSelecionada, setDataSelecionada] = useState(new Date());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [resEquipamentos, resUsuarios] = await Promise.all([
          fetch("http://localhost:3010/equipamentos"),
          fetch("http://localhost:3010/users"),
        ]);

        if (!resEquipamentos.ok || !resUsuarios.ok)
          throw new Error("Erro ao carregar dados");

        const equipamentos = await resEquipamentos.json();
        const usuarios = await resUsuarios.json();

        const tecnicosFiltrados = usuarios.filter(
          (u) => u.cargo?.toLowerCase() === "tecnico"
        );

        setEquipamentosDisponiveis(equipamentos);
        setTecnicos(tecnicosFiltrados);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    }

    carregarDados();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date) => {
    setDataSelecionada(date);
    const dataFormatada = date.toISOString().split("T")[0];
    setForm((prev) => ({ ...prev, data: dataFormatada }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para agendar.");
      return;
    }

    const payload = {
      equipamento_id: form.equipamentoId,
      data_manutencao: form.data,
      status: form.status,
      responsavel_id: form.tecnico, // <-- aqui vai o ID do técnico
      descricao: form.descricao,
    };

    console.log("Payload enviado:", payload);

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3010/manutencoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Manutenção agendada com sucesso!");
        setForm({
          equipamentoId: "",
          data: "",
          status: "",
          tecnico: "",
          descricao: "",
        });
      } else {
        const data = await response.json();
        alert(`Erro: ${data.msg || "Não foi possível agendar"}`);
      }
    } catch (error) {
      console.error("Erro ao enviar agendamento:", error);
      alert("Erro ao enviar agendamento, tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="agenda-container">
      <div className="calendario">
        <Calendar value={dataSelecionada} onChange={handleDateChange} />
      </div>

      <form onSubmit={handleSubmit} className="formulario">
        <h2>Nova Manutenção</h2>

        <label>
          Equipamento:
          <select
            value={form.equipamentoId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, equipamentoId: e.target.value }))
            }
          >
            <option value="">Selecione um equipamento</option>
            {equipamentosDisponiveis.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.nome_equipamento}
              </option>
            ))}
          </select>
        </label>

        <label>
          Data:
          <input
            type="date"
            name="data"
            value={form.data}
            onChange={handleChange}
          />
        </label>

        <label>
          Status:
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="">Selecione o status</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Andamento">Em Andamento</option>
          </select>
        </label>

        <label>
          Técnico:
          <select
            name="tecnico"
            value={form.tecnico}
            onChange={handleChange}
          >
            <option value="">Selecione um técnico</option>
            {tecnicos.map((tecnico) => (
              <option key={tecnico.id} value={tecnico.id}>
                {tecnico.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Descrição:
          <textarea
            name="descricao"
            value={form.descricao}
            onChange={handleChange}
            placeholder="(opcional)"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
};

export default AgendaManu;
