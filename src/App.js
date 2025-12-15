import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        { username, password }
      );

      console.log("Login OK:", response.data);

      // devolve dados do usuário para o App.js
      onLogin(response.data);

    } catch (error) {
      console.error("Erro no login:", error);
      alert("Usuário/senha inválidos");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input 
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Entrar</button>
    </form>
  );
}

export default Login;
// Deploy test
