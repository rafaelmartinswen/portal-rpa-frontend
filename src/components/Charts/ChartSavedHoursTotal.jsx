import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function ChartSavedHoursTotal({ totalHours = 0 }) {
    const safeTotal = Number.isFinite(totalHours) ? totalHours : 0;
    const rounded = Math.round(safeTotal);
    const formatted = new Intl.NumberFormat("pt-BR").format(rounded);

    const data = {
        labels: ["Total"],
        datasets: [
            {
                label: "",
                data: [rounded],
                backgroundColor: "#5A9BD5",
                borderRadius: 6,
                barThickness: 40
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.parsed.y}h`
                }
            }
        },
        scales: {
            x: { display: false },
            y: {
                beginAtZero: true,
                ticks: { display: false },
                grid: { display: false }
            }
        }
    };

    return (
        <div className="scheduler-chart">
            <div className="scheduler-chart-title">
                Total de Horas Poupadas com Automacao
            </div>
            <div className="scheduler-chart-total">{formatted}</div>
            <div className="scheduler-chart-canvas scheduler-chart-canvas-total">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
