import { useState } from "react";


export default function TarjetaDeUsuario({id, nombre, correo}){
    const [abrirInfo, setAbrirInfo] = useState(false);

    function handleAbrirInfo(){
        setAbrirInfo((s)=>!s);
    }

    return(
            <div className="flex bg-gray-400/20 rounded-lg p-2 mt-3 items-center">
                <img src={`https://i.pravatar.cc/50?u=${id}`} className="rounded-2xl p-2 mr-2"></img>
                <div>
                    <p>{nombre}</p>
                    <p>{correo}</p>
                </div>
            </div>
    );
}