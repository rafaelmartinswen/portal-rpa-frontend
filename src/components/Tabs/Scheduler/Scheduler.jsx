import { useEffect, useState } from "react";
import "./Scheduler.css";
import { API_BASE_URL } from "../../../config/api";
import ChartSavedHoursTotal from "../../Charts/ChartSavedHoursTotal";
import ChartSavedHoursDaily from "../../Charts/ChartSavedHoursDaily";

function Scheduler({user}) {
  const [robots, setRobots] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    updateRobotsList();
  }, []);

  const updateRobotsList = async () => {
    const updatedResponse = await fetch(`${API_BASE_URL}/robots/schedule`);
    const updatedData = await updatedResponse.json();
    setRobots(updatedData);
  }

  console.log(robots);

  const robotsUnique = robots
    .filter(robot => (
      user.role !== 'Administrador' 
        ? robot.Area_Responsavel === user.area_resp
        : true
    ))
    .filter(
      (robot, index, self) =>
        index === self.findIndex((r) => r.Nome === robot.Nome) // remove duplicados
  );

  const dayColumns = robotsUnique.length > 0
    ? Array.from(
        new Set(
          robotsUnique.flatMap((robot) =>
            Object.keys(robot).filter((key) => {
              if (key === "Nome" || key === "Descricao") return false;
              const dayNumber = Number(key);
              return Number.isFinite(dayNumber);
            })
          )
        )
      ).sort((a, b) => Number(a) - Number(b))
    : [];

  const today = new Date();
  const todayISO = today.toISOString().split("T")[0];

  const minRange = new Date();
  minRange.setDate(minRange.getDate() - 30);
  const minRangeISO = minRange.toISOString().split("T")[0];

  const parseInputDate = (value) => {
    if (!value) return null;
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const clampToRange = (date) => {
    if (!date) return null;

    const minBoundary = new Date(minRange);
    minBoundary.setHours(0, 0, 0, 0);

    const maxBoundary = new Date(today);
    maxBoundary.setHours(23, 59, 59, 999);

    if (date < minBoundary) return minBoundary;
    if (date > maxBoundary) return maxBoundary;
    return date;
  };

  const startDateFilter = clampToRange(parseInputDate(startDate));
  const endDateFilter = clampToRange(parseInputDate(endDate));

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const parseDurationToMinutes = (value) => {
    if (!value || value === "-") return 0;
    const text = String(value).trim();

    if (!text) return 0;

    if (text.endsWith("m")) {
      const minutes = Number(text.replace("m", ""));
      return Number.isNaN(minutes) ? 0 : minutes;
    }

    const match = text.match(/^(\d+)h(\d{2})?$/);
    if (match) {
      const hours = Number(match[1]);
      const minutes = match[2] ? Number(match[2]) : 0;
      return hours * 60 + minutes;
    }

    const numeric = Number(text);
    return Number.isNaN(numeric) ? 0 : numeric;
  };

  const startBoundary = startDateFilter
    ? new Date(startDateFilter)
    : new Date(currentYear, currentMonth, 1);
  startBoundary.setHours(0, 0, 0, 0);

  const endBoundary = endDateFilter
    ? new Date(endDateFilter)
    : new Date(currentYear, currentMonth + 1, 0);
  endBoundary.setHours(23, 59, 59, 999);

  const dayColumnsForCharts = dayColumns.filter((day) => {
    const dayNumber = Number(day);
    if (Number.isNaN(dayNumber)) return false;
    const date = new Date(currentYear, currentMonth, dayNumber);
    const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return dayStart >= startBoundary && dayStart <= endBoundary;
  });

  const dayLabels = dayColumnsForCharts.map((day) => {
    const dayNumber = Number(day);
    const date = new Date(currentYear, currentMonth, dayNumber);
    return date.toLocaleDateString("pt-BR").slice(0, 5);
  });

  const dailyMinutes = dayColumnsForCharts.map((day) =>
    robotsUnique.reduce((total, robot) => total + parseDurationToMinutes(robot[day]), 0)
  );
  const dailyHours = dailyMinutes.map((minutes) => Number((minutes / 60).toFixed(2)));
  const totalHours = dailyMinutes.reduce((total, minutes) => total + minutes, 0) / 60;

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
            {robotsUnique.map((robot, index) => (
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

      <div className="ov-chart">
        <div className="ov-chart-header">
          <div className="ov-chart-title">Total de Horas Poupadas por dia</div>

          <div className="ov-chart-filters">
            <input
              type="date"
              className="date-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={minRangeISO}
              max={todayISO}
            />
            <input
              type="date"
              className="date-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate || minRangeISO}
              max={todayISO}
            />
          </div>
        </div>

        <div className="chart-container">
          <div style={{ flex: 1 }}>
            <ChartSavedHoursTotal totalHours={totalHours} />
          </div>
          <div style={{ flex: 3 }}>
            <ChartSavedHoursDaily labels={dayLabels} values={dailyHours} />
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default Scheduler;
