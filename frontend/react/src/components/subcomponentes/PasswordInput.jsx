import { useState } from "react";

export default function PassInput({inputValue, handleChangeValue, children}){
    const [showPass, setShowPass] = useState(false);
    return (
        <>
        <label className="block mb-2 font-semibold">{children}</label>
        <div className="relative mb-0">
            <input
                type={showPass ? "text" : "password"}
                value={inputValue}
                onChange={(e) => handleChangeValue(e.target.value)}
                className="w-full p-2 border rounded mb-6"
                required
            />
            <button
                    type="button"
                    onClick={() => setShowPass((s) => !s)}
                    className="absolute right-2 top-2 text-gray-600"
                >
                    {showPass ? "Ocultar" : "Mostrar"}
            </button>
        </div>
        </>
    );
}