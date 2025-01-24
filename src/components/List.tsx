import { useState } from "react";

// Definimos los tipos de las props
interface ListProps {
    id: number;
    nombre: string;
    precio: number;
    onAddItem: (id: number, nombre: string, precio: number) => void;
    onRemoveItem: (id: number) => void;
}

const List: React.FC<ListProps> = ({ id, nombre, precio, onAddItem, onRemoveItem }) => {
    const [count, setCount] = useState<number>(0);

    const handleIncrement = () => {
        setCount((prevCount) => prevCount + 1);
        onAddItem(id, nombre, precio); // Llama la función para agregar el ítem
    };

    const handleDecrement = () => {
        if (count > 0) {
            setCount((prevCount) => prevCount - 1);
            onRemoveItem(id); // Llama la función para eliminar el ítem
        }
    };

    return (
        <div className="flex justify-between mt-2">
            <div>
                <h2>
                    {nombre}
                    <span> - </span>
                    {precio}
                    <span>€</span>
                </h2>
            </div>
            <div>
                <button
                    type="button"
                    className="text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
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
                <span className="ml-3 mr-3">{count}</span>
                <button
                    type="button"
                    className="text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center dark:bg-red-400 dark:hover:bg-red-500 dark:focus:ring-red-800"
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
    );
};

export default List;
