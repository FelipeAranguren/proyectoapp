// src/context/CartContext.jsx
import React, { createContext, useReducer, useContext, useMemo } from 'react';

// --- 1. Creamos el contexto ---
const CartContext = createContext();

// --- 2. Estado inicial ---
const initialState = {
  items: []  // cada item: { id, nombre, precio, qty, notes }
};

// --- 3. Reducer para manejar acciones del carrito ---
function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const product = action.payload;
      const idx = state.items.findIndex(i => i.id === product.id);

      // si ya existe, incrementamos qty
      if (idx > -1) {
        const items = [...state.items];
        items[idx] = {
          ...items[idx],
          qty: items[idx].qty + 1
        };
        return { items };
      }

      // si es nuevo, lo agregamos con qty=1 y notes vacías
      return {
        items: [
          ...state.items,
          {
            id: product.id,
            nombre: product.nombre,
            precio: product.precio,
            qty: 1,
            notes: ''
          }
        ]
      };
    }

    case 'REMOVE_ITEM': {
      const id = action.payload.id;
      const idx = state.items.findIndex(i => i.id === id);
      if (idx === -1) return state;

      const items = [...state.items];
      // si qty>1, decrementamos, sino lo removemos del array
      if (items[idx].qty > 1) {
        items[idx] = { ...items[idx], qty: items[idx].qty - 1 };
      } else {
        items.splice(idx, 1);
      }
      return { items };
    }

    case 'UPDATE_NOTES': {
      const { id, notes } = action.payload;
      return {
        items: state.items.map(i =>
          i.id === id ? { ...i, notes } : i
        )
      };
    }

    case 'CLEAR_CART':
      return { items: [] };

    default:
      return state;
  }
}

// --- 4. Provider que envuelve la App ---
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // API del contexto:
  const addItem     = product => dispatch({ type: 'ADD_ITEM', payload: product });
  const removeItem  = id      => dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  const updateNotes = (id, notes) => dispatch({ type: 'UPDATE_NOTES', payload: { id, notes } });
  const clearCart   = ()      => dispatch({ type: 'CLEAR_CART' });

  // subtotal calculado memoizado
  const subtotal = useMemo(
    () => state.items.reduce((sum, i) => sum + i.qty * i.precio, 0),
    [state.items]
  );

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        subtotal,
        addItem,
        removeItem,
        updateNotes,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// --- 5. Hook para usar el contexto ---
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart debe usarse dentro de <CartProvider>');
  }
  return ctx;
}
