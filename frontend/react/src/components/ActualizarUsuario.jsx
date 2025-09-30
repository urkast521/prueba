import { useState, useEffect } from "react";

export default function ActualizarUsuario({ id, onChangeTab, token }) {
  //Estados para manejar el usuario, carga, error, mensaje y visibilidad de la contraseña
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [nuevaPass, setNuevaPass]= useState(null);
  const [confirmarPass, setConfirmarPass]= useState(null);
  //Obtener datos del usuario al cargar el componente, vinculado al id recibido por props
  useEffect(() => {
    //Validar que el id sea válido
    if (!id) {
      setError("ID de usuario no proporcionado");
      setLoading(false);
      return;
    }
    const fetchUsuario = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://127.0.0.1:5000/usuarios?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("No se pudo obtener el usuario");
        const data = await res.json();
        // Suponemos que data.data[0] tiene el usuario
        setUsuario(data.data[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuario();
  }, [id]);

  //Manejo del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    //Validar campos vacíos
    if (!usuario.nombre || !usuario.correo || !nuevaPass || !confirmarPass) {
      setMensaje("Todos los campos son obligatorios");
      return;
    }
    //Validar tipo de datos
    if (
      typeof usuario.nombre !== "string" ||
      typeof usuario.correo !== "string" ||
      typeof nuevaPass !== "string" ||
      typeof confirmarPass !== "string" 
    ) {
      setMensaje("Los campos deben ser de tipo texto");
      return;
    }
    //Validamos que la contraseña nueva y la confirmacion sean iguales
    if (!(nuevaPass === confirmarPass)){
      setMensaje("Las contraseñas no coinciden");
      return;
    }
    //Requisitos mínimos de la contraseña
    if (nuevaPass.length <= 5) {
      setMensaje("La contraseña es muy corta");
      return;
    }
    //Enviar datos al backend
    try {
      setMensaje("");
      const res = await fetch(`http://127.0.0.1:5000/usuarios/modificar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: usuario.nombre,
          correo: usuario.correo,
          passw: nuevaPass,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMensaje("Usuario actualizado con éxito");
        //regresar a la pestaña de consulta general después de actualizar
        onChangeTab("consulta");
      } else setMensaje(`Error: ${data.error}`);
    } catch (err) {
      setMensaje(`Error: ${err.message}`);
    }
  };

  //Mostrar estados de carga y error
  if (loading) return <p>Cargando usuario...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!usuario) return <p>No se encontró usuario</p>;
  //Renderizado del formulario
  return (
    <div className="max-w-md mx-auto p-3">
      <h2 className="text-xl font-bold mb-4">
        Actualizar Usuario ID{usuario.id}
      </h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2 font-semibold">Nombre</label>
        <input
          type="text"
          value={usuario.nombre}
          onChange={(e) => setUsuario({ ...usuario, nombre: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 font-semibold">Correo</label>
        <input
          type="email"
          value={usuario.correo}
          onChange={(e) => setUsuario({ ...usuario, correo: e.target.value })}
          className="w-full p-2 border rounded mb-4"
        />

        <label className="block mb-2 font-semibold">Contraseña nueva</label>
        <div className="relative mb-4">
          <input
            type={showPass ? "text" : "password"}
            value={nuevaPass}
            onChange={(e) => setNuevaPass(e.target.value)}
            className="w-full p-2 border rounded mb-2"
          />
          <button
            type="button"
            onClick={() => setShowPass((s) => !s)}
            className="absolute right-2 top-2 text-gray-600"
          >
            {showPass ? "Ocultar" : "Mostrar"}
          </button>
        </div>

        <label className="block mb-2 font-semibold">Confirmar contraseña</label>
        <div className="relative mb-4">
          <input
            type={showPass ? "text" : "password"}
            value={confirmarPass}
            onChange={(e) => setConfirmarPass(e.target.value)}
            className="w-full p-2 border rounded mb-4"
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
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Actualizar
        </button>
      </form>
      {mensaje && <p className="mt-4 text-center">{mensaje}</p>}
    </div>
  );
}
