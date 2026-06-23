# Proyecto 13: Custom Hooks

> **Concepto**: extraer lógica reusable en funciones que usan hooks

---

## 📖 Nota Académica

### ¿Qué es un custom hook?

Un **custom hook** es una función JavaScript que:

1. **Empieza con `use`** (convención: React se basa en esto para detectar errores)
2. **Usa otros hooks** adentro (`useState`, `useEffect`, `useRef`, etc.)
3. **Devuelve** lo que necesites (valores, funciones, objetos)
4. **NO renderiza JSX** — solo lógica reutilizable

```js
// Esto es un custom hook:
function useReloj() {
  const [hora, setHora] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(intervalo);
  }, []);

  return hora;
}

// Se usa así en cualquier componente:
function Reloj() {
  const hora = useReloj();
  return <p>{hora.toLocaleTimeString()}</p>;
}
```

### ¿Por qué custom hooks?

Sin custom hooks, la lógica con efectos secundarios queda **atrapada dentro de los componentes**. No podés reutilizarla.

**Sin custom hook** — repetís el mismo patrón en cada componente:

```jsx
function ComponenteA() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/algo')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);
  // ...
}

function ComponenteB() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/otra-cosa')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, []);
  // ...
}
```

**Con custom hook** — la lógica está en un solo lugar:

```jsx
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(url)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); });
  }, [url]);
  return { data, loading };
}

function ComponenteA() {
  const { data, loading } = useFetch('/api/algo');
}

function ComponenteB() {
  const { data, loading } = useFetch('/api/otra-cosa');
}
```

### Reglas de los hooks (también aplican a custom hooks)

1. **Solo se llaman en el nivel superior** de una función componente o de otro hook. No adentro de `if`, `for` o funciones anidadas.
2. **Solo se llaman desde componentes React o custom hooks.** No desde funciones JavaScript comunes.
3. **El nombre empieza con `use`.** No es obligatorio para React, pero es la convención. Sin `use`, los linters no pueden verificar las reglas 1 y 2.

### Composición de hooks

Los custom hooks pueden usar **otros custom hooks** internamente. Esto es composición de hooks:

```jsx
function useBuscadorPokemon() {
  const [busqueda, setBusqueda] = useState('');
  const debounced = useDebounce(busqueda, 300);
  const { data, loading, error } = useFetch(
    debounced ? `/api/pokemon/${debounced}` : null
  );
  return { busqueda, setBusqueda, data, loading, error };
}
```

`useBuscadorPokemon` usa `useState`, `useDebounce` y `useFetch`. Es hooks todo el camino.

### Los 4 hooks de este proyecto

| Hook | ¿Qué hace? | ¿Qué hooks usa internamente? |
|------|-----------|------------------------------|
| `useLocalStorage(key, initial)` | Como useState, pero persiste en localStorage | `useState`, `useEffect` |
| `useFetch(url)` | Fetch con loading/error | `useState`, `useEffect` + AbortController |
| `useDebounce(valor, delay)` | Retrasa la actualización de un valor | `useState`, `useEffect` + setTimeout |
| `useWindowSize()` | Tamaño actual de la ventana | `useState`, `useEffect` + addEventListener |

Cada uno resuelve un problema común y se puede reutilizar en cualquier proyecto.

---

## 🛠️ Paso a Paso — Creá tu propio proyecto

### 1. Creá el proyecto

```bash
cd react_desde_0
npm create vite@latest 13-custom-hooks -- --template react
cd 13-custom-hooks
npm install
rm -rf src/App.jsx src/App.css src/index.css src/assets public
mkdir src/hooks
```

### 2. Creá los hooks

**`src/hooks/useLocalStorage.js`:**

```js
import { useState, useEffect } from 'react';

export function useLocalStorage(key, valorInicial) {
  const [valor, setValor] = useState(() => {
    try {
      const guardado = localStorage.getItem(key);
      return guardado !== null ? JSON.parse(guardado) : valorInicial;
    } catch {
      return valorInicial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(valor));
    } catch {}
  }, [key, valor]);

  return [valor, setValor];
}
```

