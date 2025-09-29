import { useState } from "react";

export default function FormLogin({ onHandleIsOpen, onHandleIsLogged }) {
  //Estados para los campos del formulario
  const [correo, setCorreo] = useState("");
  const [passw, setPassw] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showPass, setShowPass] = useState(false);

  //Funcion para manejar el submit del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Datos de login:", { correo, passw });
    //Validar que no haya campos vacíos
    if (!correo || !passw) {
      console.error("Por favor, completa todos los campos.");
      return;
    }
    //Validacion de los tipos de datos
    if (typeof correo !== "string" || typeof passw !== "string") {
      console.error("Los datos ingresados no son válidos.");
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
        setMensaje("Error Correo o Contraseña incorrectos");
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

      <label className="block mb-2 font-semibold">Correo</label>
      <input
        type="email"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
        className="w-full p-2 border rounded mb-4"
        required
      />

      <label className="block mb-2 font-semibold">Contraseña</label>
      <div className="relative mb-4">
        <input
          type={showPass ? "text" : "password"}
          value={passw}
          onChange={(e) => setPassw(e.target.value)}
          className="w-full p-2 border rounded mb-6"
          required
        />
        <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-2 top-2 text-gray-600"
            >
              {showPass ? "Ocultar" : "Mostrar"}
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        Iniciar sesión
      </button>
      <p className="mt-4 text-center">
        ¿No tienes una cuenta?{" "}
        <button
          type="button"
          onClick={onHandleIsOpen}
          className="text-blue-600 hover:underline"
        >
          Regístrate
        </button>
      </p>
      {mensaje && <p className="mt-4 text-red-600 text-center">{mensaje}</p>}
    </form>
  );
}
