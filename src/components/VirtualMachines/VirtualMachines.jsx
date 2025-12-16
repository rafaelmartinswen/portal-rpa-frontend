import './VirtualMachines.css';
import Modal from "../Modal/Modal";
import { useEffect, useState  } from "react";
import { IoIosLaptop } from "react-icons/io";
import { FiAlertCircle } from "react-icons/fi";

function VirtualMachines() {
    const [search, setSearch] = useState("");
    const [vms, setVms] = useState([]);
    const [openActionVM, setOpenActionVM] = useState(false);
    const [selectedVM, setSelectedVM] = useState(null);
    const [selectedAction, setSelectedAction] = useState(null);

    async function fetchVMs() {
        try {
        const response = await fetch("https://portal-rpa-backend.bravedune-0c4b692e.eastus2.azurecontainerapps.io/azure/listar-vms", {
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

    useEffect(() => {
        fetchVMs();
    }, []);

    const filteredVMs = vms.filter(vm =>
        vm?.name?.toLowerCase().includes(search.toLowerCase())
    );

    function handleAction(vmName, action) {
        setSelectedVM(vmName);
        setSelectedAction(action);
        setOpenActionVM(true);
    }

    async function confirmAction() {
        try {
            const response = await fetch("https://portal-rpa-backend.bravedune-0c4b692e.eastus2.azurecontainerapps.io/azure/acao-vm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    vmName: selectedVM,
                    acao: selectedAction
                })
            });

            const data = await response.json();
            console.log("Ação executada:", data);

            // fechar modal
            setOpenActionVM(false);

            // atualizar lista de VMs após ação
            setTimeout(() => {
                fetchVMs();
            }, 3000); // espera 3 segundos p/ Azure atualizar o estado

        } catch (error) {
            console.error("Erro ao executar ação:", error);
        }
    }

    return (
    <div className='virtualmachines'>
        <div className='search-tabs'>
            <input 
                type='text' 
                placeholder='Pesquisar' 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />
            <button className="button-qtd-vms">{filteredVMs.length}</button>
        </div>
        <div className='section-cards'>
            {filteredVMs.map(item => (
                <div className="VM-card" key={item.name}>

                    {/* STATUS NO CANTO SUPERIOR DIREITO */}
                    <button className={`vm-status ${item.status.split("/")[1] === "running" ? "on" : "off"}`}>
                        {item.status.split("/")[1]}
                    </button>

                    <div className="vm-icon"><IoIosLaptop className='vm-icon-img'/></div>

                    <div className="vm-info">
                        <h4>{item.name}</h4>
                        <p>Computer {item.name}</p>
                    </div>

                    <div className="vm-actions">
                        <button className="btn start" onClick={() => handleAction(item.name, "start")}>
                            Ligar
                        </button>

                        <button className="btn stop" onClick={() => handleAction(item.name, "powerOff")}>
                            Desligar
                        </button>

                        <button className="btn restart" onClick={() => handleAction(item.name, "restart")}>
                            Reiniciar
                        </button>
                    </div>

                </div>
            ))}
        </div>

        <Modal open={openActionVM} onClose={() => setOpenActionVM(false)}>
            <div className="confirmacao-container">
                <div className="confirmacao-icon">
                    <FiAlertCircle size={50} />
                </div>

                <h2>Confirmação</h2>
                <p>
                    Tem certeza que deseja <strong>{selectedAction}</strong> a VM{" "}
                    <strong>{selectedVM}</strong>?
                </p>

                <div className="confirmacao-buttons">
                    <button className="btn-sim" onClick={confirmAction}>Sim</button>
                    <button className="btn-nao" onClick={() => setOpenActionVM(false)}>Não</button>
                </div>
            </div>
        </Modal>
    </div>
    );
}

export default VirtualMachines;