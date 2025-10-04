import React from "react";
import { useState, useEffect } from "react";
import {LoadingOutlined} from '@ant-design/icons'

export default function ConsultaGeneral({ token }) {
  // Estado para almacenar usuarios, carga y errores
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Función para obtener usuarios desde el back
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("http://127.0.0.1:5000/usuarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener usuarios");
      const data = await res.json();

      setUsuarios(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsuarios();
  }, []);
  //Mostrar carga, error o la tabla de usuarios
  if (loading) return (
  <>
  <div className="flex flex-col justify-center items-center">
    <LoadingOutlined />
    <p>Cargando</p>
  </div>
  </>
);
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (usuarios.length === 0) return <p>No hay usuarios disponibles.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Consulta General de Usuarios</h2>
      <table className="w-full border border-gray-300 rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Correo</th>
            <th className="p-2 border">Estado</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((u) => (
            <tr key={u.id} className="text-center">
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.nombre}</td>
              <td className="p-2 border">{u.correo}</td>
              <td className="p-2 border">
                {u.estado === 1 ? "Activo" : "Inactivo"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
