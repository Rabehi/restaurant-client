import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import ButtonIcon from './ButtonIcon';
import axios from 'axios';

type Producto = {
    id: number;
    nombre: string;
    valoracion?: number; // Valoración actual del usuario (1-5)
};

const PuntuacionProductos = () => {
    const { user } = useAuth();
    const [mostrar, setMostrar] = useState(false);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const toggleMostrar = () => setMostrar(prev => !prev);

    // Cargar productos y valoraciones del usuario
    useEffect(() => {
        const cargarDatos = async () => {
            if (mostrar && user) {
                setLoading(true);
                setError(null);

                try {
                    // Obtener productos y valoraciones en paralelo
                    const [productosRes, valoracionesRes] = await Promise.all([
                        axios.get('http://localhost:3000/productos'),
                        axios.get(`http://localhost:3000/api/valoraciones/usuario/${user.id}`)
                    ]);

                    // Combinar productos con sus valoraciones
                    const productosConValoracion = productosRes.data.map((producto: Producto) => {
                        const valoracion = valoracionesRes.data.find((v: any) => v.idproducto === producto.id);
                        return {
                            ...producto,
                            valoracion: valoracion ? valoracion.puntuacion : undefined
                        };
                    });

                    setProductos(productosConValoracion);
                } catch (err) {
                    console.error('Error al cargar datos:', err);
                    setError('Error al cargar los productos');
                } finally {
                    setLoading(false);
                }
            }
        };

        cargarDatos();
    }, [mostrar, user]);

    const handleValorar = async (idproducto: number, puntuacion: number) => {
        if (!user) return;

        try {
            const response = await axios.post('http://localhost:3000/api/valoraciones', {
                idusuario: user.id,
                idproducto,
                puntuacion
            });

            // Actualizar el estado local con la nueva valoración
            setProductos(prev => prev.map(p =>
                p.id === idproducto ? { ...p, valoracion: puntuacion } : p
            ));

        } catch (err) {
            console.error('Error al valorar:', err);
            setError('Error al guardar la valoración');
        }
    };

    if (!user) return null;

    return (
        <div className="px-4 py-4">
            <ButtonIcon
                color="gray"
                icon={
                    <svg
                        className="w-5 h-5 text-white me-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                }
                text={mostrar ? 'Ocultar puntuación' : 'Puntuar productos'}
                onClick={toggleMostrar}
            />

            {mostrar && (
                <div className="bg-white rounded shadow p-4 mt-4 overflow-x-auto">
                    {loading ? (
                        <p>Cargando productos...</p>
                    ) : error ? (
                        <p className="text-red-500">{error}</p>
                    ) : productos.length === 0 ? (
                        <p className="text-gray-500">No hay productos disponibles para valorar.</p>
                    ) : (
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-2">Producto</th>
                                    <th className="p-2">Valoración</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto) => (
                                    <tr key={producto.id} className="border-b">
                                        <td className="p-2">{producto.nombre}</td>
                                        <td className="p-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => handleValorar(producto.id, star)}
                                                        className="focus:outline-none"
                                                        aria-label={`Valorar con ${star} ${star === 1 ? 'estrella' : 'estrellas'}`}
                                                    >
                                                        <svg
                                                            className={`w-6 h-6 ${star <= (producto.valoracion || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default PuntuacionProductos;