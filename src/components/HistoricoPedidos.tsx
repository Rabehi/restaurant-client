import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ButtonIcon from './ButtonIcon';

type Pedido = {
    fecha: string;
    producto: string;
    cantidad: number;
};

const HistoricoPedidos = () => {
    const { user } = useAuth();
    const [mostrar, setMostrar] = useState(false);
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleMostrar = () => setMostrar(prev => !prev);

    useEffect(() => {
        if (mostrar && user) {
            setLoading(true);
            axios
                .get(`http://localhost:3000/comanda/historico/${user.id}`)
                .then(res => {
                    setPedidos(res.data);
                })
                .catch(err => {
                    console.error('Error al cargar el histórico', err);
                })
                .finally(() => setLoading(false));
        }
    }, [mostrar, user]);

    if (!user) return null;

    const pedidosPorFecha = pedidos.reduce((acc, pedido) => {
        if (!acc[pedido.fecha]) acc[pedido.fecha] = [];
        acc[pedido.fecha].push(pedido);
        return acc;
    }, {} as Record<string, Pedido[]>);

    const formatearFecha = (fecha: string) => {
        const date = new Date(fecha);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="px-4 py-4">
            <ButtonIcon
                color="blue"
                icon={
                    <svg
                        className="w-5 h-5 text-white me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 16 16"
                        aria-hidden="true"
                    >
                        <path
                            stroke="white"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 8h8m0 0-4-4m4 4-4 4"
                        />
                    </svg>
                }
                text={mostrar ? 'Ocultar histórico' : 'Mostrar histórico'}
                onClick={toggleMostrar}
            />

            {mostrar && (
                <div className="bg-white rounded shadow p-4 mt-4 overflow-x-auto">
                    {loading ? (
                        <p>Cargando historial...</p>
                    ) : pedidos.length === 0 ? (
                        <p className="text-gray-500">Aún no has realizado ningún pedido.</p>
                    ) : (
                        Object.entries(pedidosPorFecha).map(([fecha, pedidos]) => (
                            <div key={fecha} className="mb-6">
                                <div className="border-b border-gray-300 mb-2 pb-1 text-lg font-bold text-gray-700">
                                    {formatearFecha(fecha)}
                                </div>
                                <table className="w-full table-auto mb-2">
                                    <thead>
                                        <tr className="bg-gray-100 text-left">
                                            <th className="p-2">Producto</th>
                                            <th className="p-2">Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidos.map((pedido, idx) => (
                                            <tr key={idx} className="border-b">
                                                <td className="p-2">{pedido.producto}</td>
                                                <td className="p-2">{pedido.cantidad}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default HistoricoPedidos;
