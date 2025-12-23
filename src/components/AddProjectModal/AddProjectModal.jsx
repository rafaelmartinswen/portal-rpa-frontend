import { useState } from "react";
import "./AddProjectModal.css";

function AddProjectModal({ onClose, ambiente }) {
  const [form, setForm] = useState({
    Identificador: "", 
    Nome: "", 
    Descricao: "", 
    SiglaDB: "",
    DevResp: "", 
    AreaResponsavel: "", 
    Diretor: "", 
    Key_User: "", 
    Objetivo: "", 
    Data_Criacao: "", 
    Sistemas_Utilizados: "", 
    Tecnologias_Utilizadas: "", 
    Qtd_Robos: "1", 
    Agenda: "",
    Ambiente: ambiente
  });
  const API_URL = process.env.REACT_APP_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ------ SALVAR NO BACKEND ------
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/robots`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar no backend");
      }

      alert("Robô inserido com sucesso!");
      onClose();

    } catch (err) {
      console.error(err);
      alert("Erro ao salvar.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Adicionar Robô</h2>

        <form onSubmit={handleSave}>
          <div className="form-grid">

            <div className="form-group half">
              <label>Identificador</label>
              <input
                type="text"
                name="Identificador"
                value={form.Identificador}
                onChange={handleChange}
                placeholder="Digite o identificador"
                required={true}
              />
            </div>

            <div className="form-group half">
              <label>Nome do Robô</label>
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
              <label>Descrição</label>
              <input
                type="text"
                name="Descricao"
                value={form.Descricao}
                onChange={handleChange}
                placeholder="Descrição"
                required={true}
              />
            </div>

            <div className="form-group half">
              <label>Objetivo</label>
              <input
                type="text"
                name="Objetivo"
                value={form.Objetivo}
                onChange={handleChange}
                placeholder="Objetivo"
                required={true}
              />
            </div>

            <div className="form-group third">
              <label>Key User</label>
              <input
                type="text"
                name="Key_User"
                value={form.Key_User}
                onChange={handleChange}
                placeholder="Digite o key user"
                required={true}
              />
            </div>

            <div className="form-group third">
              <label>Sigla DB</label>
              <input
                type="text"
                name="SiglaDB"
                value={form.SiglaDB}
                onChange={handleChange}
                placeholder="Nome do projeto no DB"
                required={true}
              />
            </div>

            <div className="form-group third">
              <label>Data de Criação</label>
              <input
                type="date"
                name="Data_Criacao"
                value={form.Data_Criacao}
                onChange={handleChange}
                required={true}
              />
            </div>

            <div className="form-group third">
              <label>Dev. responsável</label>
              <select name="DevResp" value={form.DevResp} onChange={handleChange} required={true}>
                <option value="">Selecione...</option>
                <option value="Vitor">Vitor</option>
                <option value="Danilo">Danilo</option>
              </select>
            </div>

            <div className="form-group third">
              <label>Área responsável</label>
              <select name="AreaResponsavel" value={form.AreaResponsavel} onChange={handleChange} required={true}>
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

            <div className="form-group third">
              <label>Diretor</label>
              <select name="Diretor" value={form.Diretor} onChange={handleChange} required={true}>
                <option value="">Selecione...</option>
                <option value="Anderson Nunes">Anderson Nunes</option>
                <option value="Claudio Petruz">Claudio Petruz</option>
                <option value="Cassiano José Gonçalves Vianna">Cassiano José</option>
                <option value="Guilherme Robortella">Guilherme</option>
                <option value="Rodrigo Marques França">Rodrigo Marques</option>
                <option value="Thiago Nunes Costa">Thiago</option>
                <option value="Vinicius Andrade">Vinicius</option>
              </select>
            </div>
            
            <div className="form-group third">
              <label>Sistemas utilizados</label>
              <input
                type="text"
                name="Sistemas_Utilizados"
                value={form.Sistemas_Utilizados}
                onChange={handleChange}
                placeholder="Sistemas Utilizados"
                required={true}
              />
            </div>

            <div className="form-group third">
              <label>Tecnologias utilizadas</label>
              <input
                type="text"
                name="Tecnologias_Utilizadas"
                value={form.Tecnologias_Utilizadas}
                onChange={handleChange}
                placeholder="Tecnologias utilizadas"
                required={true}
              />
            </div>

            <div className="form-group third">
              <label>Agenda</label>
              <select name="Agenda" value={form.Agenda} onChange={handleChange} required={true}>
                <option value="">Selecione...</option>
                <option value="1">Segunda-feira</option>
                <option value="2">Terça-feira</option>
                <option value="3">Quarta-feira</option>
                <option value="4">Quinta-feira</option>
                <option value="5">Sexta-feira</option>
                <option value="9">Mensal</option>
              </select>
            </div>
          </div>

          <div className="modal-buttons">
            <button className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddProjectModal;

