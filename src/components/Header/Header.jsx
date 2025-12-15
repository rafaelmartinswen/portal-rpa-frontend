import "./Header.css";
import Modal from "../Modal/Modal";
import { RiRobot3Fill } from "react-icons/ri";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";

function Header({ user, onLoginClick }) {
    const [open, setOpen] = useState(false);
    const [openProfile, setOpenProfile] = useState(false);

    const initials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "?";

    return (
        <header className="header">
            <div className="header-left">
                <div className="logo-wrapper">
                    <RiRobot3Fill className="logo-icon" />
                </div>

                <div className="header-title">
                    <h1>Portal RPA GPS</h1>
                    <p>GPS • RPA • Automação</p>
                </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="desktop-nav">
                <button className="nav-link">Projetos</button>
                <button className="nav-link">Contato</button>
                <button className="btn-primary">
                    {user ? "Sair" : "Entrar"}
                </button>

                <div className="profile-card" onClick={() => setOpenProfile(user ? true : false)}>
                    <div className="avatar">{initials}</div>
                    <div className="profile-info">
                        <span className="name">
                            {user ? user.name : "Visitante"}
                        </span>
                        <span className="role">
                            {user ? user.role : "Clique para entrar"}
                        </span>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Toggle */}
            <div className="mobile-icon" onClick={() => setOpen(!open)}>
                {open ? <FiX size={28} /> : <FiMenu size={28} />}
            </div>

            {/* Mobile Navigation */}
            {open && (
                <nav className="mobile-nav">
                    <button className="mobile-link">Projetos</button>
                    <button className="mobile-link">Contato</button>
                    <button className="mobile-primary">Entrar</button>
                </nav>
            )}

            <Modal open={openProfile} onClose={() => setOpenProfile(false)}>
                <div className="profile-modal-header">
                    <div className="modal-avatar">{initials}</div>
                    <div>
                        <h2>{user?.name}</h2>
                        <span className="modal-role">{user?.role}</span>
                    </div>
                </div>

                <div className="profile-section">
                    <h3>Informações do Usuário</h3>

                    <div className="profile-field">
                        <label>Nome</label>
                        <input type="text" value={user?.name} readOnly />
                    </div>

                    <div className="profile-field">
                        <label>Email</label>
                        <input type="text" value={user?.email} readOnly />
                    </div>
                </div>

                <button className="btn-logout" onClick={() => alert("Sair...")}>
                    Sair da conta
                </button>
            </Modal>

        </header>
    );
}

export default Header;
