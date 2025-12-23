import { useEffect, useState } from "react";
import "./Development.css";
import RobotCard from "../../RobotCard/RobotCard";
import AddProjectModal from "../../AddProjectModal/AddProjectModal"; // JS normal
import RobotInfoModal from "../../RobotInfoModal/RobotInfoModal";
import { API_BASE_URL } from "../../../config/api";

function Development( {user} ) {
  const [robots, setRobots] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [robotInfo, setRobotInfo] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  
  useEffect(() => {
    updateRobotsList();
  }, []);

  const deleteRobot = async (id) => {
    try {
      console.log("Tentando deletar robô com ID:", id);
      
      await fetch(`${API_BASE_URL}/robots/${id}`, {
        method: 'DELETE',
      });

      // Recarrega a lista completa de robôs
      updateRobotsList()
      
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  };

  const updateRobotsList = async () => {
    const updatedResponse = await fetch(`${API_BASE_URL}/robots`);
    const updatedData = await updatedResponse.json();
    setRobots(updatedData);
  }

  const openInfoRobot = async (robot) => {
    setIsInfoOpen(true);
    setRobotInfo(robot);
  }

  const robotsUnique = robots
    .filter((robot) => robot.Ambiente === "Dev")
    .filter(
      (robot, index, self) =>
        index === self.findIndex((r) => r.Nome === robot.Nome) // remove duplicados
  );

  const filteredRobots = robotsUnique.filter(
    (robot) =>
      (robot.Nome.toLowerCase().includes(search.toLowerCase()) ||
        robot.Sigla_DB?.toLowerCase().includes(search.toLowerCase()) ||
        robot.Area_Responsavel?.toLowerCase().includes(search.toLowerCase())) &&
      (selectedArea === "" || robot.Area_Responsavel === selectedArea)
  );

  const areaOptions = Array.from(
    new Set(
      robotsUnique
        .map((robot) => robot.Area_Responsavel)
        .filter((area) => area && area.trim() !== "")
    )
  ).sort();

  return (
    <div className="development">
      {isInfoOpen && <RobotInfoModal robot={robotInfo} onClose={() => setIsInfoOpen(false)}/>}
      {isAddOpen && <AddProjectModal onClose={() => setIsAddOpen(false)} ambiente="Dev"/>}

      <div className="top-management">
        <div className="top-management-header">
          <h3>Projetos em desenvolvimento</h3>
          <h2>Listagem de projetos ativos</h2>
        </div>

        <div className="top-management-stats">
          <div className="stat-card highlight">
            <span className="stat-title">Projetos ativos</span>
            <span className="stat-value">{robotsUnique.length}</span>
          </div>
        </div>
      </div>

      <div className="topbar">
        <div className="left">
          <button className="icon-btn">
            ☰
          </button>

          <button className="icon-btn grid">
            ⬚⬚
          </button>

          <input
            type="text"
            className="search"
            placeholder="Buscar por nome, sigla ou área..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="right">
          <select
            className="select"
            value={selectedArea}
            onChange={(e) => setSelectedArea(e.target.value)}
          >
            <option value="">Todas as áreas</option>
            {areaOptions.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          <div className="filters">
            <button className="filter active" onClick={() => setIsAddOpen(true)}>Adicionar</button>
          </div>
        </div>
      </div>

      <div className="robot-cards-container">
        {filteredRobots.length > 0 ? (
          filteredRobots.map((robot) => (
            <RobotCard 
              key={robot.Id} 
              robot={robot} 
              onDelete={deleteRobot} 
              openInfo={() => openInfoRobot(robot)} 
              user={user}
            />
          ))
        ) : (
          <div className="empty-robots" style={{ textAlign: "center", width: "100%", padding: "48px 0" }}>
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3>Nenhum robô em Desenvolvimento</h3>
            <p>Comece adicionando seu primeiro robô.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Development;

