import { useState } from "react";
import PassInput from "./subcomponentes/PasswordInput";
import OButton from "./subcomponentes/Button";
import NormalInput from "./subcomponentes/NormalInput";
import {validarCorreo, validarInput} from "../Utilities/validaciones"


export default function FormLogin({ onHandleIsOpen, onHandleIsLogged }) {
  //Estados para los campos del formulario
  const [correo, setCorreo] = useState("");
  const [passw, setPassw] = useState("");
  const [error, setError] = useState("");

  //Funcion para manejar el submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos de login:", { correo, passw });

    //Validaciones de formulario
    //validar campos vacios
    if(!(validarInput(correo)&&validarInput(passw))){
      setError("Error: Los datos ingresados no son validos o estan vacios")
      console.error("Error: Los datos ingresados no son validos o estan vacios");
      return;
    }
    //Validar el correo 
    if (!(validarCorreo(correo))){
      setError("Error: Correo invalido")
      console.error("Error: Correo invalido");
      return;
    }

    //Ejecucion del API
    try {
      const res = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, passw }),
      });
      //En caso de error, lanzar excepcion
      if (!res.ok) {
        setCorreo("");
        setPassw("");
        setError("Error Correo o Contraseña incorrectos");
        throw new Error("Error en la autenticación");
      }
      //En caso de exito, obtener los datos
      const data = await res.json();
      console.log("Respuesta del servidor:", data);
      //Guardar el token y data en el sessionStorage
      sessionStorage.setItem("token", data.token);
      sessionStorage.setItem("usuario", JSON.stringify(data.usuario));

      //Actualizar el estado de isLogged
      onHandleIsLogged();
    } catch (err) {
      console.error("Error al conectar con el servidor:", err.message);
    }
  };

  //Renderizado del formulario
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-80 textColor2"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      <NormalInput inputValue={correo} handleChangeValue={setCorreo} typeInput={"email"}>Correo</NormalInput>
      <PassInput inputValue={passw} handleChangeValue={setPassw}>Contraseña</PassInput>
      <OButton ButtonType={"submit"}>Iniciar sesión</OButton>
      <p className="mt-4 text-center">
        ¿No tienes una cuenta?{" "}
        <OButton ButtonType={"underline"} handleClick={onHandleIsOpen} >Regístrate</OButton>
      </p>
      {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
    </form>
  );
}
