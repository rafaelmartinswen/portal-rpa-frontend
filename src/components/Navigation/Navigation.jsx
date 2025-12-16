import PropTypes from "prop-types";
import { FaCalendarAlt, FaSearch, FaHome } from "react-icons/fa";
import { VscRobot } from "react-icons/vsc";
import { RiAdminFill } from "react-icons/ri";
import "./Navigation.css";

const ALL_TABS = [
  { id: "landingpage",    label: "Início", icon: FaHome },
  { id: "projects",       label: "Projetos", icon: VscRobot },
  { id: "scheduler",      label: "Agendamentos", icon: FaCalendarAlt },
  { id: "management",     label: "Infraestrutura", icon: RiAdminFill },
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
