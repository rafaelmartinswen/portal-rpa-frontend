import "./RobotInfoModal.css";

function RobotInfoModal({ robot, onClose }) {
  if (!robot) return null;

  return (
    <div className="modal-overlay">
      <div className="robot-modal-content">
        <h2 className="modal-title">Detalhes do Projeto</h2>

        {/* Seções de informações */}
        <InfoGroup>
          <InfoField label="Nome" value={robot.Nome} />
          <InfoField label="Descrição" value={robot.Descricao} />
        </InfoGroup>

        <InfoGroup>
          <InfoField label="Área responsável" value={robot.Area_Responsavel} />
          <InfoField label="Dev. responsável" value={robot.Dev_Responsavel} />
        </InfoGroup>

        <InfoGroup>
          <InfoField label="Key User" value={robot.Key_User} />
          <InfoField label="Sigla DB" value={robot.Sigla_DB} />
        </InfoGroup>

        {/* Card de anexos */}
        <div className="scheduler-card">
            <div className="scheduler-card-header" style={{height: "30px"}}>
                <h3 style={{marginTop: "2px"}}>Anexos</h3>
            </div>
            <div className="scheduler-card-body">
                <table>
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th><p>Gravação do robô</p></th>
                            <th><p>https://google.com.br</p></th>
                        </tr>
                        <tr>
                            <th><p>Documentação do robô</p></th>
                            <th><p>https://google.com.br</p></th>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {/* Botões */}
        <div className="modal-buttons">
          <button className="btn-close" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}

export default RobotInfoModal;

/* --------------------------------------
 * COMPONENTES AUXILIARES
 * -------------------------------------- */

function InfoGroup({ children }) {
  return <div className="info-group">{children}</div>;
}

function InfoField({ label, value }) {
  return (
    <div className="info-field">
      <label>{label}</label>
      <div className="info-field-value">{value || "—"}</div>
    </div>
  );
}
