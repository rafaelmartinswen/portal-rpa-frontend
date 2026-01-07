import { API_BASE_URL } from "../../../config/api";
import { useCallback, useEffect, useState } from "react";
import "./ProjectHistory.css";

function ProjectHistory({user}) {
    const [robots, setRobots] = useState([]);
    const [selectedProject, setSelectedProject] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [logExec, setLogExec] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetch(`${API_BASE_URL}/robots`)
        .then((res) => res.json())
        .then((data) => setRobots(data))
        .catch((err) => console.error(err));
    }, []);

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

    const fetchData = useCallback(async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Status ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Erro ao buscar ${url}:`, error);
            return [];
        }
    }, []);

    const handleSearch = async () => {
        if (!selectedProject) {
            alert("Selecione um projeto.");
            return;
        }
        if (!selectedDate) {
            alert("Selecione uma data.");
            return;
        }

        setIsLoading(true);
        try {
            const data = await fetchData(
                `${API_BASE_URL}/robots/log-exec-history/${encodeURIComponent(selectedProject)}?date=${selectedDate}`
            );

            setLogExec(data);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLogs = logExec;

    return (
        <div className="projecthistory">
            <div className="top-management">
                <div className="top-management-header">
                <h3>Projetos em produção</h3>
                <h2>Histórico das execuções</h2>
                </div>
            </div>

            <div className="topbar" style={{borderBottomLeftRadius: "0", borderBottomRightRadius: "0"}}>
                <div className="left">
                    <button className="icon-btn">☰</button>

                    <button className="icon-btn grid">⬚⬚</button>
                </div>

                <div className="right">
                    <select
                        className="select"
                        value={selectedProject}
                        onChange={(e) => setSelectedProject(e.target.value)}
                    >
                        <option value="">Selecione o projeto</option>
                        {robotsUnique.map((project) => (
                            <option key={project.Nome} value={project.Sigla_DB}>{project.Nome}</option>
                        ))}
                    </select>

                    <div className="apm-group third">
                        <input type="date" name="Data_Criacao" onChange={(e) => setSelectedDate(e.target.value)}/>
                    </div>

                    <div className="filters">
                        <button
                            className="filter active"
                            type="button"
                            onClick={handleSearch}
                            disabled={isLoading}
                        >
                            {isLoading ? "Pesquisando..." : "Pesquisar"}
                        </button>
                    </div>

                    <button className="button-qtd-vms">{logExec.length}</button>

                </div>
            </div>

            <div className="tab-list-projects-history">
                <div className="scheduler-card-body">
                    <table>
                    <thead>
                        <tr>
                            <th style={{ width: "35%" }}>Empresa/Colaborador</th>
                            <th>Cnpj/Matricula</th>
                            <th>Status</th>
                            <th>Cod. Status</th>
                            <th style={{ width: "15%" }}>Data Processo</th>
                            <th>VM</th>
                            {(user.role === 'Administrador' || user.area_resp === 'Folha') && (
                                <th>API Atualiz.</th>
                            )}
                            {(user.role === 'Administrador' || user.area_resp === 'Folha') && (
                                <th>API Sincron.</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                    {filteredLogs.length === 0 && (
                        <tr>
                            <td colSpan="6" className="text-center">
                                Nenhum resultado encontrado
                            </td>
                        </tr>
                    )}

                    {filteredLogs.map((item, index) => (
                        <tr key={`${item.Nome_Empresa || item.Colaborador}-${index}`}>
                            <td className="scheduler-th-name">
                                {item.Nome_Empresa || item.Colaborador}
                                <p>{item.Id || `${item.Empresa}-${item.Filial}`}</p>
                            </td>

                            <td>{item.Cnpj_Empresa || item.Matricula}</td>

                            <td className={`status ${
                                item.Status_Processo === "0" ? "processing" : "processed"
                            }`}>
                                <button>
                                    {item.Status_Processo === "0"
                                        ? "Processando"
                                        : item.Status_Processo === "-1"
                                            ? "Inconsistência"
                                            : "Processado"}
                                </button>
                            </td>

                            <td>{item.Status_Processo}</td>
                            <td>{new Date(item.Data_Processo).toLocaleString("pt-BR")}</td>
                            <td>{item.VM}</td>
                            {(user.role === 'Administrador' || user.area_resp === 'Folha') && (
                                <td>{item.Retorno_Portal}</td>
                            )}
                            {(user.role === 'Administrador' || user.area_resp === 'Folha') && (
                                <td>{item.Retorno_Sincronizar}</td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
        </div>
    );
}

export default ProjectHistory;
