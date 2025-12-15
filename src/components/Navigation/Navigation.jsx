import PropTypes from "prop-types";
import { FaIndustry, FaCode, FaCalendarAlt, FaSearch, FaRobot, FaHome } from "react-icons/fa";
import "./Navigation.css";

const ALL_TABS = [
  { id: "landingpage", label: "Início", icon: FaHome },
  { id: "excalcrescisao", label: "Cálculo de Rescisões", icon: FaRobot },
  { id: "extfgtscxe", label: "Solicitação FGTS", icon: FaRobot },
  { id: "production", label: "Produção", icon: FaIndustry },
  { id: "development", label: "Desenvolvimento", icon: FaCode },
  { id: "scheduler", label: "Scheduler", icon: FaCalendarAlt },
];

export default function Navigation({ activeTab, onTabChange, allowedTabs }) {
  
  const visibleTabs = ALL_TABS.filter(tab => allowedTabs.includes(tab.id));

  return (
    <nav className="navigation">
      <div className="nav-container">

        {/* BUSCA */}
        <div className="nav-search">
          <FaSearch className="search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder="Buscar..."
            aria-label="Buscar"
          />
        </div>

        {/* ABAS */}
        <div className="nav-tabs">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;

            return (
              <button
                key={tab.id}
                disabled={tab.disabled}
                className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
                onClick={() => !tab.disabled && onTabChange(tab.id)}
              >
                <Icon className="tab-icon" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

      </div>
    </nav>
  );
}

Navigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  allowedTabs: PropTypes.arrayOf(PropTypes.string).isRequired,
};
