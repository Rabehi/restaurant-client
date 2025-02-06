import React, { useState } from "react";
import OrderList from "./OrderList";
import AccordeonSvg from "./AccordeonSvg";

const AccordionSection: React.FC<{ title: string; items: any[] }> = ({ title, items }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="mb-2">
            <h2>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full p-5 font-medium text-gray-500 hover:bg-gray-100 rounded-lg gap-3"
                >
                    <span className="font-bold">{title}</span>
                    <AccordeonSvg isOpen={isOpen} />
                </button>
            </h2>
            {isOpen && (
                <div className="p-5 border border-t-0 rounded-b-lg">
                    <OrderList items={items} />
                </div>
            )}
        </div>
    );
};

export default AccordionSection;
