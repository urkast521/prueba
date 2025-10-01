export default function NormalInput({children, inputValue, handleChangeValue, typeInput, placeHolder=""}){
    return(
        <>
            <label className="block mb-2 font-semibold">{children}</label>
            <input
            type={typeInput}
            value={inputValue}
            onChange={(e) => handleChangeValue(e.target.value)}
            placeholder={placeHolder}
            className="w-full p-2 border rounded mb-4"
            />
      </>
    );
}