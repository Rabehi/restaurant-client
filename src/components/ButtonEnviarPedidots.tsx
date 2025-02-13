import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'flowbite/dist/flowbite.css'
import 'react-toastify/dist/ReactToastify.css';
import ButtonIcon from './ButtonIcon';
import axios from 'axios';

const ButtonEnviarPedidots: React.FC = () => {
    const handleButtonClick = () => {
        toast.success('¡Pedido enviado!');
    };

    /*const handleSubmitOrder = async () => {
    try {
      const comandaResponse = await axios.post('http://localhost:3000/comanda', {
        idMesa: 1,
        pagado: false,
        fecha: new Date().toISOString().split('T')[0],
        totalpagar: calculateTotal()
      });

      const comandaId = comandaResponse.data.id;

      for (const [productId, item] of Object.entries(selectedProducts)) {
        await axios.post('http://localhost:3000/detalle_comanda', {
          idcomanda: comandaId,
          idproducto: parseInt(productId),
          cantidad: item.cantidad,
          precio: item.precio
        });
      }

      await axios.put('/mesas/1', { estado: 1 });
      alert('Order submitted successfully!');
      setSelectedProducts({});
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Error submitting order');
    }
  };*/


    return (
        <div>
            <ButtonIcon
                color="green"
                icon={<svg className="w-5 h-5 me-2 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 21">
                    <path d="M15 12a1 1 0 0 0 .962-.726l2-7A1 1 0 0 0 17 3H3.77L3.175.745A1 1 0 0 0 2.208 0H1a1 1 0 0 0 0 2h.438l.6 2.255v.019l2 7 .746 2.986A3 3 0 1 0 9 17a2.966 2.966 0 0 0-.184-1h2.368c-.118.32-.18.659-.184 1a3 3 0 1 0 3-3H6.78l-.5-2H15Z" />
                </svg>}
                text="Enviar pedido"
                onClick={handleButtonClick}
            />
            <ToastContainer />
        </div>
    );
};

export default ButtonEnviarPedidots;