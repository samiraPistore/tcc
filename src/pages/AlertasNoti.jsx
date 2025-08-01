import React, { useState, useEffect, useRef } from 'react'; 
import './AlertasNoti.css';

const AlertasNoti = () => {
  const [alertas, setAlertas] = useState([]);
  const [gravidade, setGravidade] = useState('Todos');
  const [equipamentos, setEquipamentos] = useState([]);
  const [equipamentoSelecionado, setEquipamentoSelecionado] = useState('Todos');
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [pushNotifAtivada, setPushNotifAtivada] = useState(true);

  const audioRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const [alertasResp, equipamentosResp, configResp] = await Promise.all([
          fetch('http://localhost:3010/alertas'),
          fetch('http://localhost:3010/equipamentos'),
          fetch('http://localhost:3010/configuracoes'),
        ]);

        if (!alertasResp.ok || !equipamentosResp.ok || !configResp.ok) {
          throw new Error('Erro ao buscar dados');
        }

        const alertasData = await alertasResp.json();
        const equipamentosData = await equipamentosResp.json();
        const configData = await configResp.json();

        const alertasConvertidos = alertasData.map((a) => ({
          ...a,
          nivel_gravidade: String(a.nivel_gravidade)
        }));

        setAlertas(alertasConvertidos);
        setEquipamentos(equipamentosData);
        setPushNotifAtivada(!!configData.push_notif);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setPushNotifAtivada(true);
      }
    };

    buscarDados();
  }, []);

  useEffect(() => {
    if (pushNotifAtivada && alertas.length > 0) {
      exibirAlerta();
    } else {
      setMostrarAlerta(false);
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [alertas, pushNotifAtivada]);

  const exibirAlerta = async () => {
    if (!pushNotifAtivada) return;

    setMostrarAlerta(true);

    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (err) {
        console.error('Erro ao tocar áudio:', err);
      }
    }

    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('🔔 Alerta', {
          body: 'Você recebeu um aviso importante!',
          icon: '/icone-alerta.png',
        });
      } else if (Notification.permission !== 'denied') {
        const permissao = await Notification.requestPermission();
        if (permissao === 'granted') {
          new Notification('🔔 Alerta', {
            body: 'Você recebeu um aviso importante!',
            icon: '/icone-alerta.png',
          });
        }
      }
    }

    timerRef.current = setTimeout(() => setMostrarAlerta(false), 5000);
  };

  const alertasFiltrados = alertas.filter(
    (alerta) =>
      (equipamentoSelecionado === 'Todos' || alerta.equipamento_id === equipamentoSelecionado) &&
      (gravidade === 'Todos' || alerta.nivel_gravidade === gravidade)
  );

  const gravidadesUnicas = Array.from(new Set(alertas.map((a) => a.nivel_gravidade))).filter(Boolean);

  const getNomeGravidade = (nivel) => {
    switch (nivel) {
      case '1': return 'Pouca probabilidade de falha detectada';
      case '2': return 'Média probabilidade de falha detectada';
      case '3': return 'Alta probabilidade de falha detectada';
      default: return `Gravidade ${nivel}`;
    }
  };

  return (
    <div className="alertas-container">
      {pushNotifAtivada && mostrarAlerta && (
        <div className="notificacao-topo">⚠️ Falha detectada: "falha eminente no motor"</div>
      )}

      {pushNotifAtivada && <audio ref={audioRef} src="/alerta.mp3" preload="auto" />}

      <div className="filtros-alertas">
        <div>
          <label>Gravidade:</label>
          <select value={gravidade} onChange={(e) => setGravidade(e.target.value)}>
            <option value="Todos">Todos</option>
            {gravidadesUnicas.map((nivel, i) => (
              <option key={i} value={nivel}>
                {getNomeGravidade(nivel)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Equipamento:</label>
          <select value={equipamentoSelecionado} onChange={(e) => setEquipamentoSelecionado(e.target.value)}>
            <option value="Todos">Todos</option>
            {equipamentos.map((eq) => (
              <option key={eq.id} value={eq.id}>
                {eq.nome_equipamento}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="lista-alertas">
        {alertasFiltrados.map((alerta) => (
          <div
            key={alerta.id}
            className={`cartao-alerta gravidade-${alerta.nivel_gravidade}`}
          >
            <span className="emoji-alerta">⚠️</span>
            <div>
              <p className="mensagem-alerta">{getNomeGravidade(alerta.nivel_gravidade)}</p>
              <p className="gravidade-alerta">Gravidade: {alerta.nivel_gravidade}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertasNoti;
