import React from "react";

interface AccordeonSvgProps {
    isOpen: boolean;
}

const AccordeonSvg: React.FC<AccordeonSvgProps> = ({ isOpen }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-6 h-6 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );
};

export default AccordeonSvg;
