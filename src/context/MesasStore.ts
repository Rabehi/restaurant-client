import { create } from "zustand";

interface Mesa {
    id: number;
    estado: number;
}

interface MesasStore {
    mesas: Mesa[];
    fetchMesas: () => void;
    updateMesa: (id: number, estado: number) => void;
}

export const useMesasStore = create<MesasStore>((set) => ({
    mesas: [],
    fetchMesas: async () => {
        try {
            const response = await fetch("http://localhost:3000/mesas");
            const data = await response.json();
            set({ mesas: data.sort((a, b) => a.id - b.id) });
        } catch (error) {
            console.error("Error al cargar mesas:", error);
        }
    },
    updateMesa: async (id, estado) => {
        try {
            await fetch(`http://localhost:3000/mesas/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ estado }),
            });
            set((state) => ({
                mesas: state.mesas.map((mesa) =>
                    mesa.id === id ? { ...mesa, estado } : mesa
                ),
            }));
        } catch (error) {
            console.error("Error actualizando mesa:", error);
        }
    },
}));
