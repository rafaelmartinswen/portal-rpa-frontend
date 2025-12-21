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

export default function ChartProjects({ projects = [], type }) {
    let color = "#999";

    // 🔥 Reduz nomes longos de Key Users e Diretores
    const reduzirNome = (nome) => {
        if (!nome) return "Não informado";
        const partes = nome.trim().split(" ");
        if (partes.length <= 2) return nome;
        return partes[0] + " " + partes[partes.length - 1];
    };

    // 🔥 Contador genérico
    const contarPorCampo = (campo) => {
        const contagens = {};
        projects.forEach(p => {
            const valor = p[campo] || "Não informado";
            contagens[valor] = (contagens[valor] || 0) + 1;
        });
        return contagens;
    };

    let contagem = {};

    switch (type) {
        case "projectsByArea":
            contagem = contarPorCampo("Area_Responsavel");
            color = "#FF7A59";
            break;

        case "projectsByKeyUser":
            contagem = contarPorCampo("Key_User");
            color = "#59a6ffff";
            break;

        case "projectsByDiretoria":
            contagem = contarPorCampo("Diretor");
            color = "#3db15aff";
            break;

        default:
            contagem = {};
    }

    // 🔥 Labels
    let labels = Object.keys(contagem);

    // Aplica redução somente em nomes
    if (type === "projectsByKeyUser" || type === "projectsByDiretoria") {
        labels = labels.map(nome => reduzirNome(nome));
    }

    const valores = Object.values(contagem);

    // 🔥 Define um máximo maior que o maior valor real
    const maxValor = Math.max(...valores, 0);
    const maxEscala = maxValor + 1; // pode ajustar para +2 se quiser mais folga

    // 🔥 Altura dinâmica (aumenta conforme o número de barras)
    const altura = Math.max(200, labels.length * 40);

    const data = {
        labels,
        datasets: [
            {
                label: "",
                data: valores,
                backgroundColor: color,
                borderRadius: 4,
                barThickness: 10,
                categoryPercentage: 0.6,
                barPercentage: 0.6,
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
            title: { display: false }
        },
        scales: {
            x: { 
                beginAtZero: true,
                suggestedMax: maxEscala,
                ticks: {
                    stepSize: 1,   // 🔥 força a escala ser 1 em 1
                }
            },
            y: { 
                ticks: { font: { size: 12 }, color: "#333" } 
            }
        }
    };

    return (
        <div style={{ width: "100%", height: altura }}>
            <Bar data={data} options={options} />
        </div>
    );
}
