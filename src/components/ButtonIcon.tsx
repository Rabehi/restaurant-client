import React from 'react';

interface ButtonProps {
    color: string;
    icon: JSX.Element;
    text: string;
    onClick: () => void;
    disabled?: boolean;
}



const ButtonIcon: React.FC<ButtonProps> = ({ color, icon, text, onClick, disabled }) => {

    const isYellow = color.toLowerCase() === 'yellow';

    return (
        <button
            type="button"
            className={`text-white ${isYellow ? 'bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-yellow-900' : `bg-${color}-600 hover:bg-${color}-700 focus:outline-none focus:ring-4 focus:ring-${color}-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-${color}-900`}`}
            onClick={onClick}
            disabled={disabled}
        >
            {icon}
            {text}
        </button>
    );
};

export default ButtonIcon;

