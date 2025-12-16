import { useState, useEffect } from "react";
import Header from "./components/Header/Header";
import DashboardHeader from "./components/DashboardHeader/DashboardHeader";
import Login from "./components/Login/Login";

const AUTH_KEY = "gps.auth";

function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null); // ÐY"¾ novo estado do usuÇ­rio

  useEffect(() => {
    const saved = localStorage.getItem(AUTH_KEY) || sessionStorage.getItem(AUTH_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);
      if (parsed?.user) {
        setUser(parsed.user);
        setIsLogged(true);
      }
    } catch (error) {
      console.error("Erro ao carregar sessão:", error);
      clearAuthStorage();
    }
  }, []);

  const clearAuthStorage = () => {
    localStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(AUTH_KEY);
  };

  const handleLogin = (loginData) => {
    const { user: userData, remember } = loginData;

    setUser(userData);      // salva os dados do login
    setIsLogged(true);      // libera a aplicaÇõÇœo

    clearAuthStorage();
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(AUTH_KEY, JSON.stringify({ user: userData, remember: !!remember }));
  };

  const handleLogout = () => {
    clearAuthStorage();
    setUser(null);
    setIsLogged(false);
  };

  return (
    <div className="App">
      <Header user={user} onLogout={handleLogout}/>
      {!isLogged ? (
        <Login onLogin={handleLogin} />  // ÐY"¾ agora envia dados
      ) : (
        <DashboardHeader user={user}/>
      )}
    </div>
  );
}

export default App;
