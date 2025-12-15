import { useEffect, useState } from "react";
import "./Projects.css";
import Production from "../Production/Production";
import Development from "../Development/Development";

function Projects ( {user, onTabChange} ) {
    const [typeProject, setTypeProject] = useState("Prod");

    const handleToggle = (event) => {
        setTypeProject(event.target.checked ? "Dev" : "Prod");
    };
    
    return (
        <div className="projects">

            <div className="topo-tabs">
                <h2>Robôs em {typeProject == 'Prod' ? 'Produção' : 'Desenvolvimento'}</h2>
                <label className="toggle">
                <input 
                    type="checkbox"
                    checked={typeProject === "Dev"}
                    onChange={handleToggle}
                    disabled={user.role != 'Administrador'}
                />
                <span className="slider">
                    <span className="on">Prod</span>
                    <span className="off">Dev</span>
                </span>
                </label>
            </div>

            {typeProject == "Prod" ? <Production user={user} onTabChange={onTabChange}/> : <Development user={user}/>}
        </div>
    );
}

export default Projects;