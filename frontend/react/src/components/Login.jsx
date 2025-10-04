import { useState } from "react";
import FormLogin from "./FormLogin";
import FormRegister from "./FormRegister";
import { motion, AnimatePresence } from "framer-motion";
import {transitionVariants} from "../Utilities/validaciones"

export default function Login({ onHandleIsLogged }) {
  const [isOpen, setIsOpen] = useState(true);

  //Funcion para cambiar el estado de isOpen
  function handleIsOpen() {
    setIsOpen((s) => !s);
  }

  return (
    //Validar si isOpen es true, mostrar FormLogin, si no, mostrar FormRegister
    <>
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
            key="dashboard"
            variants={transitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2 }}
          >

          <FormLogin
            onHandleIsOpen={handleIsOpen}
            onHandleIsLogged={onHandleIsLogged}
          />
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
          <FormRegister onHandleIsOpen={handleIsOpen} />
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
