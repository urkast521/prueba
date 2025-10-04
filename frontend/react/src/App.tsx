import { useState } from "react";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { motion, AnimatePresence } from "framer-motion";
import {transitionVariants} from "./Utilities/validaciones" //marcan error por que son jsx

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
    <AnimatePresence mode="wait">
      <div className={`${isLogged ? "fijarTop" : "App"}`}>
        
          {isLogged ? (
            <motion.div
              key="dashboard"
              variants={transitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Dashboard onHandleIsLogged={handleLogout}></Dashboard>
            </motion.div>
          ) : (
            <motion.div
              key="login"
              variants={transitionVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.2 }}
            >
              <Login onHandleIsLogged={handleLogin}></Login>
            </motion.div>
          )}
        
      </div>
    </AnimatePresence>
  );
}