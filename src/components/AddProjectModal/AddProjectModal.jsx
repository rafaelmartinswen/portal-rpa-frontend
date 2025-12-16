import { useState } from "react";
import "./AddProjectModal.css";

function AddProjectModal({ onClose, ambiente }) {
  const [form, setForm] = useState({
    Nome: "",
    Descricao: "",
    SiglaDB: "",
    DevResp: "Vitor",
    AreaResponsavel: "",
    Agenda: "",
    Ambiente: ambiente
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ------ SALVAR NO BACKEND ------
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://portal-rpa-backend.bravedune-0c4b692e.eastus2.azurecontainerapps.io/robots", {
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
          <div className="form-group">
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

          <div className="form-group">
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

          <div className="form-group">
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

          <div className="form-group">
            <label>Dev. responsável</label>
            <select name="DevResp" value={form.DevResp} onChange={handleChange}>
              <option value="Vitor">Vitor</option>
              <option value="Danilo">Danilo</option>
            </select>
          </div>

          <div className="form-group">
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

          <div className="form-group">
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
