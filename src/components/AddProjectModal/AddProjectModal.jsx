import { useState } from "react";
import "./AddProjectModal.css";
import { API_BASE_URL } from "../../config/api";

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
    tt_min_exec: "",
    tt_semana: "",
    obs_agenda: "",
    Ambiente: ambiente
  });

  const agendaOptions = [
    { value: "1", label: "Segunda" },
    { value: "2", label: "Terça" },
    { value: "3", label: "Quarta" },
    { value: "4", label: "Quinta" },
    { value: "5", label: "Sexta" },
    { value: "6", label: "Sábado" },
    { value: "7", label: "Domingo" }
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAgendaChange = (e) => {
    const { value, checked } = e.target;
    const current = form.Agenda ? form.Agenda.split(",") : [];
    const next = checked
      ? [...current, value]
      : current.filter((item) => item !== value);
    setForm({ ...form, Agenda: next.join(",") });
  };

  // ------ SALVAR NO BACKEND ------
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/robots`, {
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
    <div className="apm-overlay">
      <div className="apm-modal">

        {/* HEADER */}
        <div className="apm-header">
          <h2>Adicionar Robô</h2>
          <button className="apm-btn-close" onClick={onClose}>×</button>
        </div>

        {/* FORM */}
        <form className="apm-form" onSubmit={handleSave}>
          <div className="apm-grid">

            <h3 className="apm-section">Informações Básicas</h3>

            <div className="apm-group third">
              <label>Identificador</label>
              <input name="Identificador" value={form.Identificador} onChange={handleChange} required />
            </div>

            <div className="apm-group third">
              <label>Nome do Robô</label>
              <input name="Nome" value={form.Nome} onChange={handleChange} required />
            </div>

            <div className="apm-group third">
              <label>Sigla DB</label>
              <input name="SiglaDB" value={form.SiglaDB} onChange={handleChange} required />
            </div>

            <div className="apm-group full">
              <label>Descrição</label>
              <textarea name="Descricao" rows={3} value={form.Descricao} onChange={handleChange} required/>
            </div>

            <div className="apm-group full">
              <label>Objetivo</label>
              <textarea name="Objetivo" rows={3} value={form.Objetivo} onChange={handleChange} required/>
            </div>

            <h3 className="apm-section">Responsáveis</h3>

            <div className="apm-group third">
              <label>Key User</label>
              <input name="Key_User" value={form.Key_User} onChange={handleChange} required/>
            </div>

            <div className="apm-group third">
              <label>Dev. Responsável</label>
              <select name="DevResp" value={form.DevResp} onChange={handleChange} required>
                <option value="">Selecione...</option>
                <option value="Vitor">Vitor</option>
                <option value="Danilo">Danilo</option>
              </select>
            </div>

            <div className="apm-group third">
              <label>Área responsável</label>
              <select name="AreaResponsavel" value={form.AreaResponsavel} onChange={handleChange} required>
                <option value="">Selecione...</option>
                <option value="Financeiro">Financeiro</option>
                <option value="Fiscal">Fiscal</option>
                <option value="Folha">Folha</option>
                <option value="GRSA">GRSA</option>
                <option value="Juridico">Juridico</option>
                <option value="Juridico Regional">Juridico Regional</option>
              </select>
            </div>

            <div className="apm-group third">
              <label>Diretor</label>
              <select name="Diretor" value={form.Diretor} onChange={handleChange} required>
                <option value="">Selecione...</option>
                <option value="Cassiano">Cassiano</option>
                <option value="Rodrigo">Rodrigo</option>
                <option value="Guilherme">Guilherme</option>
                <option value="Thiago">Thiago</option>
                <option value="Adriana">Adriana</option>
                <option value="Anderson">Anderson</option>
              </select>
            </div>

            <h3 className="apm-section">Tecnologia</h3>

            <div className="apm-group full">
              <label>Sistemas Utilizados</label>
              <textarea name="Sistemas_Utilizados" rows={2} value={form.Sistemas_Utilizados} onChange={handleChange} required/>
            </div>

            <div className="apm-group full">
              <label>Tecnologias Utilizadas</label>
              <textarea name="Tecnologias_Utilizadas" rows={2} value={form.Tecnologias_Utilizadas} onChange={handleChange} required/>
            </div>

            <h3 className="apm-section">Agenda</h3>

            <div className="apm-group third">
              <label>Data de Criação</label>
              <input type="date" name="Data_Criacao" value={form.Data_Criacao} onChange={handleChange} required/>
            </div>

            <div className="apm-group third">
              <label>Periodicidade</label>
              <select name="tt_semana" value={form.tt_semana} onChange={handleChange} required>
                <option value="">Selecione...</option>
                <option value="Diario">Diário</option>
                <option value="Semanal">Semanal</option>
                <option value="Quinzenal">Quinzenal</option>
                <option value="Mensal">Mensal</option>
              </select>
            </div>

            {form.tt_semana !== "Diario" && (
              <div className="apm-group third">
                <label>Agenda</label>
                <div className="apm-agenda-options">
                  {agendaOptions.map((option) => {
                    const checked = form.Agenda
                      ? form.Agenda.split(",").includes(option.value)
                      : false;
                    return (
                      <label className="apm-agenda-option" key={option.value}>
                        <input
                          type="checkbox"
                          value={option.value}
                          checked={checked}
                          onChange={handleAgendaChange}
                        />
                        <span>{option.label}</span>
                      </label>
                    );
                  })}
                </div>
                <input type="hidden" name="Agenda" value={form.Agenda} required />
              </div>
            )}

            <div className="apm-group third">
              <label>Minutos por execução</label>
              <input type="number" name="tt_min_exec" value={form.tt_min_exec} onChange={handleChange} required/>
            </div>

            <div className="apm-group full">
              <label>Observação adicional</label>
              <input type="text" name="obs_agenda" value={form.obs_agenda} onChange={handleChange} />
            </div>

          </div>

          {/* FOOTER */}
          <div className="apm-footer">
            <button type="button" className="apm-btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="apm-btn-save">
              Salvar
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}

export default AddProjectModal;

