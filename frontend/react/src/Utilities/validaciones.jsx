

//Funcion validar correo
export const validarCorreo = (correo) =>{
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(correo);
}

//Funcion validar Input
export const validarInput = (data) =>{
    if(data && typeof data === 'string'){
        return true;
    }
    return false;
}


//Funcion validar requisitos de contraseña
export const validarPassword = (passw) =>{
    //Validar longitud mayor a 8 caracteres
    if(!(passw.length > 8)){
        return false;
    }
    //Validar que contenga al menos 1, numero, 1 mayuscula y 1 minuscula
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    if(!(regex.test(passw))){
        return false;
    }

    return true;
}

  //Variantes de la animacion
  export const transitionVariants = {
    initial: { opacity: 0, x: 0 }, 
    animate: { opacity: 1, x: 0 },  
    exit: { opacity: 0, x: 0 },  
  };