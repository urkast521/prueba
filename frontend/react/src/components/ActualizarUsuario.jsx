import { useState, useEffect } from "react";
import PassInput from "./subcomponentes/PasswordInput";
import OButton from "./subcomponentes/Button";
import {validarCorreo, validarInput, validarPassword} from "../Utilities/validaciones"
import ConfirmationWindow from "./subcomponentes/WindowConfirm";

export default function ActualizarUsuario({ id, onChangeTab, token }) {
  //Estados para manejar el usuario, carga, error, mensaje y visibilidad de la contraseña
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [nuevaPass, setNuevaPass]= useState(null);
  const [confirmarPass, setConfirmarPass]= useState(null);
  const [abierto, setAbierto] = useState(false);
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
    //Validar correo valido
    if (!(validarCorreo(usuario.correo))){
          setMensaje("Error: Correo invalido")
          return;
        }

    //validar campos vacios y tipo de datos
    if(!nuevaPass && !confirmarPass){
      //Revisamos que nombre y correo tengan información
      if(!(validarInput(usuario.nombre) && validarInput(usuario.correo))){
        setMensaje("Error: El usuario o correo estan vacios o son invalidos")
        return;
      }
      //Si todo cumplio los filtros, actualizar sin modificar contraseña
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
          }),
        });
        const data = await res.json();
        if (data.success) {
          setMensaje("Usuario actualizado con éxito");
          //regresar a la pestaña de consulta general después de actualizar
          setTimeout(() => {
            onChangeTab("consulta");
          }, 1500);
          
        } else setMensaje(`Error: ${data.error}`);
      } catch (err) {
        setMensaje(`Error: ${err.message}`);
      }
    }else{
      //validar contraseña por seguridad y que sean iguales los campos
      if(!(validarPassword(nuevaPass))){
        setMensaje("Error: La nueva contraseña es insegura")
        return;
      }
      if(!(nuevaPass === confirmarPass)){
        setMensaje("Las contraseñas no coinciden");
        return;
      }
      //Revisamos que nombre y correo tengan información
      if(!(validarInput(usuario.nombre) && validarInput(usuario.correo))){
        setMensaje("Error: El usuario o correo estan vacios o son invalidos")
        return;
      }
      //Enviar datos al backend esta vez si actualiza contraseña
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
          setTimeout(() => {
            onChangeTab("consulta");
          }, 1500);
          
        } else setMensaje(`Error: ${data.error}`);
      } catch (err) {
        setMensaje(`Error: ${err.message}`);
      }
    }
  };

  //Abrir/Cerrar ventana de confirmacion
  function onHandleWindow (){
    setAbierto((s)=>!s);
  }

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
        <PassInput inputValue={nuevaPass} handleChangeValue={setNuevaPass} requiredValue={false}>Contraseña nueva</PassInput>
        <PassInput inputValue={confirmarPass} handleChangeValue={setConfirmarPass} requiredValue={false}>Confirmar contraseña</PassInput>
        <div className="flex justify-center" >
        <OButton handleClick={onHandleWindow}>Actualizar usuario</OButton>
        </div>
        {abierto && <ConfirmationWindow 
                  onHandlePositive={handleSubmit} 
                  onHandleNegative={onHandleWindow} 
                  onSetTitle={"Confirmar actualización"} 
                  onSetMessage={"La siguiente acción actualizara los datos de su cuenta, ¿Esta seguro que desea continuar?"} 
                  btnPositive={"Actualizar"} 
                  btnNegative={"Cancelar"}>
                {mensaje && <p className="mt-4">{mensaje}</p>}
                </ConfirmationWindow>}
      </form>
    </div>
  );
}
