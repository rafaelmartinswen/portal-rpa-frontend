import { useEffect, useState } from "react";
import "./Scheduler.css";
import { API_BASE_URL } from "../../../config/api";

function Scheduler() {
  const [robots, setRobots] = useState([]);

  useEffect(() => {
    updateRobotsList();
  }, []);

  const updateRobotsList = async () => {
    const updatedResponse = await fetch(`${API_BASE_URL}/robots/schedule`);
    const updatedData = await updatedResponse.json();
    setRobots(updatedData);
  }

  const dayColumns =
    robots.length > 0
      ? Object.keys(robots[0]).filter(
          (key) => key !== "Nome" && key !== "Descricao"
        ).sort((a, b) => Number(a) - Number(b))
      : [];

  return (
    <div className="scheduler">
      <div className="top-management">
        <div className="top-management-header">
          <h3>Projetos em produção</h3>
          <h2>Agendamentos das execuções</h2>
        </div>

        {/* <div className="top-management-stats">
          <div className="stat-card highlight">
            <span className="stat-title">Projetos ativos</span>
            <span className="stat-value">0</span>
          </div>
        </div> */}
      </div>

      <div className="scheduler-table-scroll">
        <table className="scheduler-table-grid">
          <thead>
            <tr>
              <th className="sticky-col">Projeto</th>
              {dayColumns.map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {robots.map((robot, index) => (
              <tr key={robot.Sigla_DB || robot.Nome || index}>
                <td className="sticky-col project-cell">
                  <div className="project-title">{robot.Nome}</div>
                  <div className="project-desc">{robot.Descricao}</div>
                </td>
                {dayColumns.map((day) => (
                  <td key={`${robot.Sigla_DB || robot.Nome}-${day}`}>
                    {robot[day] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Scheduler;
