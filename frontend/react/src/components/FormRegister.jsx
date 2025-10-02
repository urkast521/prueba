import { useState } from "react";
import NormalInput from "./subcomponentes/NormalInput";
import PasswordInput from "./subcomponentes/PasswordInput"
import OButton from "./subcomponentes/Button";
import {validarCorreo, validarInput, validarPassword} from "../Utilities/validaciones"

export default function FormRegister({ onHandleIsOpen }) {
  //Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [passw, setPassw] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  //Funcion para manejar el envio del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    //Validaciones de formulario
    //validar campos vacios
    if(!(validarInput(nombre) && validarInput(correo))&& validarInput(passw)){
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

    //validar contraseña
    if(!(validarPassword(passw))){
      setError("Error: La contraseña es insegura")
      console.error("Error: La contraseña es insegura");
      return;
    }

    //Ejecucion del API
    try {
      const res = await fetch("http://127.0.0.1:5000/insert_usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          correo,
          passw,
        }),
      });
      //Verificar la respuesta del servidor
      if (!res.ok) {
        throw new Error("Error en la solicitud: " + res.statusText);
      }
      //Analizar la respuesta JSON
      const data = await res.json();
      console.log(data);

      if (data.success) {
        setMensaje("¡Usuario creado exitosamente!")
        //Para que vuelva a Login un poco despues de registrarse
        setTimeout(() => {
          onHandleIsOpen(true);
        }, 1500);
         
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    //Componente formulario de registro
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded shadow-md w-80 textColor2"
    >
      <h1 className="text-2xl font-bold mb-6 text-center">Registro</h1>
      <NormalInput inputValue={nombre} handleChangeValue={setNombre} typeInput={"text"}>Nombre completo</NormalInput>
      <NormalInput inputValue={correo} handleChangeValue={setCorreo} typeInput={"email"}>Correo</NormalInput>
      <PasswordInput inputValue={passw} handleChangeValue={setPassw} typeInput={"text"}>Contraseña</PasswordInput>
      <OButton ButtonType={"submit"}>Crear cuenta</OButton>
      <p className="mt-4 text-center">
        ¿Ya tienes cuenta?{" "}
        <OButton ButtonType={"underline"} handleClick={onHandleIsOpen} >Inicia sesión</OButton>
      </p>
      {mensaje && <p className="mt-4 text-green-400 text-center">{mensaje}</p>}
      {error && <p className="mt-4 text-red-400 text-center">{error}</p>}
    </form>
  );
}
