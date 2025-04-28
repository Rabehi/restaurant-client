import React, { useEffect, useState } from "react";
import { useMesasStore } from "../context/MesasStore";
import axios from "axios";

interface DetalleComanda {
    id: number;
    idcomanda: number;
    idproducto: number;
    cantidad: number;
    precio: number;
    producto_nombre: string;
    servido: boolean;
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

    const fetchComandas = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:3000/detalle_comanda/no_pagado/${mesaId}`);
            setDetalles(prevDetalles => {
                return response.data.map((item: DetalleComanda) => {
                    const existente = prevDetalles.find(d => d.id === item.id);
                    return {
                        ...item,
                        servido: existente ? existente.servido : estadoMesa === 1
                    };
                });
            });
        } catch (error) {
            console.error("Error al cargar detalles:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateCantidad = async (id: number, nuevaCantidad: number) => {
        try {
            if (nuevaCantidad <= 0) {
                // Eliminar el producto si la cantidad llega a 0
                await axios.delete(`http://localhost:3000/detalle_comanda/${id}`);
                setDetalles(prev => prev.filter(d => d.id !== id));
            } else {
                const detalle = detalles.find(d => d.id === id);
                if (detalle) {
                    await axios.put(`http://localhost:3000/detalle_comanda/${id}`, {
                        idcomanda: detalle.idcomanda,
                        idproducto: detalle.idproducto,
                        cantidad: nuevaCantidad,
                        precio: detalle.precio
                    });
                    setDetalles(prev =>
                        prev.map(d =>
                            d.id === id ? { ...d, cantidad: nuevaCantidad } : d
                        )
                    );
                }
            }
        } catch (error) {
            console.error("Error al actualizar cantidad:", error);
            fetchComandas();
        }
    };

    useEffect(() => {
        if (ultimoEstado !== estadoMesa) {
            setDetalles(prev => prev.map(d => ({
                ...d,
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
            <div className="grid gap-y-3">
                {detalles.map((detalle, index) => (
                    <React.Fragment key={detalle.id}>
                        {index > 0 && detalles[index - 1].idcomanda !== detalle.idcomanda && (
                            <hr className="border-t border-gray-300 my-2" />
                        )}
                        <div className="grid grid-cols-4 items-center text-center gap-x-4 mb-1">
                            {detalle.servido ? (
                                <span className="text-green-500">✓</span>
                            ) : (
                                <span className="text-red-500">✗</span>
                            )}
                            <span className="text-left">{detalle.producto_nombre}</span>
                            <div className="flex items-center justify-center space-x-2 min-w-[80px]">
                                <button
                                    onClick={() => updateCantidad(detalle.id, detalle.cantidad - 1)}
                                    className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
                                    aria-label="Reducir cantidad"
                                >
                                    -
                                </button>
                                <span className="min-w-[20px]">{detalle.cantidad}</span>
                                <button
                                    onClick={() => updateCantidad(detalle.id, detalle.cantidad + 1)}
                                    className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-green-600 transition"
                                    aria-label="Aumentar cantidad"
                                >
                                    +
                                </button>
                            </div>
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
