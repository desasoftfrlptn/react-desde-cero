/* ============================================================
   Custom Hook: useLocalStorage
   Como useState, pero persiste el valor en localStorage.
   ============================================================ */

import { useState, useEffect } from 'react';

// useLocalStorage(key, valorInicial)
//
// Funciona igual que useState, pero el valor se guarda en
// localStorage automáticamente. Si ya hay un valor guardado
// con esa key, lo usa. Si no, usa valorInicial.
//
// Cada vez que el valor cambia, se guarda en localStorage.
// Al recargar la página, el valor se recupera solo.
export function useLocalStorage(key, valorInicial) {
  // useState con función inicial: solo se ejecuta UNA VEZ
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(key);
      return guardado !== null ? JSON.parse(guardado) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  // Cada vez que valor o key cambian, guardamos en localStorage
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(valor));
    } catch {
      // Si localStorage está lleno o deshabilitado, ignoramos
    }
  }, [key, valor]);

  // Devolvemos exactamente lo mismo que useState: [valor, setValor]
  return [valor, setValor];
}
