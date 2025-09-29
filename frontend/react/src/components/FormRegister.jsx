import { useState } from "react";

export default function FormRegister({ onHandleIsOpen }) {
  //Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [passw, setPassw] = useState("");

  //Funcion para manejar el envio del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    /*Prueba de recepción de datos
    console.log("Datos de registro:", { nombre, correo, passw });*/
    //Validacion de los tipos de datos
    if (
      typeof nombre !== "string" ||
      typeof correo !== "string" ||
      typeof passw !== "string"
    ) {
      console.error("Los datos ingresados no son válidos.");
      return;
    }
    //Requisitos mínimos de la contraseña
    if (passw.length < 5) {
      console.error("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    //Validar que no haya campos vacíos
    if (!nombre || !correo || !passw) {
      console.error("Por favor, completa todos los campos.");
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
        alert("Usuario creado exitosamente!");
        onHandleIsOpen(true); //Para que vuelva a Login despues de registrarse
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

      <label className="block mb-2 font-semibold">Nombre completo</label>
      <input
        type="text"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <label className="block mb-2 font-semibold">Correo</label>
      <input
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />

      <label className="block mb-2 font-semibold">Contraseña</label>
      <input
        type="password"
        value={passw}
        onChange={(e) => setPassw(e.target.value)}
        className="w-full p-2 border rounded mb-6"
        required
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Crear cuenta
      </button>

      <p className="mt-4 text-center">
        ¿Ya tienes cuenta?{" "}
        <button
          type="button"
          onClick={onHandleIsOpen}
          className="text-blue-600 hover:underline"
        >
          Inicia sesión
        </button>
      </p>
    </form>
  );
}
