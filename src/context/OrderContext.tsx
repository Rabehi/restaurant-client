import { createContext, useReducer, useContext } from 'react';
import type { ReactNode } from 'react';

// Definir la estructura del estado inicial
interface Item {
    id: number;
    nombre: string;
    precio: number;
}

interface State {
    items: Item[];
    total: number;
}

const initialState: State = {
    items: [],
    total: 0,
};

// Definir las acciones posibles
type Action =
    | { type: 'ADD_ITEM'; payload: Item }
    | { type: 'REMOVE_ITEM'; payload: number }; // El payload es el ID del item a eliminar

// Definir el reducer con los tipos
const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const updatedItems = [...state.items, action.payload];
            const updatedTotal = updatedItems.reduce((total, item) => total + Number(item.precio), 0);
            return { items: updatedItems, total: updatedTotal };
        }
        case 'REMOVE_ITEM': {
            // Encontrar el índice del primer elemento con el ID especificado
            const itemIndex = state.items.findIndex((item) => item.id === action.payload);
            if (itemIndex === -1) {
                return state; // Si no se encuentra el elemento, no hacer nada
            }

            // Crear un nuevo array sin el elemento en el índice encontrado
            const filteredItems = [
                ...state.items.slice(0, itemIndex), // Elementos antes del índice
                ...state.items.slice(itemIndex + 1), // Elementos después del índice
            ];

            // Calcular el nuevo total
            const newTotal = filteredItems.reduce((total, item) => total + Number(item.precio), 0);

            return { items: filteredItems, total: newTotal };
        }
        default:
            return state;
    }
};

// Crear el contexto y definir su tipo
interface OrderContextType {
    state: State;
    dispatch: React.Dispatch<Action>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

// Crear el proveedor del contexto
interface OrderProviderProps {
    children: ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    console.log("Estado actual: ", state); // Para depuración

    return (
        <OrderContext.Provider value={{ state, dispatch }}>
            {children}
        </OrderContext.Provider>
    );
};

// Custom hook para usar el contexto
export const useOrder = (): OrderContextType => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder debe ser usado dentro de un OrderProvider');
    }
    return context;
};