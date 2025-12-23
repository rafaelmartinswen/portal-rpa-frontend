import { useEffect, useState } from "react";
import "./SchedulerAgenda.css";

function SchedulerAgenda() {
    const [robots, setRobots] = useState([]);
    const API_URL = process.env.REACT_APP_API_URL_DEV;

    useEffect(() => {
        fetch(`${API_URL}/robots`)
        .then(res => res.json())
        .then(data => setRobots(data))
        .catch(err => console.error(err));
    }, []);

    return (
        <div className="scheduler-card">
            <div className="scheduler-card-header">
                <h3>Distribuição de carga diária por Projeto</h3>
            </div>
            <div className="scheduler-card-body">
                <table>
                    <thead>
                        <tr>
                            <th style={{width: "35%"}}>Projeto</th>
                            <th>Segunda</th>
                            <th>Terça</th>
                            <th>Quarta</th>
                            <th>Quinta</th>
                            <th>Sexta</th>
                            <th>Quinzenal</th>
                            <th>Mensal</th>
                            <th>VM</th>
                        </tr>
                    </thead>
                    <tbody>
                        {robots.map((robot) =>
                            <tr>
                                <th className="scheduler-th-name">{robot.Nome}
                                    <p>{robot.Descricao}</p>
                                </th>
                                <th><p>10h</p></th>
                                <th><p>10h</p></th>
                                <th><p>10h</p></th>
                                <th><p>10h</p></th>
                                <th><p>10h</p></th>
                                <th><p>10h</p></th>
                                <th><p>10h</p></th>
                                <th><p>VM006</p></th>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default SchedulerAgenda;

