import './LandingPage.css';
import { useEffect, useState } from "react";
import { RiRobot3Fill } from "react-icons/ri";
import { FiPlayCircle, FiClock, FiActivity } from "react-icons/fi";

function LandingPage({ user }) {
    const [robots, setRobots] = useState([]);

    useEffect(() => {
        updateRobotsList();
      }, []);
    
    const updateRobotsList = async () => {
        const updatedResponse = await fetch("https://portal-rpa-backend.bravedune-0c4b692e.eastus2.azurecontainerapps.io/robots");
        const updatedData = await updatedResponse.json();
        setRobots(updatedData);
    }

    const robotsList = robots
        .filter(robot => robot.Ambiente === "Prod")
        .filter((robot, index, self) =>
            index === self.findIndex(r => r.Nome === robot.Nome)
        )
        .sort((a, b) => new Date(b.Ultima_Exec) - new Date(a.Ultima_Exec))
        .slice(0, 3);
    
    return (
        <div className="dashboard-home">

            {/* Saudação */}
            <div className="welcome-box">
                <h2>Olá, {user?.name?.split(" ")[0]} 👋</h2>
                <p>Bem-vindo(a) ao painel de automações RPA.</p>
                <p className="sub">Gerencie seus robôs, acompanhe execuções e visualize resultados em tempo real.</p>
            </div>

            {/* Cards principais */}
            <div className="quick-cards">

                <div className="card">
                    <div className="icon-area blue">
                        <RiRobot3Fill />
                    </div>
                    <h3>Robôs Ativos</h3>
                    <p>Gerencie e monitore todos os robôs configurados.</p>
                </div>

                <div className="card">
                    <div className="icon-area green">
                        <FiPlayCircle />
                    </div>
                    <h3>Executar Robô</h3>
                    <p>Inicie execuções sob demanda com segurança.</p>
                </div>

                <div className="card">
                    <div className="icon-area yellow">
                        <FiClock />
                    </div>
                    <h3>Agendamentos</h3>
                    <p>Controle horários e frequências de execução.</p>
                </div>

            </div>

            {/* Últimas atividades */}
            <div className="section-title">
                <h3>Últimas execuções</h3>
            </div>

            <div className="activity-list">
                {robotsList.length > 0 ? robotsList.map((robot) => {
                    const { dayLabel, timeLabel } = formatExecution(robot.Ultima_Exec);

                    return (
                        <div key={robot.Nome} className="activity-item">
                            <FiActivity className="activity-icon" />
                            <div>
                                <strong>Robô - {robot.Nome}</strong>
                                <p>
                                    Executado{" "}
                                    {dayLabel === "hoje"
                                        ? "hoje"
                                        : dayLabel === "ontem"
                                        ? "ontem"
                                        : `dia ${dayLabel}`}{" "}
                                    às {timeLabel}
                                </p>
                            </div>
                        </div>
                    );
                }) : null}
            </div>

        </div>
    );
}

function formatExecution(ultimaExec) {
    const date = new Date(ultimaExec);

    // partes
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // datas para comparação
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const execDay = new Date(date);
    execDay.setHours(0, 0, 0, 0);

    const diffDays = (today - execDay) / (1000 * 60 * 60 * 24);

    // texto do dia
    let dayLabel;

    if (diffDays === 0) {
        dayLabel = "hoje";
    } else if (diffDays === 1) {
        dayLabel = "ontem";
    } else {
        dayLabel = `${day}/${month}/${year}`;
    }

    return {
        dayLabel,               // "hoje", "ontem", "03/12/2025"
        timeLabel: `${hours}:${minutes}`, // "22:03"
    };
}

export default LandingPage;