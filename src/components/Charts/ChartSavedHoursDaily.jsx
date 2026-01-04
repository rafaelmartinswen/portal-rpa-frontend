import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartSavedHoursDaily({ labels = [], values = [] }) {
    if (!labels.length) {
        return (
            <div className="scheduler-chart">
                <div className="scheduler-chart-title">
                    Total de Horas Poupadas com Automacao Por Dia
                </div>
                <div className="scheduler-chart-empty">Sem dados para este periodo.</div>
            </div>
        );
    }

    const data = {
        labels,
        datasets: [
            {
                label: "Horas poupadas",
                data: values,
                borderColor: "#5A9BD5",
                backgroundColor: "rgba(90, 155, 213, 0.2)",
                tension: 0.35,
                pointRadius: 2,
                pointBackgroundColor: "#5A9BD5"
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className="scheduler-chart">
            <div className="scheduler-chart-title">
                Total de Horas Poupadas com Automacao Por Dia
            </div>
            <div className="scheduler-chart-canvas scheduler-chart-canvas-daily">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
