import React, { useEffect, useState } from "react";
import { useMesasStore } from "../context/MesasStore";

interface DetalleComanda {
    id: number;
    idcomanda: number;
    idproducto: number;
    cantidad: number;
    precio: number;
    producto_nombre: string;
    servido: boolean; // control local si servido o no servido
}

interface ComandasNoPagadasProps {
    mesaId: number;
}

const ComandasNoPagadas: React.FC<ComandasNoPagadasProps> = ({ mesaId }) => {
    const [detalles, setDetalles] = useState<DetalleComanda[]>([]);
    const [loading, setLoading] = useState(true);
    const { mesas } = useMesasStore();
    const [ultimoEstado, setUltimoEstado] = useState<number | null>(null);

    const mesaActual = mesas.find(m => m.id === mesaId);
    const estadoMesa = mesaActual?.estado || 0;

    const fetchComandas = () => {
        setLoading(true);
        fetch(`http://localhost:3000/detalle_comanda/no_pagado/${mesaId}`)
            .then((res) => res.json())
            .then((data: DetalleComanda[]) => {
                setDetalles(prevDetalles => {
                    // Mapear nuevos datos manteniendo el estado de servido
                    const nuevosDetalles = data.map(item => {
                        // Buscar si ya existía este detalle
                        const existente = prevDetalles.find(d => d.id === item.id);

                        return {
                            ...item,
                            // Mantener estado anterior si existe, sino aplicar lógica nueva
                            servido: existente ? existente.servido : estadoMesa === 1
                        };
                    });

                    return nuevosDetalles;
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error al cargar detalles:", error);
                setLoading(false);
            });
    };

    useEffect(() => {
        // Solo actualizar si cambió el estado de la mesa
        if (ultimoEstado !== estadoMesa) {
            setDetalles(prev => prev.map(d => ({
                ...d,
                // Actualizar solo los items no servidos cuando el estado cambia a "Ocupada"
                servido: d.servido || estadoMesa === 1
            })));
            setUltimoEstado(estadoMesa);
        }
    }, [estadoMesa]);

    useEffect(() => {
        fetchComandas();
    }, [mesaId, mesas]);

    if (loading) {
        return <p>Cargando comandas...</p>;
    }

    if (!detalles || detalles.length === 0) {
        return <p className="text-gray-700">Esta mesa aún no tiene comandas</p>;
    }

    const total = detalles.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    return (
        <div className="space-y-2">
            <p className="font-semibold text-gray-700">Comandas:</p>
            <div className="grid gap-y-2">
                {detalles.map((detalle, index) => (
                    <React.Fragment key={detalle.id}>
                        {index > 0 && detalles[index - 1].idcomanda !== detalle.idcomanda && (
                            <hr className="border-t border-gray-300 my-2" />
                        )}
                        <div className="grid grid-cols-4 items-center text-center gap-x-2">
                            {detalle.servido ? (
                                <span className="text-green-500">✓</span>
                            ) : (
                                <span className="text-red-500">✗</span>
                            )}
                            <span className="text-left">{detalle.producto_nombre}</span>
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