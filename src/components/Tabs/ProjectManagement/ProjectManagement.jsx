import { useEffect, useState } from "react";
import './ProjectManagement.css'
import ChartProjects from "../../Charts/ChartProjects";

function ProjectManagement() {
    const [robots, setRobots] = useState([]);
    useEffect(() => {
        updateRobotsList();
      }, [updateRobotsList]);
    
    const updateRobotsList = useCallback(async () => {
        try {
            const res = await fetch(`${API_URL}/robots`);
            const data = await res.json();
            setRobots(data);
        } catch (error) {
            console.error("Erro ao buscar robôs:", error);
        }
    }, []);

    return (
        <div className='projectmanagement'>
            <div className="top-management">
                <div className="text-content">
                <h2>Gestão dos projetos RPA</h2>
                </div>
            </div>

            <div className="feature-cards">
                <div className="large-management-card" style={{borderBottom: "3px solid #2D3E50"}}>
                    <h4 style={{fontSize: "14px", textAlign: "center"}}>Projetos por Área</h4>
                    <div style={{ flex: 1 }}>
                        <ChartProjects projects={robots} type="projectsByArea" />
                    </div>
                </div>
                <div className="large-management-card" style={{borderBottom: "3px solid #2D3E50"}}>
                    <h4 style={{fontSize: "14px", textAlign: "center"}}>Projetos por Key User</h4>
                    <div style={{ flex: 1 }}>
                        <ChartProjects projects={robots} type="projectsByKeyUser" />
                    </div>
                </div>
                <div className="large-management-card" style={{borderBottom: "3px solid #2D3E50"}}>
                    <h4 style={{fontSize: "14px", textAlign: "center"}}>Projetos por Diretoria</h4>
                    <div style={{ flex: 1 }}>
                        <ChartProjects projects={robots} type="projectsByDiretoria" />
                    </div>
                </div>
            </div>

            <div className="scheduler-card">
                <div className="scheduler-card-header"></div>
                <div className="scheduler-card-body">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nome do Robô</th>
                                <th>Área solicitante</th>
                                <th>Diretor</th>
                                <th>Key User</th>
                                <th style={{width: "20%"}}>Objetivo</th>
                                <th>Data Criação</th>
                                <th>Dev. Responsável</th>
                                <th>Sistemas Utilizados</th>
                                <th>Tecnologias Utilizadas</th>
                                <th>Qtd. de Robôs</th>
                            </tr>
                        </thead>
                        <tbody>
                        {robots.map((robot) => (
                            <tr key={robot.Id}>
                                <td style={{fontSize: "12px"}}>{robot.Identificacao}</td>
                                <td style={{fontSize: "12px"}}>{robot.Nome}</td>
                                <td style={{fontSize: "12px"}}>{robot.Area_Responsavel}</td>
                                <td style={{fontSize: "12px"}}>{robot.Diretor}</td>
                                <td style={{fontSize: "12px"}}>{robot.Key_User}</td>
                                <td style={{fontSize: "12px"}}>{robot.Objetivo}</td>
                                <td style={{fontSize: "12px"}}>{new Date(robot.Data_Criacao).toLocaleDateString("pt-BR")}</td>
                                <td style={{fontSize: "12px"}}>{robot.Dev_Responsavel}</td>
                                <td style={{fontSize: "12px"}}>{robot.Sistemas_Utilizados}</td>
                                <td style={{fontSize: "12px"}}>{robot.Tecnologias_Utilizadas}</td>
                                <td style={{fontSize: "12px"}}>{robot.Qtd_Robos}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ProjectManagement;
