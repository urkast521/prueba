import React, { useState } from "react";

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

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Ingresa ID o Nombre"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={handleBuscar}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Buscar
        </button>
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
