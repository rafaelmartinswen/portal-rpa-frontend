import { useEffect, useState } from "react";
import "./Development.css";
import RobotCard from "../../RobotCard/RobotCard";
import AddProjectModal from "../../AddProjectModal/AddProjectModal"; // JS normal
import RobotInfoModal from "../../RobotInfoModal/RobotInfoModal";

function Development() {
  const [robots, setRobots] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [robotInfo, setRobotInfo] = useState([]);

  useEffect(() => {
    updateRobotsList();
  }, []);

  const deleteRobot = async (id) => {
    try {
      console.log("Tentando deletar robô com ID:", id);
      
      await fetch(`https://portal-rpa-backend.bravedune-0c4b692e.eastus2.azurecontainerapps.io/robots/${id}`, {method: 'DELETE',});

      // Recarrega a lista completa de robôs
      updateRobotsList()
      
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  };

  const updateRobotsList = async () => {
    const updatedResponse = await fetch("https://portal-rpa-backend.bravedune-0c4b692e.eastus2.azurecontainerapps.io/robots");
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

  return (
    <div className="development">
      {isInfoOpen && <RobotInfoModal robot={robotInfo} onClose={() => setIsInfoOpen(false)}/>}
      {isAddOpen && <AddProjectModal onClose={() => setIsAddOpen(false)} ambiente="Dev"/>}

      <div className="topo-tabs">
        <h2>Robôs em Desenvolvimento</h2>
        <button className="button-tabs" onClick={() => setIsAddOpen(true)}>Adicionar</button>
      </div>

      <div className="production-cards" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {robotsUnique.length > 0 ? (
          robotsUnique.map((robot) => (
            <RobotCard key={robot.Id} robot={robot} onDelete={deleteRobot} openInfo={() => openInfoRobot(robot)} />
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
