import './LandingPage.css';
import Modal from "../../Modal/Modal";
import { useEffect, useState } from "react";
import { RiRobot3Fill } from "react-icons/ri";
import { FiPlayCircle, FiClock, FiActivity, FiAlertCircle } from "react-icons/fi";
import { IoAlertSharp } from "react-icons/io5";

function LandingPage({ user, onTabChange }) {
    const [robots, setRobots] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [openAlert, setOpenAlert] = useState(false);
    const [selectedPage, setSelectedPage] = useState(null);
    const API_URL = process.env.REACT_APP_API_URL_DEV;

    useEffect(() => {
        updateRobotsList();
        updateAlerts();
      }, []);

    const updateRobotsList = async () => {
        try {
            const res = await fetch(`${API_URL}/robots`);
            const data = await res.json();
            setRobots(data);
        } catch (error) {
            console.error("Erro ao buscar robôs:", error);
        }
    };

    const updateAlerts = async () => {
        try {
            const res = await fetch(`${API_URL}/robots/alertsRobots`);
            const data = await res.json();
            setAlerts(data);
        } catch (error) {
            console.error("Erro ao buscar alertas:", error);
        }
    }

    function handleAction(page) {
        setSelectedPage(page);
        setOpenAlert(true);
    }

    const filteredAlerts = alerts.filter(alert => ( user.role !== 'Administrador' ? alert.Area_Responsavel === user.area_resp : true ))

    const robotsList = robots
        .filter(robot => robot.Ambiente === "Prod")
        .filter(robot => (
        user.role !== 'Administrador' 
            ? robot.Area_Responsavel === user.area_resp
            : true
        ))
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
                <div className="card" onClick={() => onTabChange("production")}>
                    <div className="icon-area blue">
                        <RiRobot3Fill />
                    </div>
                    <h3>Robôs Ativos</h3>
                    <p>Gerencie e monitore todos os robôs configurados.</p>
                </div>

                <div
                    className="card"
                    onClick={() => {
                        if (user?.role === "Administrador") {
                            onTabChange("scheduler");
                        } else {
                            handleAction("Agendamentos")
                        }
                    }}
                >
                    <div className="icon-area yellow">
                        <FiClock />
                    </div>
                    <h3>Agendamentos</h3>
                    <p>Controle horários e frequências de execução.</p>
                </div>
                
                {user.role === 'Administrador' && (
                    <>
                        <div className="card" onClick={() => handleAction("Executar robô")}>
                            <div className="icon-area green">
                                <FiPlayCircle />
                            </div>
                            <h3>Executar Robô</h3>
                            <p>Inicie execuções sob demanda com segurança.</p>
                        </div>

                        <div className="card" onClick={() => handleAction("Oportunidades")}>
                            <div className="icon-area red">
                                <IoAlertSharp />
                            </div>
                            <h3>Oportunidades</h3>
                            <p>Verifique o log de oportunidades</p>
                        </div>
                    </>
                )}
            </div>

            {/* Alertas de projetos */}
            <div className="section-title">
                <h3>Alertas de Execução</h3>
            </div>
            {filteredAlerts.length > 0 ?
                filteredAlerts.map((alert) => (
                    <div key={alert.Id}>
                        {alert.Tipo_Alerta === 'stopped' ? (
                            <OvAlertStopped alert={alert} />
                        ) : (
                            <OvAlertFailed alert={alert} />
                        )}
                    </div>
                )) : <div className="ov-alert ov-alert-warning-green" style={{ fontWeight: 500, fontSize: '14px' }}>
                    ✔ Nenhum projeto em estado de alerta!
                </div>}

            {/* Últimas atividades */}
            <div className="section-title">
                <h3>Últimas execuções</h3>
            </div>

            <div className="activity-list">
                {robotsList.length > 0 ? robotsList.map((robot) => {
                    const { dayLabel, timeLabel } = formatExecution(robot.Ultima_Exec);

                    return (
                        <div key={robot.Id} className="activity-item">
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

function OvAlertFailed({ alert }) {
    return (
        <div className="ov-alert ov-alert-warning" style={{ fontWeight: 500, fontSize: '14px' }}>
            ⚠️ Projeto {alert.Projeto} falhou durante a execução!
        </div>
    );
}

function OvAlertStopped({ alert }) {
    return (
        <div className="ov-alert ov-alert-warning-red" style={{ fontWeight: 500, fontSize: '14px' }}>
            ❗ Projeto {alert.Projeto} parou!
        </div>
    );
}

export default LandingPage;
