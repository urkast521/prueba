import { useState, useEffect } from "react";
import PassInput from "./subcomponentes/PasswordInput";
import OButton from "./subcomponentes/Button";
import {validarCorreo, validarInput, validarPassword} from "../Utilities/validaciones"
import ConfirmationWindow from "./subcomponentes/WindowConfirm";
import {LoadingOutlined} from '@ant-design/icons'


export default function ActualizarUsuario({ id, onChangeTab, token, onUserUpdate }) {
  //Estados para manejar el usuario, carga, error, mensaje y visibilidad de la contraseña
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState("");
  const [nuevaPass, setNuevaPass]= useState(null);
  const [confirmarPass, setConfirmarPass]= useState(null);
  const [abierto, setAbierto] = useState(false);
  const [userFile, setUserFile] = useState(null);
  const [fileExtension, setFileExtension] = useState(null);

  //Handler del Fichero
  function handleFile(e){
    if(e.target.files.length > 0){
      setUserFile(e.target.files[0])
      const fileNameParts = e.target.files[0].name.split('.');
      const ext = fileNameParts.length > 1 ? fileNameParts.pop().toLowerCase() : null;
      setFileExtension(ext);
    }else{
      setUserFile(null);
    }
  }

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
    //Creación del form data
    const formData = new FormData();

    //Validar Nombre y Correo
    if(!(validarInput(usuario.nombre) && validarInput(usuario.correo))){
      setMensaje("Error: El usuario o correo estan vacios o son invalidos")
      return;
    }
    //Validar correo valido
    if (!(validarCorreo(usuario.correo))){
      setMensaje("Error: Correo invalido")
      return;
    }
    //Agregar Nombre y Correo al formData
    formData.append("nombre", usuario.nombre);
    formData.append("correo", usuario.correo);

    //Pasados los filtros escogemos que caso de envio sucedera
    //Solo update de foto
    if(userFile && !nuevaPass && !confirmarPass){//Update de foto sin contraseñas
      formData.append("foto", userFile)

      try {
        setMensaje("");
        const res = await fetch(`http://127.0.0.1:5000/usuarios/modificar`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          setMensaje("Usuario actualizado con éxito");
          //Datos actualizados en el Dashboard
          const oldUsuario = JSON.parse(sessionStorage.getItem("usuario"));
          const newUsuario = { 
              ...oldUsuario, 
              nombre: usuario.nombre,
              correo: usuario.correo,
              foto: `profile_${id}.${fileExtension}`
          };
          sessionStorage.setItem("usuario", JSON.stringify(newUsuario));
          onUserUpdate()
          //regresar a la pestaña de consulta general después de actualizar
          setTimeout(() => {
            onChangeTab("consulta");
          }, 500);
          
        } else setMensaje(`Error: ${data.error}`);
      } catch (err) {
        setMensaje(`Error: ${err.message}`);
      } finally{
        setLoading(false)
      }

    }
    if(nuevaPass && confirmarPass){//Update de usuario con o sin nueva foto
      //Se agrega o No la foto
      if(userFile){
        formData.append("foto", userFile);
      }
      //Validaciones de contraseña
      if(!(validarPassword(nuevaPass))){
        setMensaje("Error: La nueva contraseña es insegura")
        return;
      }
      if(!(nuevaPass === confirmarPass)){
        setMensaje("Las contraseñas no coinciden");
        return;
      }
      //Se agrega la contraseña validada
      formData.append("passw", nuevaPass);

      try {
        setMensaje("");
        const res = await fetch(`http://127.0.0.1:5000/usuarios/modificar`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          setMensaje("Usuario actualizado con éxito");
          if(userFile){
            const oldUsuario = JSON.parse(sessionStorage.getItem("usuario"));
            const newUsuario = { 
                ...oldUsuario, 
                nombre: usuario.nombre,
                correo: usuario.correo,
                foto: `profile_${id}.${fileExtension}`
            };
            sessionStorage.setItem("usuario", JSON.stringify(newUsuario));
            onUserUpdate()
          }else{
            const oldUsuario = JSON.parse(sessionStorage.getItem("usuario"));
            const newUsuario = { 
                ...oldUsuario, 
                nombre: usuario.nombre,
                correo: usuario.correo,
            };
            sessionStorage.setItem("usuario", JSON.stringify(newUsuario));
            onUserUpdate()
          }
          //regresar a la pestaña de consulta general después de actualizar
          setTimeout(() => {
            onChangeTab("consulta");
          }, 500);
          
        } else setMensaje(`Error: ${data.error}`);
      } catch (err) {
        setMensaje(`Error: ${err.message}`);
      } finally{
        setLoading(false)
      }
    }
    if(!userFile && !nuevaPass && !confirmarPass){//update solo de nombre y correo
      
      try {
        setMensaje("");
        const res = await fetch(`http://127.0.0.1:5000/usuarios/modificar`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          setMensaje("Usuario actualizado con éxito");
          const oldUsuario = JSON.parse(sessionStorage.getItem("usuario"));
          const newUsuario = { 
              ...oldUsuario, 
              nombre: usuario.nombre,
              correo: usuario.correo,
            };
            sessionStorage.setItem("usuario", JSON.stringify(newUsuario));
            onUserUpdate()
          //regresar a la pestaña de consulta general después de actualizar
          setTimeout(() => {
            onChangeTab("consulta");
          }, 500);
          
        } else setMensaje(`Error: ${data.error}`);
      } catch (err) {
        setMensaje(`Error: ${err.message}`);
      } finally{
        setLoading(false)
      }
    }
  };

  //Abrir/Cerrar ventana de confirmacion
  function onHandleWindow (){
    setAbierto((s)=>!s);
  }

  //Mostrar estados de carga y error
  if (loading) return (
  <>
  <div className="flex flex-col justify-center items-center">
    <LoadingOutlined />
    <p>Cargando</p>
  </div>
  </>
);
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
        <label className="block mb-2 font-semibold">Foto de perfil</label>
        <input
          type="file"
          className="block w-full 
            file:mb-3 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0
            file:text-sm file:bg-blue-600 
            file:text-white hover:file:bg-blue-700"
          onChange={handleFile}
          accept=".png, .jpg, .jpeg"
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
                {mensaje && 
                <>
                  <div className="flex flex-col justify-center items-center">
                    <LoadingOutlined />
                    <p>{mensaje}</p>
                  </div>
                  </>}
                </ConfirmationWindow>}
      </form>
    </div>
  );
}
