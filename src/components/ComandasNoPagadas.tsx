import React, { useEffect, useState } from "react";
import { useMesasStore } from "../context/MesasStore";

interface DetalleNoPagado {
    id: number;
    idcomanda: number;
    idproducto: number;
    cantidad: number;
    precio: number;
    producto_nombre: string;
}

interface ComandasNoPagadasProps {
    mesaId: number;
}

const ComandasNoPagadas: React.FC<ComandasNoPagadasProps> = ({ mesaId }) => {
    const [detalles, setDetalles] = useState<DetalleNoPagado[]>([]);
    const [loading, setLoading] = useState(true);
    const { mesas } = useMesasStore();

    const fetchComandas = () => {
        setLoading(true);
        fetch(`http://localhost:3000/detalle_comanda/no_pagado/${mesaId}`)
            .then((res) => res.json())
            .then((data) => {
                setDetalles(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al cargar detalles:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchComandas();

        // Escuchar cambios en el estado de las mesas
        // Esto se activará cuando llegue un mensaje WebSocket
    }, [mesaId, mesas]); // Ahora depende de mesas

    if (loading) {
        return <p>Cargando comandas...</p>;
    }

    if (!detalles || detalles.length === 0) {
        return <p className="text-gray-700">Esta mesa aún no tiene comandas</p>;
    }

    const total = detalles.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    return (
        <div className="space-y-2">
            <p className="font-semibold text-gray-700">Comandas sin pagar:</p>
            <div className="grid gap-y-2">
                {detalles.map((detalle, index) => (
                    <React.Fragment key={detalle.id}>
                        {index > 0 && detalles[index - 1].idcomanda !== detalle.idcomanda && (
                            <hr className="border-t border-gray-300 my-2" />
                        )}
                        <div className="grid grid-cols-3 text-center gap-x-4">
                            <span>{detalle.producto_nombre}</span>
                            <span>x{detalle.cantidad}</span>
                            <span>{(detalle.precio * detalle.cantidad).toFixed(2)} €</span>
                        </div>
                    </React.Fragment>
                ))}
            </div>
            <p className="font-semibold text-gray-800 mt-2 text-right">
                Total: {total.toFixed(2)} €
            </p>
        </div>
    );
};

export default ComandasNoPagadas;