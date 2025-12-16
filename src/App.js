import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!API_URL) {
      console.error("REACT_APP_API_URL não definida no build");
      alert("Erro de configuração da aplicação");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { username, password }
      );

      console.log("Login OK:", response.data);
      onLogin(response.data);

    } catch (error) {
      console.error("Erro no login:", error);
      alert("Usuário ou senha inválidos");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;
