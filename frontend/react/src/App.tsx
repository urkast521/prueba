import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [isLogged, setIsLogged] = useState(false);

  //Funcion que cambia el estado de isLogged
  function handleLogout() {
    setIsLogged(false);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("usuario");
  }
  function handleLogin() {
    setIsLogged(true);
  }

  return (
    <div className={`${isLogged ? "fijarTop" : "App"}`}>
      {isLogged ? (
        <Dashboard onHandleIsLogged={handleLogout}></Dashboard>
      ) : (
        <Login onHandleIsLogged={handleLogin}></Login>
      )}
    </div>
  );
}
