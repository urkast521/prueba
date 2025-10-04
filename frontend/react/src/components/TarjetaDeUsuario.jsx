import { useState } from "react";

const FOTO_BASE_URL = "http://127.0.0.1:5000/uploads/";


export default function TarjetaDeUsuario({id, nombre, correo, foto}){

    const imageUrl = foto 
        ? FOTO_BASE_URL + foto // Si hay nombre de foto, construye la URL real
        : FOTO_BASE_URL+"unnamed.png"; // Avatar por defecto si 'foto' es null

    return(
        <div className="flex bg-gray-400/20 rounded-lg p-2 mt-3 items-center">
            <img src={imageUrl} className="rounded-2xl p-2 mr-2 w-14 h-14 object-cover " ></img>
            <div>
                <p>{nombre}</p>
                <p>{correo}</p>
            </div>
        </div>
    );
}