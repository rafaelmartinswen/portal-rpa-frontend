import { useEffect, useState } from "react";
import "./Production.css";
import RobotCard from "../../RobotCard/RobotCard";
import RobotInfoModal from "../../RobotInfoModal/RobotInfoModal";
import AddProjectModal from "../../AddProjectModal/AddProjectModal";
import Modal from "../../Modal/Modal";
import { FiAlertCircle } from "react-icons/fi";
import { API_BASE_URL } from "../../../config/api";

function Production( {user, onTabChange} ) {
  const [robots, setRobots] = useState([]);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [robotInfo, setRobotInfo] = useState([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [openAlert, setOpenAlert] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedPage, setSelectedPage] = useState(null);
  const [selectedID, setSelectedID] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedKeyUser, setSelectedKeyUser] = useState("");
    
  useEffect(() => {
    fetch(`${API_BASE_URL}/robots`)
      .then((res) => res.json())
      .then((data) => setRobots(data))
      .catch((err) => console.error(err));
  }, []);

  const deleteRobot = async (id) => {
    try {
      console.log("Tentando deletar robô com ID:", id);
      
      const response = await fetch(`${API_BASE_URL}/robots/${id}`, {
        method: "DELETE",
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
      setOpenDelete(false);
      
    } catch (error) {
      console.error('Erro completo:', error);
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

  const handleConfirmDelete = async () => {
    await deleteRobot(selectedID);
  };

  function handleAction(page, type = "", id = "") {
    if (type === "delete") {
      setSelectedPage(page);
      setSelectedID(id);
      setOpenDelete(true);
    } else {
      setSelectedPage(page);
      setOpenAlert(true);
    }
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

  const filteredRobots = robotsUnique.filter((robot) => {
    const matchesSearch =
      robot.Nome.toLowerCase().includes(search.toLowerCase()) ||
      robot.Sigla_DB?.toLowerCase().includes(search.toLowerCase()) ||
      robot.Area_Responsavel?.toLowerCase().includes(search.toLowerCase());

    const matchesArea = selectedArea === "" || robot.Area_Responsavel === selectedArea;
    const matchesKeyUser = selectedKeyUser === "" || robot.Key_User === selectedKeyUser;

    return matchesSearch && matchesArea && matchesKeyUser;
  });

  const areaOptions = Array.from(
    new Set(
      robotsUnique
        .map((robot) => robot.Area_Responsavel)
        .filter((area) => area && area.trim() !== "")
    )
  ).sort();

  const keyuserOptions = Array.from(
    new Set(
      robotsUnique
        .map((robot) => robot.Key_User)
        .filter((keyUser) => keyUser && keyUser.trim() !== "")
    )
  ).sort();

  return (
    <div className="production">
      {isInfoOpen && <RobotInfoModal robot={robotInfo} onClose={() => setIsInfoOpen(false)}/>}
      {isAddOpen && <AddProjectModal onClose={() => setIsAddOpen(false)} ambiente="Prod"/>}
      
      <div className="top-management">
        <div className="top-management-header">
          <h3>Projetos em produção</h3>
          <h2>Listagem de projetos ativos</h2>
        </div>

        <div className="top-management-stats">
          <div className="stat-card">
            <span className="stat-title">Agendamentos</span>
            <button>Acessar</button>
          </div>

          <div className="stat-card">
            <span className="stat-title">Histórico</span>
            <button>Acessar</button>
          </div>

          <div className="stat-card highlight">
            <span className="stat-title">Quantidade de projetos</span>
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

          <select
            className="select"
            value={selectedKeyUser}
            onChange={(e) => setSelectedKeyUser(e.target.value)}
          >
            <option value="">Todos os Key Users</option>
            {keyuserOptions.map((keyUser) => (
              <option key={keyUser} value={keyUser}>
                {keyUser}
              </option>
            ))}
          </select>
          
          {user.role === 'Administrador' && (
            <div className="filters">
              <button className="filter active" onClick={() => setIsAddOpen(true)}>Adicionar</button>
            </div>
          )}
        </div>
      </div>

      <div className={`robot-cards-container${filteredRobots.length === 0 ? " is-empty" : ""}`}>
        {filteredRobots.length > 0 ? (
          filteredRobots.map((robot) => (
            <RobotCard 
              key={robot.Id} 
              robot={robot} 
              onDelete={() => handleAction(robot.Nome, "delete", robot.Id)}
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

      <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
        <div className="confirmacao-container">
          <div className="confirmacao-icon">
            <FiAlertCircle size={50} />
          </div>

          <h2>Confirmação</h2>
          <p>
            Tem certeza que deseja <strong>Excluir</strong> o projeto{" "}
            <strong>{selectedPage ?? ""}</strong>?
          </p>

          <div className="confirmacao-buttons">
            <button className="btn-sim" onClick={handleConfirmDelete}>
              Sim
            </button>
            <button className="btn-nao" onClick={() => setOpenDelete(false)}>
              Não
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default Production;
