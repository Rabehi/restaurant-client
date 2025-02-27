import React from "react";
import { useOrder } from "../context/OrderContext";

export const Total: React.FC = () => {
    const { state } = useOrder();
    const total = state.total;

    return (
        <div className="flex items-center justify-center mt-4">
            <div className="font-['Poppins']">
                <p className="text-2xl font-bold text-center tracking-tight text-indigo-600 dark:text-indigo-400">
                    Total: {total.toFixed(2)} €
                </p>
            </div>
        </div>
    );
};

export default Total;