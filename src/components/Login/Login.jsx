import { useState } from "react";
import "./Login.css";

function Login({ onLogin }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, pass })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Usuário ou senha incorretos!");
        return;
      }

      // Backend retornou OK → chama o onLogin já existente
      onLogin({
        name: data.name,
        role: data.role,
        email: data.email
      });

    } catch (err) {
      alert("Erro ao conectar ao servidor!");
      console.error(err);
    }
  };

  return (
    <div className="login-container"> 
      <div className="extra-img-natal">
        <img src="/images/pngtree-christmas-removebg.png" alt="robot" />
      </div>
      <div className="top-login-container">
        <h2>GPS</h2>
      </div>
      <div className="body-login-container">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="top-login-card">
            <h2>Acesso ao Sistema</h2>
          </div>
          <label>Usuário</label>
          <input
            type="text"
            placeholder="Digite o seu Usuário"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            required
          />
          
          <label>Senha</label>
          <input
            type="password"
            placeholder="Digite a sua Senha"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />

          <div className="lembrar-me">
            <label>
              <input type="checkbox" />
              <span>Lembrar acesso</span>
            </label>
          </div>

          <button type="submit">Entrar</button>

          <div className="bot-login-card">
            <p>Não possui conta? Cadastre-se <span>aqui!</span></p>
          </div>
        </form>
        <img src="/images/robot_rpa.png" alt="robot" />
      </div>
    </div>
  );
}

export default Login;