/* ============================================================
   Custom Hook: useDebounce
   Retrasa la actualización de un valor hasta que el usuario
   deja de escribirlo por "delay" milisegundos.
   ============================================================ */

import { useState, useEffect } from 'react';

// useDebounce(valor, delay)
//
// Recibe un valor y un delay en ms.
// Devuelve el mismo valor, pero "atrasado": solo se actualiza
// cuando pasan "delay" ms SIN que el valor cambie.
//
// Útil para búsquedas: evita hacer fetch en cada tecla.
export function useDebounce(valor, delay = 300) {
  const [debounced, setDebounced] = useState(valor);

  useEffect(() => {
    // Arrancamos un timer que actualiza el valor después del delay
    const timer = setTimeout(() => {
      setDebounced(valor);
    }, delay);

    // Si valor cambia antes de que el timer termine,
    // cancelamos el timer anterior y empezamos de nuevo.
    return () => clearTimeout(timer);
  }, [valor, delay]);

  return debounced;
}
