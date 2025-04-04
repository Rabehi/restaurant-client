import React from 'react';
import { toast } from 'react-toastify';
import 'flowbite/dist/flowbite.css';
import ButtonIcon from './ButtonIcon';
import { useMesasStore } from "../context/MesasStore.ts";

interface Props {
    mesaId: string;
}
const ButtonSolicitarCuentats: React.FC = ({ mesaId }) => {
    const updateMesa = useMesasStore((state) => state.updateMesa);
    const mesas = useMesasStore((state) => state.mesas); // Esto lo suscribe

    const handleButtonClick = async () => {
        try {
            if (!mesaId) {
                toast.error('ID de mesa no disponible');
                return;
            }
            await updateMesa(mesaId, 4); // Actualizar el estado de la mesa API + WS + estado local
            toast.info('¡Cuenta solicitada!');
        } catch (error) {
            console.error('Error requesting bill:', error);
            toast.error('Error requesting bill');
        }
    };

    return (
        <div>
            <ButtonIcon
                color="blue"
                icon={<svg className="w-5 h-5 text-gray-800 text-white me-2 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 16">
                    <path stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3" />
                </svg>}
                text="Solicitar cuenta"
                onClick={handleButtonClick}
            />
        </div>
    );
};

export default ButtonSolicitarCuentats;