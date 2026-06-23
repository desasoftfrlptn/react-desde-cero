/* ============================================================
   Custom Hook: useFetch
   Hook genérico para hacer fetch de una URL.
   ============================================================ */

import { useState, useEffect } from 'react';

// useFetch(url)
//
// Recibe una URL y devuelve { data, loading, error }
// - data: los datos parseados (o null si no cargó)
// - loading: true mientras se está haciendo el fetch
// - error: mensaje de error (o null si no hay error)
//
// El fetch se hace CADA VEZ que la URL cambia.
// Incluye AbortController para cancelar si se desmonta.
export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // No hacemos fetch si no hay URL
    if (!url) {
      setLoading(false);
      return;
    }

    const controlador = new AbortController();
    let ignore = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const respuesta = await fetch(url, {
          signal: controlador.signal,
        });

        if (!respuesta.ok) {
          throw new Error(`HTTP ${respuesta.status}: ${respuesta.statusText}`);
        }

        const json = await respuesta.json();

        if (!ignore) {
          setData(json);
          setLoading(false);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (!ignore) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
      controlador.abort();
    };
  }, [url]);

  return { data, loading, error };
}
