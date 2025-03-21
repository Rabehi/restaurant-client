import { create } from "zustand";

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

    // Función para inicializar el WebSocket
    const initializeWebSocket = () => {
        if (typeof window !== "undefined") {
            ws = new WebSocket("ws://localhost:3030");

            ws.onopen = () => {
                console.log("Conexión WebSocket establecida");
            };

            ws.onerror = (error) => {
                console.error("Error en la conexión WebSocket:", error);
            };

            ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                console.log("Mensaje recibido del servidor WebSocket:", message);

                if (message.type === "updateMesa") {
                    set((state) => ({
                        mesas: state.mesas.map((mesa) =>
                            mesa.id === message.id ? { ...mesa, estado: message.estado } : mesa
                        ),
                    }));
                }
            };

            ws.onclose = () => {
                console.log("Conexión WebSocket cerrada. Intentando reconectar...");
                // Intentar reconectar después de 5 segundos
                setTimeout(initializeWebSocket, 5000);
            };
        }
    };

    // Inicializar el WebSocket al montar el store
    initializeWebSocket();

    // Función para cargar mesas
    async function fetchMesas() {
        console.log("fetchMesas() in store is called");

        try {
            const response = await fetch("http://localhost:3000/mesas");
            const data = await response.json();
            set({ mesas: data.sort((a: Mesa, b: Mesa) => a.id - b.id) });
        } catch (error) {
            console.error("Error al cargar mesas:", error);
        }
    }

    // Función para actualizar estado de una mesa
    async function updateMesa(id: number, estado: number) {
        try {
            await fetch(`http://localhost:3000/mesas/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado }),
            });

            // Notificar al servidor WebSocket (si está disponible)
            if (ws) {
                ws.send(JSON.stringify({ type: "updateMesa", id, estado }));
            }

            // Actualizar el estado local
            set((state) => ({
                mesas: state.mesas.map((mesa) =>
                    mesa.id === id ? { ...mesa, estado } : mesa
                ),
            }));
        } catch (error) {
            console.error("Error actualizando mesa:", error);
        }
    }

    // Retornamos el estado inicial y las funciones
    return {
        mesas: [],
        fetchMesas,
        updateMesa,
    };
});