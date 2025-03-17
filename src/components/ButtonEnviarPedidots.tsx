import React, { useState } from 'react';
import { toast } from 'react-toastify';
import 'flowbite/dist/flowbite.css';
import ButtonIcon from './ButtonIcon';
import axios from 'axios';
import { useOrder } from '../context/OrderContext';
import { useMesasStore } from "../context/MesasStore.ts";

const ButtonEnviarPedidots: React.FC = () => {
  const { state, dispatch } = useOrder(); // Accede al estado global
  const { updateMesa } = useMesasStore();
  const [loading, setLoading] = useState(false);

  const handleButtonClick = async () => {
    if (state.items.length === 0) {
      toast.warn('No hay productos en el pedido.');
      return;
    }

    setLoading(true); // Deshabilita el botón mientras carga

    try {
      // 1️⃣ Crear la comanda
      const comandaResponse = await axios.post('http://localhost:3000/comanda', {
        // TODO: id dinamico
        idMesa: 1,
        pagado: false,
        fecha: new Date().toISOString().split('T')[0],
        totalpagar: state.total,
      });

      const comandaId = comandaResponse.data.id;

      // 2️⃣ Guardar cada producto en detalle_comanda
      await Promise.all(
        state.items.map(item =>
          axios.post('http://localhost:3000/detalle_comanda', {
            idcomanda: comandaId,
            idproducto: item.id,
            cantidad: item.cantidad, // Puedes mejorar esto si manejas cantidades en el contexto
            precio: item.precio,
          })
        )
      );

      // 3️⃣ Actualizar estado de la mesa
      await axios.put('http://localhost:3000/mesas/1', { estado: 2 }); // Pendiente de servir
      // TODO: id dinamico
      updateMesa(1, 2); // Actualizar el estado de la mesa localmente

      // 4️⃣ Limpiar carrito después de enviar pedido
      dispatch({ type: 'CLEAR_CART' });

      //toast.success('¡Pedido enviado con éxito!');
      setTimeout(() => {
        toast.success('¡Pedido enviado con éxito!');
      }, 100);

    } catch (error) {
      console.error('Error al enviar el pedido:', error);
      toast.error('Error al enviar el pedido');
    } finally {
      setLoading(false); // Habilita el botón después de la respuesta
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