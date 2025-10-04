import OButton from "./Button";
//Ventana emergente
export default function ConfirmationWindow({onHandlePositive, onHandleNegative, onSetTitle, onSetMessage, btnPositive, btnNegative, btnStyle, children}){
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800/70 z-50">
            <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full mx-4 transform transition-all duration-300 scale-100">
                <h3 className="text-xl font-bold mb-4">{onSetTitle}</h3>
                <p className="mb-4">{onSetMessage}</p>
                <OButton ButtonType={btnStyle} handleClick={onHandlePositive} >{btnPositive}</OButton>
                <OButton handleClick={onHandleNegative}>{btnNegative}</OButton>
                {children}
            </div>
        </div>
    );
}