import { useEffect, useState } from "react";
import "./Overview.css";
import ChartProcessing from "../Charts/ChartProcessing";
import { MdPlayArrow, MdRefresh, MdAddCircle } from "react-icons/md";

function Overview() {
    const [robots, setRobots] = useState([]);
    const [vms, setVms] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const today = new Date();
    const todayISO = today.toISOString().split("T")[0];

    const minRange = new Date();
    minRange.setDate(minRange.getDate() - 30);
    const minRangeISO = minRange.toISOString().split("T")[0];

    const filteredLogs = [];
    const API_URL = process.env.REACT_APP_API_URL;

    useEffect(() => {
        async function fetchVMs() {
            try {
            const response = await fetch(`${API_URL}/azure/listar-vms`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json"
                }
            });

            const data = await response.json();

            setVms(data); 
            } catch (error) {
            console.error("Erro ao buscar VMs:", error);
            }
        }

        fetchVMs();
    }, []);

    useEffect(() => {
        fetch(`${API_URL}/robots`)
        .then((res) => res.json())
        .then((data) => setRobots(data))
        .catch((err) => console.error(err));
    }, []);

    const robotsUnique = robots
        .filter((robot) => robot.Ambiente === "Prod")
        .filter(
        (robot, index, self) =>
            index === self.findIndex((r) => r.Nome === robot.Nome) // remove duplicados
    );

    const vmsDeallocated = vms.filter(vm =>
        vm.status?.split("/")[1] === "deallocated"
    );

    return (
        <div className="overview">

            {/* BANNER DE ALERTA */}
            {vmsDeallocated.length > 0 && (
                <div className="ov-alert ov-alert-warning">
                    ⚠️ {vmsDeallocated.length} máquina(s) virtual(is) offline
                </div>
            )}

            {/* AÇÕES RÁPIDAS */}
            <div className="ov-actions">
                <button><MdAddCircle/> Nova VM</button>
                <button><MdRefresh/> Atualizar status</button>
                <button disabled><MdPlayArrow/> Iniciar projetos</button>
            </div>

            {/* KPIs */}
            <div className="ov-kpi-grid">
                <div className="ov-kpi">
                    <div className="ov-kpi-number">{vms.length}</div>
                    <div className="ov-kpi-label">VMs totais</div>
                </div>

                <div className="ov-kpi">
                    <div className="ov-kpi-number">{vmsDeallocated.length}</div>
                    <div className="ov-kpi-label">VMs offline</div>
                </div>

                <div className="ov-kpi">
                    <div className="ov-kpi-number">{robotsUnique.length}</div>
                    <div className="ov-kpi-label">Projetos em produção</div>
                </div>

                <div className="ov-kpi">
                    <div className="ov-kpi-number ov-green">97%</div>
                    <div className="ov-kpi-label">Sucesso no AntiCaptcha</div>
                </div>
            </div>

            {/* GRÁFICO */}
            <div className="ov-chart">
                <div className="ov-chart-header">
                    <div className="ov-chart-title">Uso das VMs por dia</div>

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
                    {/* <div style={{ flex: 1 }}>
                        <ChartStatus logs={filteredLogs}/>
                    </div> */}

                    <div style={{ flex: 3 }}>
                        <ChartProcessing
                            logs={filteredLogs}
                            startDate={startDate}
                            endDate={endDate}
                        />
                    </div>
                </div>
            </div>

            {/* ATIVIDADES */}
            <div className="ov-activity">
                {/* === LOGS === */}
                <section className="section">
                    <h2>Logs Recentes</h2>
            
                    <div className="logBox">
                        <p>[12:10] VM-RPA-01 reiniciada</p>
                        <p>[12:05] Processo Financeiro falhou (timeout)</p>
                        <p>[12:00] Relatórios enviados</p>
                    </div>
                </section>
            </div>

        </div>
    );
}

export default Overview;

