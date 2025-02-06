import React from "react";
import { useOrder } from "../context/OrderContext";

export const Total: React.FC = () => {
    const { state } = useOrder();
    const total = state.total;

    return (
        <div className="flex items-center justify-center">
            <p className="text-2xl font-bold text-white bg-gradient-to-r from-green-400 to-blue-500 rounded-lg shadow-lg px-6 py-3">
                Total: {total.toFixed(2)} €
            </p>
        </div>
    );
};

export default Total;
