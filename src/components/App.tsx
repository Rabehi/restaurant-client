import React from "react";
import OrderList from "./OrderList";
import { OrderProvider } from "../context/OrderContext";
import AccordeonSvg from "./AccordeonSvg";
import ButtonEnviarPedidots from "./ButtonEnviarPedidots";
import ButtonSolicitarAsistenciats from "./ButtonSolicitarAsistenciats";
import ButtonSolicitarCuentats from "./ButtonSolicitarCuentats";

// Definimos los tipos de las props que recibirá el componente
interface Producto {
    id: number;
    nombre: string;
    precio: number;
    categoria: number;
}

interface AppProps {
    productos: Producto[];
    entrantes: Producto[];
    principales: Producto[];
    postres: Producto[];
    bebidas: Producto[];
}

const App: React.FC<AppProps> = ({ productos, entrantes, principales, postres, bebidas }) => {
    return (
        <OrderProvider>
            <div className="mx-auto max-w-screen-md mb-10">
                <div className="mt-5" id="accordion-arrow-icon" data-accordion="open">
                    {/* Entrantes */}
                    <h2 id="accordion-arrow-icon-heading-1">
                        <button
                            type="button"
                            className="flex items-center justify-between w-full p-5 font-medium text-gray-500 hover:bg-gray-100 gap-3"
                            data-accordion-target="#accordion-arrow-icon-body-1"
                            aria-expanded="false"
                            aria-controls="accordion-arrow-icon-body-1"
                        >
                            <span className="font-bold">Entrantes</span>
                            <AccordeonSvg />
                        </button>
                    </h2>
                    <div
                        id="accordion-arrow-icon-body-1"
                        className="hidden"
                        aria-labelledby="accordion-arrow-icon-heading-1"
                    >
                        <div className="p-5 border border-t-0">
                            <OrderList items={entrantes} />
                        </div>
                    </div>

                    {/* Principales */}
                    <h2 id="accordion-arrow-icon-heading-2">
                        <button
                            type="button"
                            className="flex items-center justify-between w-full p-5 font-medium text-gray-500 hover:bg-gray-100 gap-3"
                            data-accordion-target="#accordion-arrow-icon-body-2"
                            aria-expanded="false"
                            aria-controls="accordion-arrow-icon-body-2"
                        >
                            <span className="font-bold">Principales</span>
                            <AccordeonSvg />
                        </button>
                    </h2>
                    <div
                        id="accordion-arrow-icon-body-2"
                        className="hidden"
                        aria-labelledby="accordion-arrow-icon-heading-2"
                    >
                        <div className="p-5 border border-t-0">
                            <OrderList items={principales} />
                        </div>
                    </div>

                    {/* Postres */}
                    <h2 id="accordion-arrow-icon-heading-3">
                        <button
                            type="button"
                            className="flex items-center justify-between w-full p-5 font-medium text-gray-500 hover:bg-gray-100 gap-3"
                            data-accordion-target="#accordion-arrow-icon-body-3"
                            aria-expanded="false"
                            aria-controls="accordion-arrow-icon-body-3"
                        >
                            <span className="font-bold">Postres</span>
                            <AccordeonSvg />
                        </button>
                    </h2>
                    <div
                        id="accordion-arrow-icon-body-3"
                        className="hidden"
                        aria-labelledby="accordion-arrow-icon-heading-3"
                    >
                        <div className="p-5 border border-t-0">
                            <OrderList items={postres} />
                        </div>
                    </div>

                    {/* Bebidas */}
                    <h2 id="accordion-arrow-icon-heading-4">
                        <button
                            type="button"
                            className="flex items-center justify-between w-full p-5 font-medium text-gray-500 hover:bg-gray-100 gap-3"
                            data-accordion-target="#accordion-arrow-icon-body-4"
                            aria-expanded="false"
                            aria-controls="accordion-arrow-icon-body-4"
                        >
                            <span className="font-bold">Bebidas</span>
                            <AccordeonSvg />
                        </button>
                    </h2>
                    <div
                        id="accordion-arrow-icon-body-4"
                        className="hidden"
                        aria-labelledby="accordion-arrow-icon-heading-4"
                    >
                        <div className="p-5 border border-t-0">
                            <OrderList items={bebidas} />
                        </div>
                    </div>
                </div>

                {/* Botones */}
                <div className="container mt-5 flex flex-row justify-between">
                    <ButtonEnviarPedidots />
                    <ButtonSolicitarAsistenciats />
                    <ButtonSolicitarCuentats />
                </div>
            </div>
        </OrderProvider>
    );
};

export default App;
