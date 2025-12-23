import './Users.css';
import Modal from "../Modal/Modal";
import { useEffect, useState  } from "react";
import { FaCircleUser } from "react-icons/fa6";
import { FiAlertCircle } from "react-icons/fi";

function Users () {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);
    const [openAddModal, setOpenAddModal] = useState(false);
    const [openActionUser, setOpenActionUser] = useState(false);
    const [selectedUser, setSelectedUser] = useState([]);
    const [selectedAction, setSelectedAction] = useState(null);
    const initialFormState = {
        Nome: "",
        Username: "",
        Email: "",
        Senha: "",
        tipoUsuario: "",
        AreaResponsavel: "Usu"
    };
    const [form, setForm] = useState(initialFormState);
    const API_URL = process.env.REACT_APP_API_URL_DEV;

    const loadUsers = () => {
        fetch(`${API_URL}/users`)
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    function handleAction(user, action) {
        setSelectedUser(user);
        setSelectedAction(action);
        setOpenActionUser(true);
    }

    // ------ SALVAR NO BD ------
    const handleSave = async (e) => {
        e.preventDefault();

        try {
        const response = await fetch(`${API_URL}/users`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        if (!response.ok) {
            throw new Error("Erro ao salvar no backend");
        }

        alert("Usuário adicionado com sucesso!");
        setForm(initialFormState);
        setOpenAddModal(false);
        loadUsers(); // recarrega a lista

        } catch (err) {
        console.error(err);
        alert("Erro ao salvar.");
        }
    };

    const deleteUser = async (id) => {
        try {
        console.log("Tentando deletar usuário:", id);
        
        const response = await fetch(`${API_URL}/users/${id}`, {
            method: 'DELETE',
        });

        console.log("Status da resposta:", response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.log("Erro da API:", errorText);
            throw new Error('Erro ao deletar usuário');
        }

        const result = await response.json();
        console.log("Sucesso:", result);

        // Recarrega a lista completa de usuários
        setOpenActionUser(false);
        loadUsers();
        
        } catch (error) {
        console.error('Erro completo:', error);
        throw error;
        }
    };

    const filteredUsers = users.filter(user =>
        user?.Nome?.toLowerCase().includes(search.toLowerCase())
    );
    
    return (
        <div className='users'>
            <div className='search-tabs'>
                <input 
                    type='text' 
                    placeholder='Pesquisar' 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="button-tabs" onClick={() => setOpenAddModal(true)}>Adicionar</button>
            </div>
            <div className='section-cards'>
                {filteredUsers.map((user) => (
                    <div className="VM-card" key={user.Nome}>
                        {/* STATUS NO CANTO SUPERIOR DIREITO */}
                        <button className={`user-area ${user.RoleType !== 'Administrador' ? user.Area_resp : user.RoleType}`}>
                            {user.RoleType !== 'Administrador' ? user.Area_resp : user.RoleType}
                        </button>

                        <div className="vm-icon"><FaCircleUser className='vm-icon-img'/></div>

                        <div className="vm-info">
                            <h4>{user.Nome}</h4>
                            <p>{user.Username}</p>
                        </div>

                        <div className="vm-actions">
                            <button className="btn edit" >
                                Editar
                            </button>

                            <button className="btn delete" onClick={() => handleAction(user, "excluir")}>
                                Excluir
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal open={openAddModal} onClose={() => setOpenAddModal(false)}>
                <h2>Adicionar Usuário</h2>

                <form onSubmit={handleSave}>
                    <div className="form-grid">
                        <div className="form-group half">
                            <label>Nome</label>
                            <input
                            type="text"
                            name="Nome"
                            value={form.Nome}
                            onChange={handleChange}
                            placeholder="Digite o nome"
                            required={true}
                            />
                        </div>

                        <div className="form-group half">
                            <label>Username</label>
                            <input
                            type="text"
                            name="Username"
                            value={form.Username}
                            onChange={handleChange}
                            placeholder="Digite o nome de usuário"
                            required={true}
                            />
                        </div>

                        <div className="form-group half">
                            <label>E-mail</label>
                            <input
                            type="text"
                            name="Email"
                            value={form.Email}
                            onChange={handleChange}
                            placeholder="Digite o e-mail"
                            required={true}
                            />
                        </div>

                        <div className="form-group half">
                            <label>Senha</label>
                            <input
                            type="password"
                            name="Senha"
                            value={form.Senha}
                            onChange={handleChange}
                            placeholder="***********"
                            required={true}
                            />
                        </div>

                        <div className="form-group half">
                            <label>Tipo de usuário</label>
                            <select name="tipoUsuario" value={form.tipoUsuario} onChange={handleChange} required={true}>
                                <option value="">Selecione...</option>
                                <option value="Administrador">Administrador</option>
                                <option value="Usuario">Usuário</option>
                            </select>
                        </div>

                        <div className="form-group half">
                            <label>Área responsável</label>
                            <select name="AreaResponsavel" value={form.AreaResponsavel} onChange={handleChange} required={form.tipoUsuario === 'Usuario'}>
                                <option value="">Selecione...</option>
                                <option value="Financeiro">Financeiro</option>
                                <option value="Fiscal">Fiscal</option>
                                <option value="Fiscal 2">Fiscal 2</option>
                                <option value="Folha">Folha</option>
                                <option value="GRSA">GRSA</option>
                                <option value="Juridico">Juridico</option>
                                <option value="Juridico Regional">Juridico Regional</option>
                            </select>
                        </div>
                    </div>

                    <div className="modal-buttons">
                        <button className="btn-cancel" onClick={() => setOpenAddModal(false)}>Cancelar</button>
                        <button type="submit" className="btn-save">Salvar</button>
                    </div>
                </form>
            </Modal>

            <Modal open={openActionUser} onClose={() => setOpenActionUser(false)}>
                <div className="confirmacao-container">
                    <div className="confirmacao-icon">
                        <FiAlertCircle size={50} />
                    </div>

                    <h2>Confirmação</h2>
                    <p>
                        Tem certeza que deseja <strong>{selectedAction}</strong> o usuário{" "}
                        <strong>{selectedUser.Nome ?? ''}</strong>?
                    </p>

                    <div className="confirmacao-buttons">
                        <button className="btn-sim" onClick={() => deleteUser(selectedUser.Id)}>Sim</button>
                        <button className="btn-nao" onClick={() => setOpenActionUser(false)}>Não</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default Users;
