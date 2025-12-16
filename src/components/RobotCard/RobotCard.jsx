import "./RobotCard.css";

function RobotCard({ robot, onDelete, openInfo, user, onTabChange }) {
  const {
    Id,
    Nome,
    Area_Responsavel,
    Descricao,
    Sigla_DB,
    Dev_Responsavel,
    Ultima_Exec
  } = robot;

  const ultimaExecucao =
    Ultima_Exec ? new Date(Ultima_Exec).toLocaleDateString("pt-BR") : "—";

  return (
    <div className="robot-card">
      <div className="robot-card-content" onClick={() => openInfo(robot)}>
        <header className="robot-card-header">
          <h3>{Nome}</h3>
          <span className={`area-badge ${Area_Responsavel}`}>
            {Area_Responsavel}
          </span>
        </header>

        <p className="robot-description">
          {Descricao || "Sem descrição"}
        </p>

        <div className="robot-info">
          <InfoRow label="Sigla DB:" value={Sigla_DB} />
          <InfoRow label="Dev. Responsável:" value={Dev_Responsavel} />
          <InfoRow label="Última Execução:" value={ultimaExecucao} />
        </div>
      </div>

      <div className="robot-card-actions">
        {robot.Ambiente !== 'Dev' && (
          <button className="btn-left" onClick={() => onTabChange(robot.Sigla_DB)}>Processamento</button>
        )}
        {user.role === "Administrador" && (
          <button className="btn-delete" onClick={() => onDelete(Id)}>Excluir</button>
        )}
      </div>
    </div>
  );
}

export default RobotCard;

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value || "—"}</span>
    </div>
  );
}
