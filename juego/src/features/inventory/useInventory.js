import { useState, useCallback } from 'react';

export const useInventory = () => {
  const [items, setItems] = useState([]); // Array de strings con los IDs de los items

  const addItem = useCallback((item) => {
    setItems((prev) => {
      if (!prev.includes(item)) return [...prev, item];
      return prev;
    });
  }, []);

  const hasItem = useCallback((item) => {
    return items.includes(item);
  }, [items]);

  const removeItem = useCallback((item) => {
    setItems((prev) => prev.filter(i => i !== item));
  }, []);

  return { items, addItem, hasItem, removeItem };
};
