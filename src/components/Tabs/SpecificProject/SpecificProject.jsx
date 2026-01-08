import { useEffect, useState, useCallback } from "react";
import { gerarExcel } from "../../../utils/excel";
import ChartProcessing from "../../Charts/ChartProcessing";
import ChartStatus from "../../Charts/ChartStatus";
import "./SpecificProject.css";
import { API_BASE_URL } from "../../../config/api";

function SpecificProject({ project }) {
    const [listaInicial, setListaInicial] = useState([]);
    const [logExec, setLogExec] = useState([]);
    const [logInconsistencias, setLogInconsistencias] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    const minRange = new Date();
    minRange.setDate(minRange.getDate() - 30);
    const minRangeISO = minRange.toISOString().split("T")[0];

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
            fetchData(`${API_BASE_URL}/robots/lista-inicial/${project}`, setListaInicial);
        };

        load();
        const interval = setInterval(load, 5000);
        return () => clearInterval(interval);
    }, [project, fetchData]);

    // Logs
    useEffect(() => {
        if (!project) return;

        const load = () => {
            fetchData(`${API_BASE_URL}/robots/log-exec/${project}?Status_Processo=0`, setLogExec);
            fetchData(`${API_BASE_URL}/robots/log-exec/${project}?Status_Processo=-1`, setLogInconsistencias);
        };

        load();
        const interval = setInterval(load, 5000);
        return () => clearInterval(interval);
    }, [project, fetchData]);

    const logExecToday = logExec.filter((item) => {
        const date = new Date(item.Data_Processo);

        // Data convertida para horário local
        const itemDateLocal = date.toLocaleDateString("pt-BR")
            .split("/")
            .reverse()
            .join("-");  // vira YYYY-MM-DD

        const todayLocal = new Date()
            .toLocaleDateString("pt-BR")
            .split("/")
            .reverse()
            .join("-");

        return itemDateLocal === todayLocal;
    });

    const logInconsistenciasToday = logInconsistencias.filter((item) => {
        const date = new Date(item.Data_Processo);

        // Data convertida para horário local
        const itemDateLocal = date.toLocaleDateString("pt-BR")
            .split("/")
            .reverse()
            .join("-");  // vira YYYY-MM-DD

        const todayLocal = new Date()
            .toLocaleDateString("pt-BR")
            .split("/")
            .reverse()
            .join("-");

        return itemDateLocal === todayLocal;
    });

    const parseInputDate = (value) => {
        if (!value) return null;
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const clampToRange = (date) => {
        if (!date) return null;

        const minBoundary = new Date(minRange);
        minBoundary.setHours(0, 0, 0, 0);

        const maxBoundary = new Date(today);
        maxBoundary.setHours(23, 59, 59, 999);

        if (date < minBoundary) return minBoundary;
        if (date > maxBoundary) return maxBoundary;
        return date;
    };

    const startDateFilter = clampToRange(parseInputDate(startDate));
    const endDateFilter = clampToRange(parseInputDate(endDate));

    const filteredLogs = logExec.filter((item) => {
        const logDate = new Date(item.Data_Processo);
        if (Number.isNaN(logDate.getTime())) return false;

        const logDay = new Date(
            logDate.getFullYear(),
            logDate.getMonth(),
            logDate.getDate()
        );

        const startBoundary = startDateFilter
            ? new Date(startDateFilter)
            : (() => {
                const clone = new Date(minRange);
                clone.setHours(0, 0, 0, 0);
                return clone;
            })();

        const endBoundary = endDateFilter
            ? new Date(endDateFilter)
            : (() => {
                const clone = new Date(today);
                clone.setHours(23, 59, 59, 999);
                return clone;
            })();

        if (logDay < startBoundary) return false;
        if (logDay > endBoundary) return false;
        return true;
    });

    return (
        <div className="specificproject">
            {/* Header */}
            <div className="topo-specificproject">
                <button 
                    onClick={() => {
                        if (logExecToday.length > 0) {
                        gerarExcel(logExecToday);
                        }else {
                            alert('Nenhum resultado encontrado!')
                        }
                    }}
                    >
                    Exportar Excel
                </button>
            </div>
            <div className="top-management" style={{borderTopLeftRadius: "0",borderTopRightRadius: "0"}}>
                <div className="top-management-header">
                    <h3>Acompanhamento de projetos</h3>
                    <h2>{(project === 'EXCALCRESCISAO' ? "Cálculo de rescisões" : project === 'EXTFGTSCXE' ? "Solicitação FGTS" : null) ?? project}</h2>
                </div>

                <div className="top-management-stats">
                    <div className="stat-card highlight">
                        <span className="stat-title">Pendentes</span>
                        <span className="stat-value">{listaInicial.length}</span>
                    </div>
                    <div className="stat-card highlight">
                        <span className="stat-title">Processados</span>
                        <span className="stat-value">{logExecToday.length}</span>
                    </div>
                    <div className="stat-card highlight">
                        <span className="stat-title">Inconsistências</span>
                        <span className="stat-value">{logInconsistenciasToday.length}</span>
                    </div>
                </div>
            </div>

            {/* GRÁFICO */}
            <div className="ov-chart">
                <div className="ov-chart-header">
                    <div className="ov-chart-title">Total de Processamentos por dia</div>

                    <div className="ov-chart-filters">
                        <input
                            type="date"
                            className="date-input"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            min={minRangeISO}
                            max={todayISO}
                        />
                        <input
                            type="date"
                            className="date-input"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate || minRangeISO}
                            max={todayISO}
                        />
                    </div>
                </div>

                <div className="chart-container">
                    <div style={{ flex: 1 }}>
                        <ChartStatus logs={filteredLogs}/>
                    </div>

                    <div style={{ flex: 3 }}>
                        <ChartProcessing
                            logs={filteredLogs}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </div>
                </div>
            </div>

            {/* Tabelas */}
            <SchedulerCard title="Fila de processamento" qtd={listaInicial.length}>
                <PendingTable listaInicial={listaInicial} />
            </SchedulerCard>

            <SchedulerCard title="Processados hoje" qtd={logExecToday.length}>
                <ProcessedTable logExec={logExecToday} project={project}/>
            </SchedulerCard>
        </div>
    );
}
export default SpecificProject;

/* ----------------------------------------------
 * COMPONENTES EXTRA
 * ---------------------------------------------- */

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

function ProcessedTable({ logExec, project }) {
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
                    {(project === 'EXCALCRESCISAO') && (
                        <th>API Atualiz.</th>
                    )}
                    {(project === 'EXCALCRESCISAO') && (
                        <th>API Sincron.</th>
                    )}
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
                        {(project === 'EXCALCRESCISAO') && (
                            <td>{item.Retorno_Portal}</td>
                        )}
                        {(project === 'EXCALCRESCISAO') && (
                            <td>{item.Retorno_Sincronizar}</td>
                        )}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

