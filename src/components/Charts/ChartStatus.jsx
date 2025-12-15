import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ChartDataLabels);

export default function ChartStatus({ logs = [] }) {

    const statusMap = {
        "1": "Concluído",
        "-1": "Sem MRH",
        "-9": "Integrado",
        "-15": "Transferido",
        "-7": "Já calculada",
        "-10": "Incorreta",
    };

    // --- Monta contagens ---
    const contagem = {
        "Processamentos": logs.length,
        "Concluído": 0,
        "Integrado": 0,
        "Transferido": 0,
        "Já calculada": 0,
        "Incorreta": 0,
        "Sem MRH": 0,
    };

    logs.forEach(log => {
        const statusNome = statusMap[log.Status_Processo];
        if (statusNome) contagem[statusNome]++;
    });

    const labels = [
        "Processamentos",
        "Concluído",
        "Integrado",
        "Transferido",
        "Já calculada",
        "Incorreta",
        "Sem MRH",
    ];

    const valores = labels.map(label => contagem[label] ?? 0);

    const data = {
        labels,
        datasets: [
            {
                label: "",
                data: valores,
                backgroundColor: "#FF7A59",
                borderRadius: 5,
                barThickness: 14,
            }
        ]
    };

    const options = {
        indexAxis: "y",
        maintainAspectRatio: false,
        responsive: true,

        plugins: {
            legend: { display: false },
            datalabels: {
                anchor: "end",
                align: "right",
                color: "#444",
                font: { size: 10, weight: "bold" },
                formatter: value => value
            },
            title: {
                display: true,
                text: "Processamento por Status",
                font: { size: 16 },
                color: "#555",
                padding: 20
            }
        },
        scales: {
            x: { beginAtZero: true },
            y: {
                ticks: { font: { size: 12 }, color: "#333" }
            }
        }
    };

    return (
        <div style={{ width: "80%", height: "300px" }}>
            <Bar data={data} options={options} />
        </div>
    );
}
