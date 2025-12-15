import React, { useState } from "react";
import "./Management.css";
import VirtualMachines from "../../VirtualMachines/VirtualMachines";
import Users from "../../Users/Users";
import Overview from "../../Overview/Overview";

function Management() {
  const [selected, setSelected] = useState("Visão Geral");

  const menuItems = [
    "Visão Geral",
    "Recursos",
    "VMs",
    "Usuários"
  ];

  return (
    <div className="management">
      <div className="top-management">
        <div className="text-content">
          <h3>Tela de gerenciamento</h3>
          <h1>Obtenha visibilidade completa do seu ecossistema de RPA</h1>
        </div>

        <div className="feature-cards">
          <div className="top-management-card">
            <h4>Ligar/Desligar VM</h4>
            <p>Gerencie o status das máquinas virtuais.</p>
          </div>

          <div className="top-management-card">
            <h4>Gerenciar Usuários e Recursos</h4>
            <p>Controle usuários e recursos essenciais do ambiente.</p>
          </div>

          <div className="top-management-card">
            <h4>Logs & Auditoria</h4>
            <p>Acesse informações detalhadas de execução.</p>
          </div>
        </div>
      </div>
      <div className="section-management">
        <nav className="management-menu">
          <ul>
            {menuItems.map(item => (
              <li
                key={item}
                className={selected === item ? "active" : ""}
                onClick={() => setSelected(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>

        {/* ÁREA QUE MUDA DINAMICAMENTE */}
        <div className="management-content">
          {selected === "Visão Geral" && <Overview />}
          {selected === "Recursos" && <p>Gerenciamento de recursos disponíveis...</p>}
          {selected === "VMs" && <VirtualMachines />}
          {selected === "Usuários" && <Users />}
        </div>
      </div>
    </div>
  );
}

export default Management;
