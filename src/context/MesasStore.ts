import { create } from "zustand";
import axios from 'axios';

interface Mesa {
    id: number;
    estado: number;
    updated_at: string;
}

interface MesasStore {
    mesas: Mesa[];
    fetchMesas: () => Promise<void>;
    updateMesa: (id: number, estado: number) => Promise<void>;
}

export const useMesasStore = create<MesasStore>((set) => {
    let ws: WebSocket | null = null;

    const initializeWebSocket = () => {
        if (typeof window !== "undefined") {
            ws = new WebSocket("ws://localhost:3030");

            ws.onopen = () => console.log("Conexión WebSocket establecida");
            ws.onerror = (error) => console.error("Error en WebSocket:", error);

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                if (message.type === "updateMesa") {
                    set(state => ({
                        mesas: state.mesas.map(mesa =>
                            mesa.id === message.id ? { ...mesa, estado: message.estado } : mesa
                        )
                    }));
                }
            };

            ws.onclose = () => setTimeout(initializeWebSocket, 5000);
        }
    };

    initializeWebSocket();

    const fetchMesas = async () => {
        try {
            const { data } = await axios.get("http://localhost:3000/mesas");
            set({ mesas: data.sort((a: Mesa, b: Mesa) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()) });
        } catch (error) {
            console.error("Error al cargar mesas:", error);
        }
    };

    const updateMesa = async (id: number, estado: number) => {
        try {
            // Si el estado es libre, marcamos las comandas como pagadas
            if (estado === 0) {
                try {
                    await axios.put(`http://localhost:3000/comanda/marcar-pagadas/${id}`);
                } catch (error) {
                    // Si el error es un 404, lo ignoramos; de lo contrario, lo lanzamos
                    if (axios.isAxiosError(error) && error.response?.status === 404) {
                        console.warn(`No hay comandas para marcar como pagadas para la mesa ${id}.`);
                    } else {
                        throw error;
                    }
                }
            }

            // Actualizamos la mesa en el backend
            const response = await axios.put(`http://localhost:3000/mesas/${id}`, { estado });
            const mesaActualizada = response.data; // Supongamos que incluye updated_at

            // Enviamos el mensaje por WebSocket para notificar a otros clientes
            if (ws?.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: "updateMesa",
                    id,
                    estado,
                    updated_at: mesaActualizada.updated_at,
                }));
            }

            // Actualizamos el estado local: para ordenar por updated_at, actualizamos la lista completa
            set((state) => ({
                mesas: state.mesas
                    .map((mesa) => (mesa.id === id ? mesaActualizada : mesa))
                    .sort((a: Mesa, b: Mesa) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
            }));
        } catch (error) {
            console.error("Error actualizando mesa:", error);
            throw error;
        }
    };

    return { mesas: [], fetchMesas, updateMesa };
});