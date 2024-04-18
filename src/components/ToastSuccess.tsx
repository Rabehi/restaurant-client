import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'flowbite/dist/flowbite.css'
import 'react-toastify/dist/ReactToastify.css';

const ToastSuccess: React.FC = () => {
    const handleButtonClick = () => {
        toast.success('¡Pedido enviado!');
    };

    return (
        <div>
            <button type="button" className="text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:focus:ring-green-900 text-center inline-flex items-center"
                onClick={handleButtonClick}>
                <svg className="w-5 h-5 me-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
                    <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                </svg>
                Enviar pedido
            </button>

            <ToastContainer />
        </div>
    );
};

export default ToastSuccess;