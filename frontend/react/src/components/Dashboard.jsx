import { useEffect, useState } from "react";
import ConsultaGeneral from "./ConsultaGeneral";
import ActualizarUsuario from "./ActualizarUsuario";
import BusquedaIndividual from "./BusquedaIndividual";
import DesactivarUsuario from "./DesactivarUsuario";

export default function Dashboard({ onHandleIsLogged }) {
  //Estado para manejar la pestaña activa
  const [activeTab, setActiveTab] = useState("consulta");
  //Acceso al token y usuarioid desde el sessionStorage
  const token = sessionStorage.getItem("token");
  //Obtener y parsear los datos del usuario desde sessionStorage
  const usuarioData = sessionStorage.getItem("usuario") || "{}";
  let usuario;
  //Manejo de error en caso de que el JSON esté mal formado
  try {
    usuario = JSON.parse(usuarioData);
  } catch {
    usuario = null;
  }
  //Obtener el id del usuario si existe y es un objeto
  const id = usuario && typeof usuario === "object" ? usuario.id : null;
  //Funcion para cambiar la pestaña activa
  function handleTabChange(tab) {
    setActiveTab((s) => tab);
  }
  //Verificar que el token y usuario existan
  useEffect(() => {
    if (!token || !id) {
      onHandleIsLogged();
    }
  }, [token, id]);

  //Renderizado del dashboard
  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Panel de control</h1>
        <button
          onClick={() => onHandleIsLogged()}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Cerrar sesión
        </button>
      </header>

      <nav className="flex space-x-4 mb-4">
        <button
          onClick={() => handleTabChange("consulta")}
          className={`px-4 py-2 rounded ${
            activeTab === "consulta" ? "bg-blue-500 text-white" : "bg-blue-300"
          }`}
        >
          Consulta General
        </button>
        <button
          onClick={() => handleTabChange("actualizar")}
          className={`px-4 py-2 rounded ${
            activeTab === "actualizar"
              ? "bg-blue-500 text-white"
              : "bg-blue-300"
          }`}
        >
          Actualizar Usuario
        </button>
        <button
          onClick={() => handleTabChange("busqueda")}
          className={`px-4 py-2 rounded ${
            activeTab === "busqueda" ? "bg-blue-500 text-white" : "bg-blue-300"
          }`}
        >
          Búsqueda Individual
        </button>
        <button
          onClick={() => handleTabChange("desactivar")}
          className={`px-4 py-2 rounded ${
            activeTab === "desactivar"
              ? "bg-blue-500 text-white"
              : "bg-blue-300"
          }`}
        >
          Desactivar Usuario
        </button>
      </nav>

      <section className="p-4 bg-white rounded shadow textColor2">
        {activeTab === "consulta" && <ConsultaGeneral token={token} />}
        {activeTab === "actualizar" && (
          <ActualizarUsuario
            id={id}
            onChangeTab={handleTabChange}
            token={token}
          />
        )}
        {activeTab === "busqueda" && <BusquedaIndividual token={token} />}
        {activeTab === "desactivar" && (
          <DesactivarUsuario onLogout={onHandleIsLogged} token={token} />
        )}
      </section>
    </div>
  );
}
