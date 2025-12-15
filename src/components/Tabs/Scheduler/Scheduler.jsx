import { useState } from "react";
import "./Scheduler.css";
import SchedulerCard from "../../SchedulerCard/SchedulerCard";
import SchedulerAgenda from "../../SchedulerAgenda/SchedulerAgenda";

function Scheduler() {
  const days = [
    {cod: 9, name: "Mensais"},{cod: 1, name: "Segunda-feira"},{cod: 2, name: "Terça-feira"},{cod: 3, name: "Quarta-feira"},{cod: 4, name: "Quinta-feira"},{cod: 5, name: "Sexta-feira"}
  ]

  const [typeScheduler, setTypeScheduler] = useState("agenda");

  const handleToggle = (event) => {
    setTypeScheduler(event.target.checked ? "cards" : "agenda");
  };

  return (
    <div className="scheduler">
      <div className="topo-tabs">
        <h2>Scheduler</h2>
        <label className="toggle">
          <input 
            type="checkbox"
            checked={typeScheduler === "cards"}
            onChange={handleToggle}
          />
          <span className="slider">
            <span className="on">Agenda</span>
            <span className="off">Cards</span>
          </span>
        </label>
      </div>
      {typeScheduler == "agenda" ? <SchedulerAgenda /> : days.map((day) => (
        <SchedulerCard cod={day.cod} day={day.name}/>
      ))}
    </div>
  );
}

export default Scheduler;
