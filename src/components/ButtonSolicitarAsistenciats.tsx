import React from 'react';
import { toast } from 'react-toastify';
import 'flowbite/dist/flowbite.css';
import ButtonIcon from './ButtonIcon';
import { useMesasStore } from "../context/MesasStore.ts";

interface Props {
    mesaId: string;
}

const ButtonSolicitarAsistenciats: React.FC<Props> = ({ mesaId }) => {
    const updateMesa = useMesasStore((state) => state.updateMesa);

    const handleButtonClick = async () => {
        if (!mesaId) {
            toast.error('ID de mesa no disponible');
            return;
        }
        try {
            await updateMesa(mesaId, 3); // Actualizar el estado de la mesa API + WS + estado local
            toast.warn('¡Asistencia solicitada!');
        } catch (error) {
            console.error('Error requesting assistance:', error);
            toast.error('Error requesting assistance');
        }
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
        </div>
    );
};

export default ButtonSolicitarAsistenciats;