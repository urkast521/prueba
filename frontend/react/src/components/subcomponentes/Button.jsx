export default function OButton({ButtonType, children, handleClick, Disabled}){
    //Submit, Normal,  cancelar, underline

    if(ButtonType === "submit"){
        return (
            <button type="submit" className="w-full bg-blue-600 text-white p-2 m-2 rounded hover:bg-blue-700">
                {children}
            </button>
        );
    }else if(ButtonType === "underline"){
        return(
            <button type="button" onClick={handleClick} className="text-blue-600 hover:underline" >
                {children}
            </button>
        );
    }else if(ButtonType === "cancelar"){
        return (
            <button type="button" onClick={handleClick} className="bg-red-500 text-white px-4 py-2  m-2 rounded hover:bg-red-600" disabled={Disabled}>
                {children}
            </button>
        );
    }

    //Boton normal sin tipo
    return(
        <button type="button" onClick={handleClick} className="bg-blue-600 text-white p-2 px-4   mx-2 mb-4  rounded hover:bg-blue-700">
          {children}
        </button>
    );
}