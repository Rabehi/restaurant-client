import { create } from "zustand";
import axios from 'axios';

interface Mesa {
    id: number;
    estado: number;
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
            set({ mesas: data.sort((a: Mesa, b: Mesa) => a.id - b.id) });
        } catch (error) {
            console.error("Error al cargar mesas:", error);
        }
    };

    const updateMesa = async (id: number, estado: number) => {
        try {
            if (estado === 0) { // Solo para estado Libre
                await axios.put(`http://localhost:3000/comanda/marcar-pagadas/${id}`);
            }

            await axios.put(`http://localhost:3000/mesas/${id}`, { estado });

            if (ws?.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: "updateMesa",
                    id,
                    estado
                }));
            }

            set(state => ({
                mesas: state.mesas.map(mesa =>
                    mesa.id === id ? { ...mesa, estado } : mesa
                )
            }));

        } catch (error) {
            console.error("Error actualizando mesa:", error);
            throw error; // Puedes manejar este error en el componente
        }
    };

    return { mesas: [], fetchMesas, updateMesa };
});