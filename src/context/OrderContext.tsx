import { createContext, useReducer, useContext } from 'react';
import type { ReactNode } from 'react';

// Definir la estructura del estado inicial
interface Item {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
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
    | { type: 'REMOVE_ITEM'; payload: number } // El payload es el ID del item a eliminar
    | { type: 'UPDATE_QUANTITY'; payload: { id: number; cantidad: number } }
    | { type: 'CLEAR_CART' };

// Definir el reducer con los tipos
const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const itemIndex = state.items.findIndex((item) => item.id === action.payload.id);
            if (itemIndex !== -1) {
                const updatedItems = state.items.map((item) =>
                    item.id === action.payload.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                );
                const updatedTotal = updatedItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
                return { items: updatedItems, total: updatedTotal };
            }
            const updatedItems = [...state.items, { ...action.payload, cantidad: 1 }];
            const updatedTotal = updatedItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
            return { items: updatedItems, total: updatedTotal };
        }
        case 'UPDATE_QUANTITY': {
            const updatedItems = state.items.map((item) =>
                item.id === action.payload.id ? { ...item, cantidad: action.payload.cantidad } : item
            );
            const updatedTotal = updatedItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
            return { items: updatedItems, total: updatedTotal };
        }
        case 'REMOVE_ITEM': {
            const filteredItems = state.items.filter((item) => item.id !== action.payload);
            const newTotal = filteredItems.reduce((total, item) => total + item.precio * item.cantidad, 0);
            return { items: filteredItems, total: newTotal };
        }
        case 'CLEAR_CART': {
            return { items: [], total: 0 }; // Limpia el carrito
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
