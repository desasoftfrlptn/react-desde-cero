/* ============================================================
   React desde 0 — Proyecto 13: Custom Hooks
   Concepto: extraer lógica reusable en funciones que usan hooks
   ============================================================
   Los custom hooks son funciones JavaScript que:
   1. Empiezan con "use"
   2. Usan otros hooks (useState, useEffect, etc.)
   3. Devuelven lo que necesites (valores, funciones, objetos)

   NO renderizan JSX. Son SOLO lógica reutilizable.
   ============================================================ */

import { createRoot } from 'react-dom/client';
import { useState } from 'react';

// Importamos nuestros custom hooks
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useFetch } from './hooks/useFetch.js';
import { useDebounce } from './hooks/useDebounce.js';
import { useWindowSize } from './hooks/useWindowSize.js';

// =============================================================
// Componente 1: NotasLocalStorage — usa useLocalStorage
// =============================================================
// Las notas se guardan en localStorage. Si recargás la página,
// siguen ahí. Sin escribir una línea de localStorage en este
// componente — todo está encapsulado en el hook.
function NotasLocalStorage() {
  const [notas, setNotas] = useLocalStorage('notas', []);
  const [texto, setTexto] = useState('');

  const agregarNota = () => {
    if (!texto.trim()) return;
    setNotas([...notas, { id: Date.now(), texto: texto.trim() }]);
    setTexto('');
  };

  return (
    <div>
      <h2>📝 Notas persistentes (useLocalStorage)</h2>
      <p>Recargá la página — las notas NO se pierden</p>

      <div>
        <input value={texto} onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && agregarNota()}
          placeholder="Nueva nota..." />
        <button onClick={agregarNota}>Agregar</button>
      </div>

      {notas.length === 0 ? (
        <p style={{ color: '#888' }}>📭 No hay notas todavía</p>
      ) : (
        <ul>
          {notas.map((n) => (
            <li key={n.id}>
              {n.texto}
              <button onClick={() => setNotas(notas.filter((x) => x.id !== n.id))}
                style={{ marginLeft: 8, fontSize: '0.8em' }}>❌</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 2: PokemonCard — usa useFetch
// -------------------------------------------------------------
// Sin useFetch, este componente tendría useState x3 +
// useEffect + AbortController + manejo de errores.
// Con useFetch, son 3 líneas.
function PokemonCard({ nombre }) {
  // El hook maneja todo: fetch, loading, error, AbortController
  const { data, loading, error } = useFetch(
    `https://pokeapi.co/api/v2/pokemon/${nombre}`
  );

  // Cada estado posible se maneja con renderizado condicional
  if (loading) return <p>⏳ Cargando {nombre}...</p>;
  if (error) return <p style={{ color: 'red' }}>❌ {error}</p>;
  if (!data) return null;

  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '8px 0' }}>
      <img src={data.sprites.front_default} alt={data.name}
        style={{ width: 64, height: 64 }} />
      <div>
        <strong>#{data.id}</strong> {data.name.toUpperCase()}
        <p style={{ margin: 0, fontSize: '0.85em' }}>
          {data.types.map((t) => t.type.name).join(', ')}
        </p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: BuscadorDebounced — usa useDebounce + useFetch
// -------------------------------------------------------------
// Combinamos DOS custom hooks: useDebounce retrasa la búsqueda
// y useFetch hace el fetch cuando el valor debounced cambia.
function BuscadorDebounced() {
  const [busqueda, setBusqueda] = useState('ditto');
  const debouncedBusqueda = useDebounce(busqueda, 500);

  // Solo hacemos fetch cuando debouncedBusqueda cambia
  // (500ms después de que el usuario deja de escribir)
  const { data, loading, error } = useFetch(
    debouncedBusqueda
      ? `https://pokeapi.co/api/v2/pokemon/${debouncedBusqueda}`
      : null
  );

  return (
    <div>
      <h2>🔍 Búsqueda con debounce (useDebounce + useFetch)</h2>
      <p>Escribí — el fetch se hace 500ms DESPUÉS de dejar de escribir</p>

      <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscá un Pokémon (ej: pikachu)"
        style={{ width: '100%', boxSizing: 'border-box' }} />

      <div style={{ marginTop: 8 }}>
        <p>📝 Buscando: <strong>{busqueda}</strong></p>
        <p>⏳ Debounced: <strong>{debouncedBusqueda}</strong></p>
      </div>

      {loading && <p>⏳ Buscando...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      {data && (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <img src={data.sprites.front_default} alt={data.name}
            style={{ width: 96, height: 96 }} />
          <div>
            <p><strong>#{data.id}</strong> — {data.name.toUpperCase()}</p>
            <p>🏷️ {data.types.map(t => t.type.name).join(', ')}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 4: VentanaInfo — usa useWindowSize
// -------------------------------------------------------------
function VentanaInfo() {
  const { width, height } = useWindowSize();

  const esMovil = width < 768;

  return (
    <div>
      <h2>📐 Tamaño de ventana (useWindowSize)</h2>
      <p>🔄 Redimensioná la ventana — los valores se actualizan solos</p>

      <div style={{
        background: esMovil ? '#fff3cd' : '#d4edda',
        padding: 16,
        borderRadius: 8,
        border: `2px solid ${esMovil ? '#ffc107' : '#28a745'}`,
      }}>
        <p>📏 Ancho: <strong>{width}px</strong></p>
        <p>📏 Alto: <strong>{height}px</strong></p>
        <p>📱 {esMovil ? 'Modo MÓVIL' : 'Modo ESCRITORIO'}</p>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 5: Demo — todos los ejemplos
// -------------------------------------------------------------
function Demo() {
  return (
    <>
      <h1>🎯 Custom Hooks</h1>
      <p>Cada componente importa hooks desde <code>src/hooks/</code></p>

      <hr /><NotasLocalStorage />
      <hr /><PokemonCard nombre="pikachu" />
      <PokemonCard nombre="charizard" />
      <PokemonCard nombre="mewtwo" />
      <hr /><BuscadorDebounced />
      <hr /><VentanaInfo />
    </>
  );
}

// =============================================================
const root = createRoot(document.getElementById('root'));
root.render(<Demo />);
