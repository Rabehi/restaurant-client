import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'flowbite/dist/flowbite.css'
import 'react-toastify/dist/ReactToastify.css';
import ButtonIcon from './ButtonIcon';

const ButtonSolicitarAsistenciats: React.FC = () => {
    const handleButtonClick = () => {
        toast.info('¡Asistencia solicitada!');
    };

    return (
        <div>
            <ButtonIcon
                color="yellow"
                icon={<svg className="w-5 h-5 text-gray-800 text-white me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 19">
                    <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m9 12 5.419 3.871A1 1 0 0 0 16 15.057V2.943a1 1 0 0 0-1.581-.814L9 6m0 6V6m0 6H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h7m-5 6h3v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-5Zm15-3a3 3 0 0 1-3 3V6a3 3 0 0 1 3 3Z" />
                </svg>}
                text="Solicitar asistencia"
                onClick={handleButtonClick}
            />
            <ToastContainer />
        </div>
    );
};

export default ButtonSolicitarAsistenciats;