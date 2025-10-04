import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ConsultaGeneral from "./ConsultaGeneral";
import ActualizarUsuario from "./ActualizarUsuario";
import BusquedaIndividual from "./BusquedaIndividual";
import DesactivarUsuario from "./DesactivarUsuario";
import TabDashboard from "./subcomponentes/TabDashboard"
import OButton from "./subcomponentes/Button";
import TarjetaDeUsuario from "./TarjetaDeUsuario";
import {transitionVariants} from "../Utilities/validaciones"

export default function Dashboard({ onHandleIsLogged }) {
  //Estado para manejar la pestaña activa
  const [activeTab, setActiveTab] = useState("consulta");

  //Acceso al token y usuarioid desde el sessionStorage
  const token = sessionStorage.getItem("token");

  //Estado del usuario
  const [currentUser, setCurrentUser] = useState(() => {
        const usuarioData = sessionStorage.getItem("usuario") || "{}";
        if (usuarioData) {
            try {
                return JSON.parse(usuarioData);
            } catch {
                return null;
            }
        }
        return null;
    });


//Funcion de recarga del dashboard
    const handleUserUpdate = useCallback(() => {
        console.log("Actualizando estado de usuario en Dashboard...");
        const usuarioData = sessionStorage.getItem("usuario");
        if (usuarioData) {
            try {
                setCurrentUser(JSON.parse(usuarioData));
            } catch (e) {
                console.error("Error al parsear usuario de sessionStorage:", e);
                setCurrentUser(null);
            }
        } else {
            setCurrentUser(null);
        }
    }, []); // El useCallback asegura que la función sea estable

  //Obtener el id del usuario si existe y es un objeto
  const id = currentUser?.id || null;
  const foto = currentUser?.foto || null;

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
        <div className="auto">
          <h1 className="text-2xl font-bold">Panel de control</h1>
          {currentUser &&(<TarjetaDeUsuario id={id} nombre={currentUser.nombre} correo={currentUser.correo} foto={foto}></TarjetaDeUsuario>)}
        </div>
        <div>
          <OButton handleClick={onHandleIsLogged} ButtonType={"cancelar"}>Cerrar sesión</OButton>
        </div>
      </header>

      <nav className="flex space-x-4">
        <TabDashboard onHandleClick={handleTabChange} tabName={"consulta"} activeTab={activeTab}>Consulta General</TabDashboard>
        <TabDashboard onHandleClick={handleTabChange} tabName={"actualizar"} activeTab={activeTab}>Actualizar usuario</TabDashboard>
        <TabDashboard onHandleClick={handleTabChange} tabName={"busqueda"} activeTab={activeTab}>Búsqueda individual</TabDashboard>
        <TabDashboard onHandleClick={handleTabChange} tabName={"desactivar"} activeTab={activeTab}>Desactivar cuenta</TabDashboard>
      </nav>
    <AnimatePresence mode="wait">
      <section className="p-4 bg-white rounded rounded-t-none shadow max-h-120 overflow-y-auto textColor2" key={activeTab}>
        <motion.div
          key={activeTab}
          variants={transitionVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          {activeTab === "consulta" && <ConsultaGeneral token={token} />}
          {activeTab === "actualizar" && (
            <ActualizarUsuario
              id={id}
              onChangeTab={handleTabChange}
              token={token}
              onUserUpdate={handleUserUpdate}
            />
          )}
          {activeTab === "busqueda" && <BusquedaIndividual token={token} />}
          {activeTab === "desactivar" && (
            <DesactivarUsuario onLogout={onHandleIsLogged} token={token} />
          )}
        </motion.div>
      </section>
    </AnimatePresence> 
    </div>
  );
}
