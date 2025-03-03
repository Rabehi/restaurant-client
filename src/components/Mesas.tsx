import React, { useEffect, useState } from "react";

// Definimos el tipo Mesa
interface Mesa {
  id: number;
  estado: number;
}

// Función para asignar color según estado
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
  const [mesas, setMesas] = useState<Mesa[]>([]);

  // Cargar mesas desde la API y ordenarlas por ID
  useEffect(() => {
    fetch("http://localhost:3000/mesas")
      .then((res) => res.json())
      .then((data) => {
        // Sort mesas by id in ascending order
        const sortedMesas = data.sort((a, b) => a.id - b.id);
        setMesas(sortedMesas);
      })
      .catch((error) => console.error("Error cargando mesas:", error));
  }, []);

  // Actualizar estado de una mesa
  const updateMesaEstado = (id: number, estado: number) => {
    fetch(`http://localhost:3000/mesas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado }),
    })
      .then(() =>
        setMesas((prev) =>
          prev.map((mesa) => (mesa.id === id ? { ...mesa, estado } : mesa))
        )
      )
      .catch((error) => console.error("Error actualizando mesa:", error));
  };

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
              {/* Nueva fila con el estado y los botones alineados */}
              <div className="flex justify-between items-center w-full">
                <span className="text-lg font-semibold text-gray-700">
                  Estado
                </span>
                <div className="flex flex-1 justify-center gap-6">
                  <button
                    className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 active:bg-green-700 transition duration-200"
                    onClick={() => updateMesaEstado(mesa.id, 0)}
                  >
                    Libre
                  </button>
                  <button
                    className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 active:bg-red-700 transition duration-200"
                    onClick={() => updateMesaEstado(mesa.id, 1)}
                  >
                    Ocupada
                  </button>
                </div>
              </div>
            </div>
          </details>
        ))}
      </div>

      {/* Leyenda de colores */}
      <div className="mt-6 p-4 border-t">
        <h3 className="text-lg text-gray-700 mb-3">Leyenda de estados</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-white border border-gray-400"></div>
            <span className="text-gray-700">Libre</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-yellow-400"></div>
            <span className="text-gray-700">Ocupada</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-red-500"></div>
            <span className="text-gray-700">Pendiente servir</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-500"></div>
            <span className="text-gray-700">Pendiente asistencia</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-green-500"></div>
            <span className="text-gray-700">Cuenta solicitada</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mesas;
