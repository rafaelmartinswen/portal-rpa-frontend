import { useEffect, useState } from "react";
import "./SchedulerInfoModal.css";

const API_URL = process.env.REACT_APP_API_URL;

function SchedulerInfoModal({ robot, onClose }) {
    const [lista, setLista] = useState([]);
    
    useEffect(() => {
        if (!robot) return;

        const fetchData = async () => {
        try {
            const response = await fetch(`${API_URL}/robots/lista-inicial/${robot.Sigla_DB}`);
            const data = await response.json();
            setLista(data);
        } catch (err) {
            console.error("Erro ao buscar lista inicial:", err);
        }
        };

        fetchData();
    }, [robot]);

    if (!robot) return null;

    return (
        <div className="modal-overlay">
        <div className="robot-modal-content">
            
            <h2>Detalhes do processamento</h2>

            <div className="form-group">
            <label>Nome</label>
            <input disabled value={robot.Nome} />
            </div>

            <div className="scheduler-card">
                <div className="scheduler-card-header">
                    <h3>Fila de processamento</h3>
                </div>

                <div className="scheduler-card-body">
                    <table>
                        <thead>
                            <tr>
                                <th>Empresa/Colaborador</th>
                                <th>Cnpj/Matricula</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {lista.length === 0 && (
                                <tr>
                                    <td colSpan="3" style={{ textAlign: "center" }}>Nenhum item encontrado</td>
                                </tr>
                            )}
                            {lista.map((item, index) => (
                                <tr key={index}>
                                    <th className="scheduler-th-name">
                                        {item.Nome_Empresa || item.Colaborador || item.Nome_Colaborador}
                                    <p>{item.Nome_ArqPDF}</p>
                                    </th>

                                    <td>
                                    <p>{item.Cnpj_Empresa || item.Matricula}</p>
                                    </td>

                                    <td className={`scheduler-th-status-Waiting`}>
                                    <button>{item.Status || "Waiting"}</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="modal-buttons">
            <button className="btn-cancel" onClick={onClose}>Fechar</button>
            </div>

        </div>
        </div>
    );
}

export default SchedulerInfoModal;

