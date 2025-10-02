import React, { useState } from "react";
import OButton from "./subcomponentes/Button";
import ConfirmationWindow from "./subcomponentes/WindowConfirm";

export default function DesactivarUsuario({ onLogout, token }) {
  //Estado para manejar la carga y mensajes
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [abierto, setAbierto] = useState(false);
  //Función para desactivar el usuario
  const handleDesactivar = async () => {
    setLoading(true);
    setMensaje("");
    //Llamada al API para desactivar el usuario
    try {
      const res = await fetch(`http://127.0.0.1:5000/usuarios/desactivar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success) {
        setMensaje("Cuenta desactivada con éxito");
        // Esperar un momento para que se vea el msj y luego cerrar sesión
        setTimeout(() => {
          onLogout(false);
        }, 1500);
      } else {
        setMensaje(data.error || "Error al desactivar la cuenta");
      }
    } catch (err) {
      setMensaje(err.message);
    } finally {
      setLoading(false);
    }
  };

  //Abrir/Cerrar ventana de confirmacion
  function onHandleWindow (){
    setAbierto((s)=>!s);
  }

  //Renderizado del componente
  return (
    <div className="max-w-md mx-auto p-3">
      <h2 className="text-xl font-bold mb-4">Desactivar Cuenta</h2>
      <p className="mb-4">
        Al desactivar tu cuenta, no podrás iniciar sesión ni acceder a tus
        datos.
      </p>
      <OButton ButtonType={"cancelar"} handleClick={onHandleWindow} Disabled={loading}>{loading ? "Desactivando..." : "Desactivar Cuenta"}</OButton>
      {abierto && <ConfirmationWindow 
          onHandlePositive={handleDesactivar} 
          onHandleNegative={onHandleWindow} 
          onSetTitle={"Confirmar desactivación"} 
          onSetMessage={"La siguiente acción desactivara su cuenta de forma permanente, ¿Esta seguro que desea continuar?"} 
          btnPositive={"Desactivar"} 
          btnNegative={"Cancelar"}
          btnStyle={"cancelar"}>
        {mensaje && <p className="mt-4">{mensaje}</p>}
        </ConfirmationWindow>}
    </div>
  );
}
