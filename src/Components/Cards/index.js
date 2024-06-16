import React, { useEffect, useState } from "react";
import "./cards.css"; // Certifique-se de que o caminho está correto
import { api } from "../../utils/api";
import ModalUD from "../ModalUD";
import { formatDate, formatTime } from "../../utils/dateUtils";
import { Empty } from "antd";

function Cards() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar os dados das tarefas na API
  const fetchTasks = () => {
    api
      .get("task")
      .then((response) => {
        console.log("Resposta da API:", response.data);
        if (Array.isArray(response.data.task)) {
          setDados(response.data.task);
        } else {
          console.error(
            "A resposta da API não contém um array esperado:",
            response.data
          );
          setDados([]);
        }
      })
      .catch((error) => {
        console.error("Erro ao buscar dados da API:", error);
        setError("Erro ao buscar dados");
        setDados([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Efeito para buscar os dados das tarefas ao montar o componente
  useEffect(() => {
    fetchTasks();
  }, []);

  // Função para atualizar ou excluir uma tarefa
  const handleUpdate = (updatedTask, action) => {
    if (action === "update") {
      // Atualiza a tarefa existente na lista de dados
      setDados((prevDados) =>
        prevDados.map((task) =>
          task.id_tarefa === updatedTask.id_tarefa ? updatedTask : task
        )
      );
    } else if (action === "delete") {
      // Remove a tarefa da lista de dados
      setDados((prevDados) =>
        prevDados.filter((task) => task.id_tarefa !== updatedTask.id_tarefa)
      );
    }
  };

  if (loading) {
  }

  if (error) {
    return (
      <div className="empty">
          <Empty />
      </div>
    );
  }

  return (
    <div className="cards">
      {dados.map((tarefa) => (
        <div key={tarefa.id_tarefa} className="card">
          <div className="card-details">
            <p className="text-title text-opacity">{tarefa.titulo_tarefa}</p>
            <p className="text-body text-opacity">
              <span className="title-card">Data limite: </span>
              <span className="text-value">
                {formatDate(tarefa.data_tarefa)}
              </span>
            </p>
            <p className="text-body text-opacity">
              <span className="title-card">Hora Limite: </span>
              <span className="text-value">{formatTime(tarefa.horario)}</span>
            </p>
            <p className="text-body text-opacity">
              <span className="title-card">Status: </span>
              <span className="text-value">{tarefa.fg_ativo}</span>
            </p>
          </div>
          <button className="card-button">
            {/* Passa a função handleUpdate e ação para o ModalUD */}
            <ModalUD
              tarefa={tarefa}
              onUpdate={(updatedTask) => handleUpdate(updatedTask, "update")}
              onDelete={() => handleUpdate(tarefa, "delete")}
            />
          </button>
        </div>
      ))}
    </div>
  );
}

export default Cards;
