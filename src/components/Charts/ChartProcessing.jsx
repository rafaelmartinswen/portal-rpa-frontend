import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function ChartProcessamentos({ logs = [], startDate, endDate }) {
    const parseInputDate = (value) => {
        if (!value) return null;
        const [year, month, day] = value.split("-").map(Number);
        return new Date(year, month - 1, day);
    };

    const today = new Date();
    const maxBoundary = new Date(today);
    maxBoundary.setHours(23, 59, 59, 999);

    const minBoundary = new Date();
    minBoundary.setDate(minBoundary.getDate() - 30);
    minBoundary.setHours(0, 0, 0, 0);

    const clampToRange = (date) => {
        if (!date) return null;
        if (date < minBoundary) return new Date(minBoundary);
        if (date > maxBoundary) return new Date(maxBoundary);
        return date;
    };

    // Agrupa execucoes por dia (dd/mm)
    const contagemPorDia = {};

    logs.forEach((item) => {
        const data = new Date(item.Data_Processo);
        if (Number.isNaN(data.getTime())) return;

        const dia = data.toLocaleDateString("pt-BR").slice(0, 5);
        contagemPorDia[dia] = (contagemPorDia[dia] || 0) + 1;
    });

    // Determina range do grafico combinando filtros e dados existentes
    const datasOrdenadas = Object.keys(contagemPorDia)
        .map((d) => {
            const [dia, mes] = d.split("/").map(Number);
            return new Date(new Date().getFullYear(), mes - 1, dia);
        })
        .sort((a, b) => a - b);

    let dataMin = startDate ? parseInputDate(startDate) : datasOrdenadas[0];
    let dataMax = endDate ? parseInputDate(endDate) : datasOrdenadas[datasOrdenadas.length - 1];

    dataMin = clampToRange(dataMin);
    dataMax = clampToRange(dataMax);

    if (!dataMin && dataMax) dataMin = dataMax;
    if (!dataMax && dataMin) dataMax = dataMin;

    if (!dataMin || !dataMax) {
        return (
            <div className="ov-chart-placeholder" style={{textAlign: 'center'}}>
                <p>Sem dados para este periodo.</p>
            </div>
        );
    }

    dataMin.setHours(0, 0, 0, 0);
    dataMax.setHours(23, 59, 59, 999);

    if (dataMin > dataMax) {
        [dataMin, dataMax] = [dataMax, dataMin];
    }

    // Gera sequencia continua de dias dentro do range
    const labels = [];
    const valores = [];

    const cursor = new Date(dataMin);

    while (cursor <= dataMax) {
        const diaFormatado = cursor.toLocaleDateString("pt-BR").slice(0, 5);
        labels.push(diaFormatado);
        valores.push(contagemPorDia[diaFormatado] ?? 0);

        cursor.setDate(cursor.getDate() + 1);
    }

    const data = {
        labels,
        datasets: [
            {
                label: "Processamentos",
                data: valores,
                backgroundColor: "#FF7A59",
                borderRadius: 4
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { stepSize: 50 }
            }
        }
    };

    return (
        <div className="ov-chart-placeholder">
            <Bar data={data} options={options} />
        </div>
    );
}
