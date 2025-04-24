import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'flowbite/dist/flowbite.css';
import ButtonIcon from './ButtonIcon';
import axios from 'axios';
import { useOrder } from '../context/OrderContext';
import { useMesasStore } from "../context/MesasStore.ts";
import { useAuth } from '../context/AuthContext';

interface Props {
  mesaId: string;
}

const ButtonEnviarPedidots: React.FC<Props> = ({ mesaId }) => {
  const { state, dispatch } = useOrder();
  const updateMesa = useMesasStore((state) => state.updateMesa);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth(); // 💡 obtenemos el usuario autenticado
  const idusuario = user?.id;

  const handleButtonClick = async () => {
    if (state.items.length === 0) {
      toast.warn('No hay productos en el pedido.');
      return;
    }

    setLoading(true);

    try {
      if (!mesaId) {
        toast.error('ID de mesa no disponible');
        return;
      }

      // Crear la comanda con o sin idusuario
      const comandaPayload: any = {
        idMesa: mesaId,
        pagado: false,
        fecha: new Date().toISOString().split('T')[0],
        totalpagar: state.total,
      };

      if (idusuario) {
        comandaPayload.idusuario = idusuario;
      }

      const comandaResponse = await axios.post('http://localhost:3000/comanda', comandaPayload);
      const comandaId = comandaResponse.data.id;

      // Guardar los productos en detalle_comanda
      await Promise.all(
        state.items.map(item =>
          axios.post('http://localhost:3000/detalle_comanda', {
            idcomanda: comandaId,
            idproducto: item.id,
            cantidad: item.cantidad,
            precio: item.precio,
          })
        )
      );

      await updateMesa(mesaId, 2); // Cambiar estado de la mesa
      dispatch({ type: 'CLEAR_CART' });

      setTimeout(() => {
        toast.success('¡Pedido enviado con éxito!');
      }, 100);

    } catch (error) {
      console.error('Error al enviar el pedido:', error);
      toast.error('Error al enviar el pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ButtonIcon
        color="green"
        icon={
          loading ? (
            <svg className="w-5 h-5 me-2 animate-spin text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeLinecap="round" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 me-2 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 21"
            >
              <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
            </svg>
          )
        }
        text={loading ? "Enviando..." : "Enviar pedido"}
        onClick={handleButtonClick}
        disabled={loading}
      />
    </div>
  );
};

export default ButtonEnviarPedidots;
