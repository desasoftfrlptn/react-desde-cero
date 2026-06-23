/* ============================================================
   React desde 0 — Proyecto 10: useEffect
   Concepto: efectos secundarios, ciclo de vida, fetch, cleanup
   ============================================================
   Hasta ahora todo era "renderizado puro": JSX basado en
   props y estado. Pero las apps reales necesitan más:
   - Buscar datos en una API
   - Sincronizar con el título de la pestaña
   - Iniciar un timer
   - Conectarse a un WebSocket

   useEffect es la herramienta para hacer cosas FUERA de React.
   ============================================================ */

import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';

// =============================================================
// ¿Qué es useEffect?
// =============================================================
// useEffect ejecuta código DESPUÉS de que el componente se
// renderiza y se pinta en pantalla.
//
//   useEffect(() => {
//     // Código del efecto (se ejecuta después del render)
//     return () => {
//       // Cleanup (se ejecuta antes de desmontar o re-ejecutar)
//     };
//   }, [dependencias]);
//
// El array de dependencias controla CUÁNDO se ejecuta:
//
//   useEffect(fn, [])       → se ejecuta UNA VEZ al montar
//   useEffect(fn, [x, y])   → se ejecuta al montar y cuando x o y cambian
//   useEffect(fn)           → se ejecuta en CADA render (MUY RARO)
//
// El CLEANUP (return) se ejecuta:
//   1. Cuando el componente se DESMONTA
//   2. Antes de re-ejecutar el efecto (si las dependencias cambian)
// =============================================================

