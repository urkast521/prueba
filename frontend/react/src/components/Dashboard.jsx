import { useEffect, useState } from "react";
import ConsultaGeneral from "./ConsultaGeneral";
import ActualizarUsuario from "./ActualizarUsuario";
import BusquedaIndividual from "./BusquedaIndividual";
import DesactivarUsuario from "./DesactivarUsuario";
import TabDashboard from "./subcomponentes/TabDashboard"
import OButton from "./subcomponentes/Button";

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
        <OButton handleClick={onHandleIsLogged} ButtonType={"cancelar"}>Cerrar sesión</OButton>
      </header>

      <nav className="flex space-x-4">
        <TabDashboard onHandleClick={handleTabChange} tabName={"consulta"} activeTab={activeTab}>Consulta General</TabDashboard>
        <TabDashboard onHandleClick={handleTabChange} tabName={"actualizar"} activeTab={activeTab}>Actualizar usuario</TabDashboard>
        <TabDashboard onHandleClick={handleTabChange} tabName={"busqueda"} activeTab={activeTab}>Búsqueda individual</TabDashboard>
        <TabDashboard onHandleClick={handleTabChange} tabName={"desactivar"} activeTab={activeTab}>Desactivar cuenta</TabDashboard>
      </nav>

      <section className="p-4 bg-white rounded rounded-t-none shadow max-h-140 overflow-y-auto textColor2">
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