**`src/hooks/useFetch.js`:**

```js
import { useState, useEffect } from 'react';

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) { setLoading(false); return; }

    const controlador = new AbortController();
    let ignore = false;

    fetch(url, { signal: controlador.signal })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { if (!ignore) setData(d); })
      .catch(err => { if (err.name !== 'AbortError' && !ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; controlador.abort(); };
  }, [url]);

  return { data, loading, error };
}
```

**`src/hooks/useDebounce.js`:**

```js
import { useState, useEffect } from 'react';

export function useDebounce(valor, delay = 300) {
  const [debounced, setDebounced] = useState(valor);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(valor), delay);
    return () => clearTimeout(timer);
  }, [valor, delay]);

  return debounced;
}
```

**`src/hooks/useWindowSize.js`:**

```js
import { useState, useEffect } from 'react';

export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const manejarResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', manejarResize);
    return () => window.removeEventListener('resize', manejarResize);
  }, []);

  return size;
}
```

### 3. Escribí `src/main.jsx`

```jsx
import { createRoot } from 'react-dom/client';
import { useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { useFetch } from './hooks/useFetch.js';
import { useDebounce } from './hooks/useDebounce.js';
import { useWindowSize } from './hooks/useWindowSize.js';

function NotasLocalStorage() {
  const [notas, setNotas] = useLocalStorage('notas', []);
  const [texto, setTexto] = useState('');

  const agregar = () => {
    if (!texto.trim()) return;
    setNotas([...notas, { id: Date.now(), texto: texto.trim() }]);
    setTexto('');
  };

  return (
    <div>
      <h2>📝 Notas persistentes</h2>
      <p>Recargá la página — las notas persisten</p>
      <input value={texto} onChange={(e) => setTexto(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && agregar()} placeholder="Nueva nota..." />
      <button onClick={agregar}>Agregar</button>
      {notas.map(n => (
        <li key={n.id}>{n.texto}
          <button onClick={() => setNotas(notas.filter(x => x.id !== n.id))}>❌</button>
        </li>
      ))}
    </div>
  );
}

function PokemonCard({ nombre }) {
  const { data, loading, error } = useFetch(
    `https://pokeapi.co/api/v2/pokemon/${nombre}`
  );
  if (loading) return <p>⏳ Cargando...</p>;
  if (error) return <p style={{ color: 'red' }}>❌ {error}</p>;
  if (!data) return null;
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <img src={data.sprites.front_default} alt={data.name} style={{ width: 64 }} />
      <p><strong>#{data.id}</strong> {data.name} — {data.types.map(t => t.type.name).join(', ')}</p>
    </div>
  );
}

