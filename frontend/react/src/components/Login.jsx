import { useState } from "react";
import FormLogin from "./FormLogin";
import FormRegister from "./FormRegister";

export default function Login({ onHandleIsLogged }) {
  const [isOpen, setIsOpen] = useState(true);

  //Funcion para cambiar el estado de isOpen
  function handleIsOpen() {
    setIsOpen((s) => !s);
  }

  return (
    //Validar si isOpen es true, mostrar FormLogin, si no, mostrar FormRegister
    <>
      {isOpen ? (
        <FormLogin
          onHandleIsOpen={handleIsOpen}
          onHandleIsLogged={onHandleIsLogged}
        />
      ) : (
        <FormRegister onHandleIsOpen={handleIsOpen} />
      )}
    </>
  );
}
