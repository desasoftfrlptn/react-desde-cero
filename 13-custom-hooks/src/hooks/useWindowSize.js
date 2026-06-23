/* ============================================================
   Custom Hook: useWindowSize
   Devuelve el tamaño actual de la ventana del navegador.
   Se actualiza automáticamente al redimensionar.
   ============================================================ */

import { useState, useEffect } from 'react';

// useWindowSize()
//
// Devuelve { width, height } con el tamaño actual de la
// ventana. Se actualiza cada vez que el usuario cambia
// el tamaño de la ventana.
//
// Incluye cleanup: elimina el event listener al desmontar.
export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const manejarResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', manejarResize);

    return () => {
      window.removeEventListener('resize', manejarResize);
    };
  }, []);

  return size;
}