function BuscadorDebounced() {
  const [busqueda, setBusqueda] = useState('ditto');
  const debounced = useDebounce(busqueda, 500);
  const { data, loading, error } = useFetch(
    debounced ? `https://pokeapi.co/api/v2/pokemon/${debounced}` : null
  );

  return (
    <div>
      <h2>🔍 Búsqueda con debounce</h2>
      <input value={busqueda} onChange={(e) => setBusqueda(e.target.value)}
        placeholder="Buscá un Pokémon" style={{ width: '100%' }} />
      {loading && <p>⏳ Buscando...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      {data && <p>✅ {data.name} encontrado!</p>}
    </div>
  );
}

function VentanaInfo() {
  const { width, height } = useWindowSize();
  return (
    <div>
      <h2>📐 Tamaño de ventana</h2>
      <p>📏 {width}px x {height}px</p>
      <p>{width < 768 ? '📱 Móvil' : '🖥️ Escritorio'}</p>
    </div>
  );
}

function Demo() {
  return (
    <>
      <h1>🎯 Custom Hooks</h1>
      <hr /><NotasLocalStorage />
      <hr /><PokemonCard nombre="pikachu" />
      <PokemonCard nombre="charizard" />
      <hr /><BuscadorDebounced />
      <hr /><VentanaInfo />
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Demo />);
```

### 4. Iniciá el servidor

```bash
npm run dev
```

Abrí `http://localhost:5173`. Vas a ver:

- **Notas persistentes:** agregá notas, recargá — siguen ahí (useLocalStorage)
- **Pokémon cards:** 3 Pokémon cargados desde la PokéAPI (useFetch)
- **Buscador con debounce:** escribí y esperá 500ms — el fetch se hace solito (useDebounce + useFetch)
- **Tamaño de ventana:** redimensioná y los valores se actualizan (useWindowSize)

### 5. Experimentá

1. Abrí las DevTools → Application → Local Storage y mirá cómo se guardan las notas
2. Cambiá el delay de `useDebounce` de 500 a 2000 — escribí y notá la diferencia
3. Agregá un cuarto Pokémon a la lista
4. Creá tu propio hook: `useContador` que devuelva `{ valor, incrementar, decrementar, reset }` y usalo en un componente

---

## 📄 Estructura del proyecto

```
13-custom-hooks/
├── src/
│   ├── hooks/
│   │   ├── useLocalStorage.js
│   │   ├── useFetch.js
│   │   ├── useDebounce.js
│   │   └── useWindowSize.js
│   └── main.jsx
├── index.html
└── package.json
```

---

## 🎯 Proyecto para hacer solo

Creá un proyecto NUEVO llamado `13-custom-hooks-practica`.

### Consigna

Construí una **aplicación de tareas con temporizador** usando al menos 3 custom hooks propios.

**Hooks requeridos (crealos vos):**

1. **`useTemporizador(segundosIniciales)`** — debe devolver:
   - `segundos`: tiempo restante
   - `corriendo`: si está activo
   - `iniciar()`, `pausar()`, `resetear()`
   - Debe ejecutar una función `onCompletar` cuando llega a 0

2. **`useTareas()`** — debe devolver:
   - `tareas`: array de tareas
   - `agregarTarea(texto, tiempo)`: agrega tarea con tiempo estimado
   - `completarTarea(id)`: marca como completa
   - `eliminarTarea(id)`: elimina tarea
   - Debe persistir en localStorage

3. **`useSonido(url)`** — debe devolver:
   - `reproducir()`: reproduce un sonido (usá `new Audio()`)
   - Opcional: podés simularlo con console.log si no querés archivos de sonido

**App: Pomodoro de tareas**
- Mostrá una lista de tareas con tiempo estimado
- Seleccioná una tarea y apretá "Iniciar Pomodoro"
- El temporizador cuenta hacia atrás
- Cuando llega a 0, la tarea se marca como completa y suena una alerta
- Si cambiás de tarea, el temporizador se resetea

**Extras (si querés ir más allá):**
- Notificaciones del navegador con `Notification API`
- Estadísticas: cuántas tareas completaste hoy, tiempo total de enfoque
- Modo oscuro con `useLocalStorage`

---

## 🧠 Resumen

| Concepto | Explicación breve |
|----------|-------------------|
| **Custom hook** | Función que empieza con `use` y usa otros hooks. Solo lógica, sin JSX. |
| **Reutilización** | Extraé lógica repetitiva (fetch, localStorage, timers) a un hook y usalo en varios componentes. |
| **Composición** | Un hook puede usar otros hooks adentro (ej: useDebounce + useFetch). |
| **`useLocalStorage`** | Como useState, pero persiste en localStorage. |
| **`useFetch`** | Fetch con loading/error/AbortController encapsulado. |
| **`useDebounce`** | Retrasa un valor hasta que el usuario deja de escribirlo. |
| **`useWindowSize`** | Tamaño de ventana actualizado en vivo. |

**En el próximo proyecto** vas a ver **React Router**: navegación entre páginas en una SPA (Single Page Application).
