import React from 'react';
import { useOrder } from '../context/OrderContext';
import List from './List';

// Definimos los tipos de las props
interface Item {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen: string;
}

interface OrderListProps {
    items: Item[];
}

export const OrderList: React.FC<OrderListProps> = ({ items }) => {
    const { dispatch } = useOrder();

    const handleAddItem = (id: number, nombre: string, precio: number, imagen: string) => {
        dispatch({
            type: 'ADD_ITEM',
            payload: { id, nombre, precio, cantidad: 1, imagen }
        });
    };


    const handleRemoveItem = (id: number) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id }); // Pasamos el ID directamente
    };

    if (!Array.isArray(items) || items.length === 0) {
        return <div>No items available.</div>;
    }

    return (
        <div>
            {items.map((item) => (
                <List
                    key={item.id}
                    id={item.id}
                    nombre={item.nombre}
                    precio={item.precio}
                    cantidad={item.cantidad}
                    imagen={item.imagen}
                    onAddItem={() => handleAddItem(item.id, item.nombre, item.precio, item.imagen)}
                    onRemoveItem={() => handleRemoveItem(item.id)}
                />
            ))}
        </div>
    );
};

export default OrderList;