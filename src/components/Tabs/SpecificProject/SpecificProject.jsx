import { useEffect, useState, useCallback } from "react";
import { gerarExcel } from "../../../utils/excel";
import "./SpecificProject.css";

function SpecificProject({ project }) {
    const [listaInicial, setListaInicial] = useState([]);
    const [logExec, setLogExec] = useState([]);
    const [logInconsistencias, setLogInconsistencias] = useState([]);

    const fetchData = useCallback(async (url, setter) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            setter(data);
        } catch (error) {
            console.error(`Erro ao buscar ${url}:`, error);
        }
    }, []);

    // Lista inicial
    useEffect(() => {
        if (!project) return;

        const load = () => {
            fetchData(`http://localhost:3001/robots/lista-inicial/${project}`, setListaInicial);
        };

        load();
        const interval = setInterval(load, 5000);
        return () => clearInterval(interval);
    }, [project, fetchData]);

    // Logs
    useEffect(() => {
        if (!project) return;

        const load = () => {
            fetchData(`http://localhost:3001/robots/log-exec/${project}?Status_Processo=0`, setLogExec);
            fetchData(`http://localhost:3001/robots/log-exec/${project}?Status_Processo=-1`, setLogInconsistencias);
        };

        load();
        const interval = setInterval(load, 5000);
        return () => clearInterval(interval);
    }, [project, fetchData]);

    return (
        <div className="specificproject">
            {/* Header */}
            <div className="topo-specificproject">
                <h1>{project == 'extfgtscxe' ? 'Solicitação FGTS' : 'Cálculo de Rescisões'}</h1>
                <button 
                    onClick={() => {
                        if (logExec.length > 0) {
                        gerarExcel(logExec);
                        }else {
                            alert('Nenhum resultado encontrado!')
                        }
                    }}
                    >
                    Exportar Excel
                </button>
            </div>

            {/* Insights */}
            <div className="insights-specificproject">
                <InsightCard title="Pendentes" value={listaInicial.length} />
                <InsightCard title="Processados" value={logExec.length} />
                <InsightCard
                    title="Inconsistências"
                    value={logInconsistencias.length}
                    highlight={logInconsistencias.length > 0}
                />
            </div>

            {/* Tabelas */}
            <SchedulerCard title="Fila de processamento" qtd={listaInicial.length}>
                <PendingTable listaInicial={listaInicial} />
            </SchedulerCard>

            <SchedulerCard title="Processados hoje" qtd={logExec.length}>
                <ProcessedTable logExec={logExec}/>
            </SchedulerCard>
        </div>
    );
}
export default SpecificProject;

/* ----------------------------------------------
 * COMPONENTES EXTRA
 * ---------------------------------------------- */

function InsightCard({ title, value, highlight }) {
    return (
        <div className="item-insights">
            <h2>{title}</h2>
            <span className={highlight ? "text-danger" : ""}>{value}</span>
        </div>
    );
}

function SchedulerCard({ title, children, qtd }) {
    return (
        <div className="scheduler-card">
            <div className="scheduler-card-header">
                <h3>{title}</h3>
                <button>{qtd}</button>
            </div>
            <div className="scheduler-card-body">{children}</div>
        </div>
    );
}

function PendingTable({ listaInicial }) {
    return (
        <table>
            <thead>
                <tr>
                    <th style={{ width: "35%" }}>Empresa/Colaborador</th>
                    <th>Cnpj/Matricula</th>
                    <th>Status</th>
                    <th>Data limite</th>
                    <th>VM</th>
                </tr>
            </thead>
            <tbody>
                {listaInicial.length === 0 && (
                    <tr>
                        <td colSpan="5" className="text-center">Nenhum resultado encontrado</td>
                    </tr>
                )}

                {listaInicial.map((item, index) => (
                    <tr key={index}>
                        <td className="scheduler-th-name">
                            {item.Nome_Empresa || item.Colaborador}
                            <p>{item.Nome_ArqPDF || `${item.Empresa}-${item.Filial}`}</p>
                        </td>

                        <td>{item.Cnpj_Empresa || item.Matricula}</td>

                        <td className="status waiting">
                            <button>{item.Status || "Aguardando"}</button>
                        </td>

                        <td>{new Date(item.Data_Limite_Calculo).toLocaleDateString("pt-BR")}</td>
                        <td>{item.VM}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function ProcessedTable({ logExec }) {
    return (
        <table>
            <thead>
                <tr>
                    <th style={{ width: "35%" }}>Empresa/Colaborador</th>
                    <th>Cnpj/Matricula</th>
                    <th>Status</th>
                    <th>Cod. Status</th>
                    <th style={{ width: "15%" }}>Data Processo</th>
                    <th>VM</th>
                </tr>
            </thead>

            <tbody>
                {logExec.length === 0 && (
                    <tr>
                        <td colSpan="6" className="text-center">Nenhum resultado encontrado</td>
                    </tr>
                )}

                {logExec.map((item, index) => (
                    <tr key={index}>
                        <td className="scheduler-th-name">
                            {item.Nome_Empresa || item.Colaborador}
                            <p>{item.Nome_ArqPDF || `${item.Empresa}-${item.Filial}`}</p>
                        </td>

                        <td>{item.Cnpj_Empresa || item.Matricula}</td>

                        <td className={`status ${
                            item.Status_Processo === "0" ? "processing" : "processed"
                        }`}>
                            <button>
                                {item.Status_Processo === "0" ? "Processando" : "Processado"}
                            </button>
                        </td>

                        <td>{item.Status_Processo}</td>
                        <td>{new Date(item.Data_Processo).toLocaleString("pt-BR")}</td>
                        <td>{item.VM}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}
