import { useEffect, useState } from "react";
import "./SchedulerCard.css";
import SchedulerInfoModal from "../SchedulerInfoModal/SchedulerInfoModal";
import { API_BASE_URL } from "../../config/api";

function SchedulerCard({ cod, day }) {
    const [robots, setRobots] = useState([]);
    const [open, setOpen] = useState(true);

    // controla modal
    const [selectedRobot, setSelectedRobot] = useState(null);

    useEffect(() => {
        fetch(`${API_BASE_URL}/robots`)
        .then(res => res.json())
        .then(data => setRobots(data))
        .catch(err => console.error(err));
    }, []);

    return (
        <>
        <div className="scheduler-card">
            <div className="scheduler-card-header" onClick={() => setOpen(!open)}>
                <h3>{day}</h3>
            </div>

            {open && (
                <div className="scheduler-card-body">
                    <table>
                        <thead>
                            <tr>
                                <th style={{width: "35%"}}>Nome</th>
                                <th>Status</th>
                                <th>Area</th>
                                <th>Responsável</th>
                                <th>Ultima Exec.</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {robots.map((robot) =>
                                cod === robot.Agenda ? (
                                    <tr key={robot.cod}>
                                        <th className="scheduler-th-name" style={{width: "35%"}}>{robot.Nome}
                                            <p>{robot.Descricao}</p>
                                        </th>

                                        <th className={`scheduler-th-status-${robot.Status_Exec}`}>
                                            <button>{robot.Status_Exec}</button>
                                        </th>

                                        <th><p>{robot.Area_Responsavel}</p></th>
                                        <th><p>{robot.Dev_Responsavel}</p></th>

                                        <th>
                                            <p>
                                                {new Date(robot.Ultima_Exec).toLocaleDateString("pt-BR")}
                                            </p>
                                        </th>

                                        <th>
                                            <button
                                                className="scheduler-action-btn"
                                                onClick={() => setSelectedRobot(robot)}
                                                disabled
                                            >
                                                Detalhes
                                            </button>
                                        </th>
                                    </tr>
                                ) : null
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* Modal */}
        {selectedRobot && (
            <SchedulerInfoModal
                robot={selectedRobot}
                onClose={() => setSelectedRobot(null)}
            />
        )}
        </>
    );
}

export default SchedulerCard;
