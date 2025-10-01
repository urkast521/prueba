import React, { useState } from "react";
import NormalInput from "./subcomponentes/NormalInput";
import OButton from "./subcomponentes/Button";

export default function BusquedaIndividual({ token }) {
  // Estados para manejar la búsqueda, resultado, error y carga
  const [busqueda, setBusqueda] = useState("");
  const [usuario, setUsuario] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  // Función para manejar la búsqueda
  const handleBuscar = async () => {
    if (!busqueda) return;
    setLoading(true);
    setError("");
    setUsuario(null);

    // Determinar si es número (ID) o texto (nombre)
    const isId = !isNaN(busqueda);

    try {
      // Llamada al API con el parámetro adecuado
      const queryParam = isId ? `id=${busqueda}` : `nombre=${busqueda}`;
      const res = await fetch(`http://127.0.0.1:5000/usuarios?${queryParam}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        if (data.data.length > 0) setUsuario(data.data[0]);
        else setError("Usuario no encontrado");
      } else {
        setError(data.error || "Error al consultar usuario");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Renderizado del componente
  return (
    <div className="max-w-md mx-auto p-3">
      <h2 className="text-xl font-bold mb-4">Buscar Usuario</h2>

      <div className="flex gap-2 mb-4 items-center">
        <NormalInput inputValue={busqueda} handleChangeValue={setBusqueda} typeInput={"text"} placeHolder="Ingresa ID o Nombre"></NormalInput>
        <OButton handleClick={handleBuscar}>Buscar</OButton>
      </div>

      {loading && <p>Cargando...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {usuario && (
        <div className="border p-4 rounded">
          <p>
            <strong>ID:</strong> {usuario.id}
          </p>
          <p>
            <strong>Nombre:</strong> {usuario.nombre}
          </p>
          <p>
            <strong>Correo:</strong> {usuario.correo}
          </p>
          <p>
            <strong>Estado:</strong> {usuario.estado ? "Activo" : "Desactivado"}
          </p>
        </div>
      )}
    </div>
  );
}
