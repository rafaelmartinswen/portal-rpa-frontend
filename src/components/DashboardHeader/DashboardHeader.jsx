import { useState } from "react";
import Navigation from "../Navigation/Navigation";
import Production from "../Tabs/Production/Production";
import LandingPage from "../Tabs/LandingPage/LandingPage";
import Development from "../Tabs/Development/Development";
import Scheduler from "../Tabs/Scheduler/Scheduler";
import Management from "../Tabs/Management/Management";
import ProjectManagement from "../Tabs/ProjectManagement/ProjectManagement";
import SpecificProject from "../Tabs/SpecificProject/SpecificProject";

function DashboardHeader({ user }) {

  // PERMISSÕES 
  const permissions = {
    Administrador: [
      "landingpage",
      "excalcrescisao",
      "extfgtscxe",
      "production",
      "development",
      "scheduler",
      "projects",
      "management"
    ],
    Usuario: ["landingpage","projects","scheduler"] // Depois vamos alterar para apenas pessoas da area específica...
  };

  // Pegando o role e abas permitidas
  const role = user?.role || "Operador";
  const allowedTabs = permissions[role] || [];

  // States
  const [activeTab, setActiveTab] = useState(
    allowedTabs.includes("landingpage") ? "landingpage" : allowedTabs[0]
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);

  // 4️⃣ Renderiza conteúdo baseado no activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case "landingpage":
        return <LandingPage user={user} onTabChange={setActiveTab}/>;
      case "production":
        return <Production user={user} onTabChange={setActiveTab}/>;
      case "development":
        return <Development user={user} onTabChange={setActiveTab}/>;
      case "scheduler":
        return <Scheduler user={user}/>;
      case "management":
        return <Management />;
      case "projectManagement":
        return <ProjectManagement />;
      case "projectHistory":
        return <ProjectHistory user={user}/>;
      default:
        return <SpecificProject project={activeTab} />;
    }
  };

  // 5️⃣ HTML
  return (
    <div className="layout-container">

      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen((prev) => !prev)}
      >
        ☰
      </button>

      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <Navigation
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setSidebarOpen(false);
          }}
          allowedTabs={allowedTabs}
          user={user}
        />
      </aside>

      <main className="content">
        {renderTabContent()}
      </main>
    </div>
  );
}

export default DashboardHeader;
