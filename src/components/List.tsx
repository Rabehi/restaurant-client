import { useOrder } from "../context/OrderContext";
import { useState, useEffect } from "react";
import axios from "axios";

interface ListProps {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
    imagen: string;
    onAddItem: (id: number, nombre: string, precio: number) => void;
    onRemoveItem: (id: number) => void;
}

const List: React.FC<ListProps> = ({ id, nombre, precio, imagen, onAddItem, onRemoveItem }) => {
    const { state } = useOrder();
    const count = state.items.find((item) => item.id === id)?.cantidad || 0;
    const [puntuacion, setPuntuacion] = useState<{ promedio: number; total_valoraciones: number } | null>(null);
    const [loadingPuntuacion, setLoadingPuntuacion] = useState(false);

    useEffect(() => {
        const fetchPuntuacion = async () => {
            setLoadingPuntuacion(true);
            try {
                const response = await axios.get(`http://localhost:3000/api/productos/${id}/puntuacion-promedio`);
                setPuntuacion(response.data);
            } catch (error) {
                console.error('Error al obtener puntuación:', error);
            } finally {
                setLoadingPuntuacion(false);
            }
        };

        fetchPuntuacion();
    }, [id]);

    const handleIncrement = () => {
        onAddItem(id, nombre, precio);
    };

    const handleDecrement = () => {
        if (count > 0) {
            onRemoveItem(id);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 mb-4">
            <div className="flex justify-between items-center">
                {/* Contenedor Izquierdo: Imagen, Nombre y Precio */}
                <div className="flex items-center space-x-4">
                    <img
                        src={imagen}
                        alt={nombre}
                        className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {nombre}
                        </h2>
                        <div className="flex items-center space-x-1">
                            {!loadingPuntuacion && puntuacion?.promedio ? (
                                <>
                                    <svg
                                        className="w-4 h-4 text-yellow-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                        {puntuacion.promedio.toFixed(1)} ({puntuacion.total_valoraciones})
                                    </span>
                                </>
                            ) : (
                                <span className="text-sm text-gray-400 dark:text-gray-500">
                                    {loadingPuntuacion ? 'Cargando...' : 'Sin valoraciones'}
                                </span>
                            )}
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                            {precio}€
                        </p>
                    </div>
                </div>

                {/* Contenedor Derecho: Botones y Contador */}
                <div className="flex items-center space-x-3">
                    <button
                        type="button"
                        className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 transition-colors duration-200"
                        onClick={handleIncrement}
                    >
                        <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 5v14M5 12h14"
                            ></path>
                        </svg>
                    </button>
                    <span className="text-lg font-medium text-gray-900 dark:text-white">
                        {count}
                    </span>
                    <button
                        type="button"
                        className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-800 transition-colors duration-200"
                        onClick={handleDecrement}
                    >
                        <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 12H5"
                            ></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default List;