// -------------------------------------------------------------
// Componente 1: Cronometro — useEffect con setInterval + cleanup
// -------------------------------------------------------------
// Demo de:
// - useEffect con [] (solo al montar)
// - Cleanup con clearInterval
// - CÓMO el estado persiste entre renders
function Cronometro() {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);

  // useEffect con []: se ejecuta UNA VEZ al montar el componente.
  // Pero acá NO sirve porque necesitamos que el intervalo se
  // cree/elimine cuando activo cambia.
  //
  // useEffect con [activo]: se ejecuta al montar y cada vez
  // que activo cambia.

  useEffect(() => {
    // Si no está activo, no creamos el intervalo
    if (!activo) return;

    console.log('🟢 Intervalo CREADO');

    const intervalo = setInterval(() => {
      setSegundos((s) => s + 1);
      // Usamos la forma funcional: setSegundos(s => s + 1)
      // porque si usáramos setSegundos(segundos + 1) tomaría
      // el valor "congelado" del render donde se creó el efecto.
    }, 1000);

    // CLEANUP: se ejecuta cuando:
    // 1. activo cambia → se limpia el intervalo anterior antes de crear el nuevo
    // 2. El componente se desmonta → se limpia el intervalo
    return () => {
      console.log('🔴 Intervalo ELIMINADO');
      clearInterval(intervalo);
    };
  }, [activo]);
  // ↑ cuando activo cambia, se limpia el intervalo anterior
  //   y se crea uno nuevo (o no, si activo pasó a false)

  const resetear = () => {
    setSegundos(0);
    setActivo(false);
  };

  // Formatear como MM:SS
  const minutos = Math.floor(segundos / 60);
  const segs = segundos % 60;
  const tiempo = `${String(minutos).padStart(2, '0')}:${String(segs).padStart(2, '0')}`;

  return (
    <div>
      <h2>⏱️ Cronómetro</h2>
      <p style={{ fontSize: '3em', fontFamily: 'monospace', margin: '8px 0' }}>
        {tiempo}
      </p>
      <button onClick={() => setActivo(!activo)}>
        {activo ? '⏸️ Pausar' : '▶️ Iniciar'}
      </button>
      <button onClick={resetear}>⏹️ Reset</button>
      <p>💡 Abrí la consola para ver cuándo se crea/elimina el intervalo</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 2: CambiaTitulo — useEffect sin cleanup
// -------------------------------------------------------------
// Algunos efectos no necesitan cleanup. Como cambiar el título
// de la pestaña. Cuando el componente se desmonta, no queda
// nada que limpiar.
function CambiaTitulo() {
  const [texto, setTexto] = useState('');

  useEffect(() => {
    // Este efecto se ejecuta CADA VEZ que `texto` cambia.
    // No devolvemos cleanup porque no hace falta.
    document.title = texto
      ? `🔔 ${texto} — React desde 0`
      : 'React desde 0 — Proyecto 10';
  }, [texto]);

  return (
    <div>
      <h2>📝 Cambiar título de la pestaña</h2>
      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribí algo para verlo en el título..."
      />
      <p>👁️ Mirá el título de la pestaña del navegador</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: FetchPokemon — fetch con AbortController
// -------------------------------------------------------------
// Acá hacemos fetch de una API real. Los pasos:
// 1. useState para data, loading, error
// 2. useEffect con [] para hacer el fetch al montar
// 3. AbortController para cancelar el fetch si el componente
//    se desmonta antes de que termine la respuesta
function FetchPokemon() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // AbortController: nos permite cancelar el fetch si el
    // componente se desmonta antes de que llegue la respuesta.
    const controlador = new AbortController();

    const fetchPokemon = async () => {
      try {
        setLoading(true);
        setError(null);

        const respuesta = await fetch(
          'https://pokeapi.co/api/v2/pokemon/ditto',
          { signal: controlador.signal }
          // signal: le decimos al fetch que se cancele si
          // llamamos a controlador.abort()
        );

        if (!respuesta.ok) {
          throw new Error(`HTTP ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        setPokemon({
          nombre: datos.name,
          id: datos.id,
          peso: datos.weight,
          altura: datos.height,
          tipos: datos.types.map((t) => t.type.name),
          imagen: datos.sprites.front_default,
        });
      } catch (err) {
        // Si el error es porque cancelamos el fetch, no hacemos nada
        if (err.name === 'AbortError') return;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();

    // CLEANUP: cancelamos el fetch si el componente se desmonta
    return () => {
      controlador.abort();
    };
  }, []);
  // [] → solo al montar. No depende de nada.

  // RENDERIZADO CONDICIONAL según el estado
  if (loading) return <div><h2>📡 Fetch de datos</h2><p>⏳ Cargando Pokémon...</p></div>;
  if (error) return <div><h2>📡 Fetch de datos</h2><p>❌ Error: {error}</p></div>;

  return (
    <div>
      <h2>📡 Fetch de datos (PokéAPI)</h2>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <img src={pokemon.imagen} alt={pokemon.nombre}
          style={{ width: 96, height: 96, border: '1px solid #ccc', borderRadius: 8 }} />
        <div>
          <p><strong>#{pokemon.id}</strong> — {pokemon.nombre.toUpperCase()}</p>
          <p>⚖️ Peso: {pokemon.peso / 10} kg | 📏 Altura: {pokemon.altura / 10} m</p>
          <p>🏷️ Tipos: {pokemon.tipos.join(', ')}</p>
        </div>
      </div>
      <p>💡 El fetch se cancela si el componente se desmonta antes de recibir respuesta</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 4: BuscadorPokemon — useEffect con dependencia variable
// -------------------------------------------------------------
// El efecto se RE-EJECUTA cada vez que la dependencia cambia.
// Acá: cuando el usuario escribe un nombre de Pokémon, hacemos
// fetch de ese Pokémon.
//
// Incluye debounce IMPLICADO: el efecto tiene el valor de
// búsqueda como dependencia, así que solo se ejecuta cuando
// el usuario deja de escribir (porque no se ejecuta en cada
// tecla, sino DESPUÉS del render).
function BuscadorPokemon() {
  const [busqueda, setBusqueda] = useState('ditto');
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // No buscar si está vacío
    if (!busqueda.trim()) return;

    // Usamos un flag para evitar race conditions:
    // si el usuario escribe rápido, puede que una respuesta
    // llegue DESPUÉS de otra. Con "ignore" nos aseguramos
    // de no actualizar el estado con respuestas viejas.
    let ignore = false;
    const controlador = new AbortController();

    const buscar = async () => {
      setLoading(true);
      setError(null);

      try {
        const respuesta = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${busqueda.toLowerCase().trim()}`,
          { signal: controlador.signal }
        );

        if (!respuesta.ok) {
          throw new Error('Pokémon no encontrado');
        }

        const datos = await respuesta.json();

        // Solo actualizamos si "ignore" sigue en false
        // (es decir, si no hubo una nueva búsqueda)
        if (!ignore) {
          setPokemon({
            nombre: datos.name,
            id: datos.id,
            peso: datos.weight,
            altura: datos.height,
            tipos: datos.types.map((t) => t.type.name),
            imagen: datos.sprites.front_default,
          });
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        if (!ignore) {
          setPokemon(null);
          setError(err.message);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    buscar();

    return () => {
      ignore = true;       // marca la respuesta como obsoleta
      controlador.abort(); // cancela el fetch
    };
  }, [busqueda]);
  // ↑ efecto se RE-EJECUTA cada vez que busqueda cambia

  return (
    <div>
      <h2>🔍 Buscador de Pokémon (dependencia variable)</h2>

      <input
        type="text"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscá un Pokémon (ej: pikachu, charizard...)"
        style={{ width: '100%', boxSizing: 'border-box' }}
      />

      {loading && <p>⏳ Buscando...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}

      {pokemon && (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 8 }}>
          <img src={pokemon.imagen} alt={pokemon.nombre}
            style={{ width: 96, height: 96 }} />
          <div>
            <p><strong>#{pokemon.id}</strong> — {pokemon.nombre.toUpperCase()}</p>
            <p>🏷️ {pokemon.tipos.join(', ')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 5: MouseTracker — useEffect con addEventListener
// -------------------------------------------------------------
// Cuando agregamos event listeners al DOM (window, document),
// SIEMPRE debemos limpiarlos con removeEventListener.
// Si no, se acumulan y causan memory leaks.
function MouseTracker() {
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [rastreando, setRastreando] = useState(false);

  useEffect(() => {
    if (!rastreando) return;

    console.log('🟢 MouseTracker ACTIVADO');

    const manejarMouse = (e) => {
      setPosicion({ x: e.clientX, y: e.clientY });
    };

    // Agregamos el listener al window
    window.addEventListener('mousemove', manejarMouse);

    // CLEANUP: SACAMOS el listener
    return () => {
      console.log('🔴 MouseTracker DESACTIVADO');
      window.removeEventListener('mousemove', manejarMouse);
    };
  }, [rastreando]);

  return (
    <div>
      <h2>🖱️ Mouse Tracker (addEventListener + cleanup)</h2>

      <button onClick={() => setRastreando(!rastreando)}>
        {rastreando ? '⏹️ Dejar de rastrear' : '▶️ Rastrear mouse'}
      </button>

      {rastreando && (
        <div style={{
          border: '2px solid #007bff',
          borderRadius: 8,
          padding: 16,
          marginTop: 8,
          backgroundColor: '#f0f8ff',
        }}>
          <p>🖱️ Mouse: X = {posicion.x}, Y = {posicion.y}</p>
          <p style={{ fontSize: '0.85em', color: '#666' }}>
            Mové el mouse — la posición se actualiza en vivo
          </p>
        </div>
      )}

      <p>💡 Abrí la consola para ver cuándo se agrega/elimina el listener</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente Demo — todos los ejemplos
// -------------------------------------------------------------
function Demo() {
  return (
    <>
      <h1>🎯 useEffect — Efectos Secundarios</h1>
      <hr /><Cronometro />
      <hr /><CambiaTitulo />
      <hr /><FetchPokemon />
      <hr /><BuscadorPokemon />
      <hr /><MouseTracker />
    </>
  );
}

// =============================================================
const root = createRoot(document.getElementById('root'));
root.render(<Demo />);
