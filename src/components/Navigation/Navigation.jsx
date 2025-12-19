import PropTypes from "prop-types";
import { useState } from "react";
import { FaCalendarAlt, FaSearch, FaHome } from "react-icons/fa";
import { RiRobot3Line, RiRobot3Fill } from "react-icons/ri";
import { DiAptana } from "react-icons/di";
import { VscRobot } from "react-icons/vsc";
import { RiAdminFill } from "react-icons/ri";
import "./Navigation.css";

const ALL_TABS = [
  { id: "landingpage", label: "Início", icon: FaHome },

  {
    id: "projects",
    label: "Projetos",
    icon: VscRobot,
    children: [
      {
        id: "production",
        label: "Produção",
        icon: RiRobot3Fill,
      },
      {
        id: "development",
        label: "Desenvolvimento",
        icon: RiRobot3Line,
      },
      {
        id: "projectsManagement",
        label: "Gestão",
        icon: DiAptana,
      },
    ],
  },

  { id: "scheduler", label: "Agendamentos", icon: FaCalendarAlt },
  { id: "management", label: "Infraestrutura", icon: RiAdminFill },
];

export default function Navigation({ activeTab, onTabChange, allowedTabs, user }) {
  const [openMenu, setOpenMenu] = useState(null);

  const visibleTabs = ALL_TABS.filter(tab =>
    allowedTabs.includes(tab.id)
  );

  const filterChildrenByRole = (children) => {
    if (user?.role === "Administrador") {
      return children;
    }

    return children.filter(
      child => child.id === "production"
    );
  };

  return (
    <nav className="navigation" aria-label="Menu principal">
      <div className="nav-container">

        {/* BUSCA */}
        <div className="nav-search">
          <FaSearch className="search-icon" aria-hidden="true" />
          <input type="text" placeholder="Buscar..." />
        </div>

        {/* MENU */}
        <ul className="nav-tabs" role="menu">
          {visibleTabs.map(tab => {
            const Icon = tab.icon;
            const hasChildren = tab.children?.length;

            return (
              <li key={tab.id} className="nav-item">

                {/* ITEM PRINCIPAL */}
                <button
                  className={`tab-button ${
                    activeTab === tab.id ? "active" : ""
                  }`}
                  onClick={() => {
                    if (hasChildren) {
                      setOpenMenu(openMenu === tab.id ? null : tab.id);
                    } else {
                      onTabChange(tab.id);
                      setOpenMenu(null);
                    }
                  }}
                  aria-haspopup={hasChildren}
                  aria-expanded={openMenu === tab.id}
                >
                  <Icon className="tab-icon" />
                  <span>{tab.label}</span>
                </button>

                {/* SUBMENU */}
                {hasChildren && openMenu === tab.id && (
                <ul className="submenu">
                  {filterChildrenByRole(tab.children).map(child => (
                    <li key={child.id}>
                      <button
                        className={`submenu-item ${
                          activeTab === child.id ? "active" : ""
                        }`}
                        onClick={() => {
                          onTabChange(child.id);
                          setOpenMenu(null);
                        }}
                      >
                        {child.icon && <child.icon className="submenu-icon" />}
                        <span>{child.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              </li>
            );
          })}
        </ul>

      </div>
    </nav>
  );
}

Navigation.propTypes = {
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  allowedTabs: PropTypes.arrayOf(PropTypes.string).isRequired,
};