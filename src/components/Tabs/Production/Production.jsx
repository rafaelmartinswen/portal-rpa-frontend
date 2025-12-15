import { useEffect, useState } from "react";
import "./Production.css";
import RobotCard from "../../RobotCard/RobotCard";
import AddProjectModal from "../../AddProjectModal/AddProjectModal"; // JS normal
import RobotInfoModal from "../../RobotInfoModal/RobotInfoModal";

function Production() {
  const [robots, setRobots] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [robotInfo, setRobotInfo] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/robots")
      .then((res) => res.json())
      .then((data) => setRobots(data))
      .catch((err) => console.error(err));
  }, []);

  const deleteRobot = async (id) => {
    try {
      console.log("Tentando deletar robô com ID:", id);
      
      const response = await fetch(`http://localhost:3001/robots/${id}`, {
        method: 'DELETE',
      });

      console.log("Status da resposta:", response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log("Erro da API:", errorText);
        throw new Error('Erro ao deletar robô');
      }

      const result = await response.json();
      console.log("Sucesso:", result);

      // Recarrega a lista completa de robôs
      updateRobotsList();
      
    } catch (error) {
      console.error('Erro completo:', error);
      throw error;
    }
  };

  const updateRobotsList = async () => {
    const updatedResponse = await fetch("http://localhost:3001/robots");
    const updatedData = await updatedResponse.json();
    setRobots(updatedData);
  }

  const openInfoRobot = async (robot) => {
    setIsInfoOpen(true);
    setRobotInfo(robot);
  }

  const robotsUnique = robots
    .filter((robot) => robot.Ambiente === "Prod")
    .filter(
      (robot, index, self) =>
        index === self.findIndex((r) => r.Nome === robot.Nome) // remove duplicados
  );

  return (
    <div className="production">
      {isInfoOpen && <RobotInfoModal robot={robotInfo} onClose={() => setIsInfoOpen(false)}/>}
      {isAddOpen && <AddProjectModal onClose={() => setIsAddOpen(false)} ambiente="Prod"/>}

      <div className="topo-tabs">
        <h2>Robôs em Produção</h2>
        <button className="button-tabs" onClick={() => setIsAddOpen(true)}>Adicionar</button>
      </div>

      <div className="production-cards" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {robotsUnique.length > 0 ? (
          robotsUnique.map((robot) => (
            <RobotCard key={robot.Id} robot={robot} onDelete={deleteRobot} openInfo={() => openInfoRobot(robot)}/>
          ))
        ) : (
          <div className="empty-robots" style={{ textAlign: "center", width: "100%", padding: "48px 0" }}>
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3>Nenhum robô em produção</h3>
            <p>Comece adicionando seu primeiro robô.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Production;
