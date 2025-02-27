import React from "react";
import { OrderProvider } from "../context/OrderContext";
import AccordionSection from "./AccordeonSection";
import ButtonEnviarPedidots from "./ButtonEnviarPedidots";
import ButtonSolicitarAsistenciats from "./ButtonSolicitarAsistenciats";
import ButtonSolicitarCuentats from "./ButtonSolicitarCuentats";
import Total from "./Total";

// Definimos los tipos de las props que recibirá el componente
interface Producto {
    id: number;
    nombre: string;
    precio: number;
    categoria: number;
    imagen: string;
}

interface AppProps {
    productos: Producto[];
    entrantes: Producto[];
    principales: Producto[];
    postres: Producto[];
    bebidas: Producto[];
}

const App: React.FC<AppProps> = ({ entrantes, principales, postres, bebidas }) => {
    return (
        <OrderProvider>
            <div className="mx-auto max-w-screen-md mb-10">
                <div className="mt-5 space-y-2">
                    {/* Secciones del Menú */}
                    <AccordionSection title="Entrantes" items={entrantes} />
                    <AccordionSection title="Principales" items={principales} />
                    <AccordionSection title="Postres" items={postres} />
                    <AccordionSection title="Bebidas" items={bebidas} />
                </div>

                {/* Total */}
                <div className="container mt-5 mb-10 flex justify-center">
                    <Total />
                </div>

                {/* Botones */}
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <ButtonEnviarPedidots />
                    <ButtonSolicitarAsistenciats />
                    <ButtonSolicitarCuentats />
                </div>
            </div>
        </OrderProvider>
    );
};

export default App;
