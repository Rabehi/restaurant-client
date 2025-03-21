import React, { useEffect } from "react";
import { useMesasStore } from "../context/MesasStore.ts";
import ComandasNoPagadas from "./ComandasNoPagadas";

const getColor = (estado: number) => {
  switch (estado) {
    case 0:
      return "bg-white text-gray-900"; // Libre
    case 1:
      return "bg-yellow-400 text-gray-900"; // Ocupada
    case 2:
      return "bg-red-500 text-white"; // Pendiente servir
    case 3:
      return "bg-blue-500 text-white"; // Pendiente asistencia
    case 4:
      return "bg-green-500 text-white"; // Cuenta solicitada
    default:
      return "bg-gray-300 text-gray-900"; // Desconocido
  }
};

const Mesas: React.FC = () => {
  const mesas = useMesasStore((state) => state.mesas);
  console.log("Mesas actuales:", mesas);
  const fetchMesas = useMesasStore((state) => state.fetchMesas);
  const updateMesa = useMesasStore((state) => state.updateMesa);


  // Cargamos las mesas al montar el componente
  useEffect(() => {
    console.log("useEffect is running");
    fetchMesas();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="space-y-4">
        {mesas.map((mesa) => (
          <details
            key={mesa.id}
            className="border rounded-lg shadow-md overflow-hidden transition duration-200"
          >
            <summary
              className={`p-5 text-lg font-semibold ${getColor(
                mesa.estado
              )} cursor-pointer border-b transition-all duration-200 hover:opacity-80`}
            >
              Mesa {mesa.id}
            </summary>
            <div className="p-5 flex flex-col gap-4 bg-gray-100">
              {/* Estado y botones */}
              <div className="flex justify-between items-center w-full">
                <span className="text-lg font-semibold text-gray-700">
                  Estado
                </span>
                <div className="flex flex-1 justify-center gap-6">
                  <button
                    className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 active:bg-green-700 transition duration-200"
                    onClick={() => updateMesa(mesa.id, 0)}
                  >
                    Libre
                  </button>
                  <button
                    className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 active:bg-red-700 transition duration-200"
                    onClick={() => updateMesa(mesa.id, 1)}
                  >
                    Ocupada
                  </button>
                </div>
              </div>

              {/* Mostrar comandas no pagadas si la mesa no está libre */}
              {mesa.estado !== 0 && (
                <ComandasNoPagadas mesaId={mesa.id} />
              )}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
};

export default Mesas;
