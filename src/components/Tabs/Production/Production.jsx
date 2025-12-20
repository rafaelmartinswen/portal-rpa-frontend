import { useEffect, useState } from "react";
import "./Production.css";
import RobotCard from "../../RobotCard/RobotCard";
import RobotInfoModal from "../../RobotInfoModal/RobotInfoModal";
import AddProjectModal from "../../AddProjectModal/AddProjectModal";
import Modal from "../../Modal/Modal";
import { FiAlertCircle } from "react-icons/fi";

function Production( {user, onTabChange} ) {
  const [robots, setRobots] = useState([]);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [robotInfo, setRobotInfo] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    fetch("https://portal-rpa-backend.bravedune-0c4b692e.eastus2.azurecontainerapps.io/robots")
      .then((res) => res.json())
      .then((data) => setRobots(data))
      .catch((err) => console.error(err));
  }, []);

  const deleteRobot = async (id) => {
    try {
      console.log("Tentando deletar robô com ID:", id);
      
      const response = await fetch(`https://portal-rpa-backend.bravedune-0c4b692e.eastus2.azurecontainerapps.io/robots/${id}`, {
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
    const updatedResponse = await fetch("https://portal-rpa-backend.bravedune-0c4b692e.eastus2.azurecontainerapps.io/robots");
    const updatedData = await updatedResponse.json();
    setRobots(updatedData);
  }

  const openInfoRobot = async (robot) => {
    setIsInfoOpen(true);
    setRobotInfo(robot);
  }

  function handleAction(page) {
    setSelectedPage(page);
    setOpenAlert(true);
  }

  const robotsUnique = robots
    .filter((robot) => robot.Ambiente === "Prod")
    .filter(robot => (
      user.role !== 'Administrador' 
        ? robot.Area_Responsavel === user.area_resp
        : true
    ))
    .filter(
      (robot, index, self) =>
        index === self.findIndex((r) => r.Nome === robot.Nome) // remove duplicados
  );

  const filteredRobots = robotsUnique.filter(robot =>
    robot.Nome.toLowerCase().includes(search.toLowerCase()) ||
    robot.Sigla_DB?.toLowerCase().includes(search.toLowerCase()) ||
    robot.Area_Responsavel?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="production">
      {isInfoOpen && <RobotInfoModal robot={robotInfo} onClose={() => setIsInfoOpen(false)}/>}
      {isAddOpen && <AddProjectModal onClose={() => setIsAddOpen(false)} ambiente="Prod"/>}
      
      <div className="top-management">
        <div className="text-content">
          <h3>Projetos em produção</h3>
          <h2>Listagem de projetos ativos</h2>
        </div>
        <div className="feature-cards">
          <div className="top-management-card" style={{borderBottom: "3px solid #2D3E50"}}>
            <h4 style={{fontSize: "14px", textAlign: "center"}}>Agendamentos</h4>
            <button>Acessar</button>
          </div>
          <div className="top-management-card" style={{borderBottom: "3px solid #2D3E50"}}>
            <h4 style={{fontSize: "14px", textAlign: "center"}}>Histórico de execuções</h4>
            <button>Acessar</button>
          </div>
          <div className="top-management-card" style={{borderBottom: "3px solid #2D3E50"}}>
            <h4 style={{fontSize: "14px", textAlign: "center"}}>Quantidade de projetos</h4>
            <p style={{textAlign: "center"}}>{robotsUnique.length}</p>
          </div>
        </div>
      </div>

      <div className='search-tabs'>
        <input 
          type='text' 
          placeholder='Pesquisar' 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {user.role === 'Administrador' && (
            <button className="button-tabs" onClick={() => setIsAddOpen(true)}>Adicionar</button>
        )}
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
              onTabChange={onTabChange} 
              handleAction={() => handleAction(robot.Nome)}
            />
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

      <Modal open={openAlert} onClose={() => setOpenAlert(false)}>
        <div className="confirmacao-container">
            <div className="confirmacao-icon">
                <FiAlertCircle size={50} />
            </div>

            <h2>Alerta</h2>
            <p>
                A página <strong>{selectedPage}</strong> está em desenvolvimento...
            </p>

            <div className="confirmacao-buttons">
                <button className="btn-nao" onClick={() => setOpenAlert(false)}>Voltar</button>
            </div>
        </div>
      </Modal>
    </div>
  );
}

export default Production;
