# Proyecto 10: useEffect

> **Concepto**: efectos secundarios, ciclo de vida, fetch, cleanup

---

## 📖 Nota Académica

### ¿Qué es un "efecto secundario"?

Hasta ahora, todo en React era **"puro"**: props/estado entran, JSX sale. Pero las aplicaciones reales necesitan hacer cosas que están **fuera de React**:

- Buscar datos en una API (fetch)
- Cambiar el título de la pestaña
- Iniciar un timer o intervalo
- Agregar event listeners al DOM
- Conectarse a un WebSocket
- Guardar datos en localStorage

Todo eso son **efectos secundarios** (side effects): código que afecta algo fuera del componente. Y para eso existe `useEffect`.

### useEffect

```js
useEffect(() => {
  // Código del efecto (se ejecuta DESPUÉS del render)
  return () => {
    // Cleanup (se ejecuta antes de desmontar o re-ejecutar)
  };
}, [dependencias]);
```

Tres partes:

| Parte | Qué es |
|-------|--------|
| **Función del efecto** | El código que queremos ejecutar (fetch, timer, etc.) |
| **Cleanup** | (Opcional) Lo que devolvemos con `return`. Se ejecuta al desmontar o antes de re-ejecutar. |
| **Array de dependencias** | Controla CUÁNDO se ejecuta el efecto |

### El array de dependencias

Este array es **la clave** para entender useEffect.

```js
// 1. SIN dependencias: se ejecuta en CADA render
// (CASI NUNCA se usa — loop infinito si actualiza estado)
useEffect(() => { /* ... */ });

// 2. Array VACÍO: se ejecuta UNA VEZ al montar
// (ideal para fetch inicial, suscripciones, etc.)
useEffect(() => { /* ... */ }, []);

// 3. Con VALORES: se ejecuta al montar y cuando esos valores cambian
// (ideal para buscar cada vez que cambia un input)
useEffect(() => { /* ... */ }, [busqueda, pagina]);
```

**Regla**: cada variable que usás dentro del efecto y que podría cambiar entre renders, debería estar en el array de dependencias. Si no, tenés un **stale closure** (el efecto usa un valor viejo).

### Ciclo de vida en componentes funcionales

Con useEffect podés replicar los ciclos de vida de los class components:

```js
// MONTAJE (mount) — se ejecuta UNA VEZ
useEffect(() => {
  console.log('Componente montado');
  return () => console.log('Componente desmontado');
}, []);

// ACTUALIZACIÓN (update) — se ejecuta cuando algo cambia
useEffect(() => {
  console.log('El valor cambió:', valor);
}, [valor]);

// DESMONTAJE (unmount) — el cleanup con [] se ejecuta al desmontar
```

**¿Qué hace React en cada etapa?**

1. **Render:** React ejecuta la función del componente, genera el JSX, lo pinta en pantalla
2. **Paint:** el navegador pinta los cambios en la pantalla
3. **useEffect:** ✨ DESPUÉS de todo eso, se ejecuta el efecto
4. **Cleanup:** ANTES de re-ejecutar o al desmontar

### Cleanup: por qué es importante

El cleanup evita:

- **Memory leaks:** timers que siguen corriendo, listeners que se acumulan
- **Race conditions:** respuestas de fetch que llegan en orden incorrecto
- **Actualizar estado de componentes desmontados**

```js
useEffect(() => {
  const intervalo = setInterval(() => { /* ... */ }, 1000);

  // SIN CLEANUP: el intervalo sigue corriendo aunque el
  // componente desaparezca. ❌ MEMORY LEAK

  return () => {
    clearInterval(intervalo); // ✅ limpiamos al desmontar
  };
}, []);

useEffect(() => {
  const controlador = new AbortController();

  fetch(url, { signal: controlador.signal });

  return () => {
    controlador.abort(); // ✅ cancelamos el fetch al desmontar
  };
}, []);
```

### Fetch y el patrón "ignore"

Cuando hacés fetch con dependencias que cambian rápido (un input de búsqueda), podés tener **race conditions**: la respuesta de una búsqueda anterior llega después de la actual y pisa el resultado correcto.

```js
useEffect(() => {
  let ignore = false;

  fetch(`/api/${busqueda}`)
    .then(res => res.json())
    .then(data => {
      // Solo actualizamos si esta respuesta sigue siendo relevante
      if (!ignore) setResultados(data);
    });

  return () => {
    ignore = true; // marcamos como obsoleta
  };
}, [busqueda]);
```

Combinado con `AbortController`, tenés cobertura total contra race conditions.

---

## 🛠️ Paso a Paso — Creá tu propio proyecto

### 1. Creá el proyecto

```bash
cd react_desde_0
npm create vite@latest 10-useEffect -- --template react
cd 10-useEffect
npm install
rm -rf src/App.jsx src/App.css src/index.css src/assets public
```

### 2. Escribí `src/main.jsx`

```jsx
import { createRoot } from 'react-dom/client';
import { useState, useEffect } from 'react';

// =============================================================
// ¿Qué es useEffect?
// =============================================================
// useEffect ejecuta código DESPUÉS de que el componente se
// renderiza y se pinta en pantalla.
//
// useEffect(() => {
//   // Código del efecto
//   return () => {
//     // Cleanup (al desmontar o antes de re-ejecutar)
//   };
// }, [dependencias]);
//
// []    → una vez al montar
// [x]   → al montar y cuando x cambia
// (nada) → en cada render (MUY RARO)
// =============================================================

// -------------------------------------------------------------
// Componente 1: Cronometro — useEffect con setInterval + cleanup
// -------------------------------------------------------------
function Cronometro() {
  const [segundos, setSegundos] = useState(0);
  const [activo, setActivo] = useState(false);

  useEffect(() => {
    if (!activo) return;

    const intervalo = setInterval(() => {
      setSegundos((s) => s + 1);
    }, 1000);

    return () => {
      clearInterval(intervalo);
    };
  }, [activo]);

  const resetear = () => { setSegundos(0); setActivo(false); };
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  const tiempo = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  return (
    <div>
      <h2>⏱️ Cronómetro</h2>
      <p style={{ fontSize: '3em', fontFamily: 'monospace' }}>{tiempo}</p>
      <button onClick={() => setActivo(!activo)}>
        {activo ? '⏸️ Pausar' : '▶️ Iniciar'}
      </button>
      <button onClick={resetear}>⏹️ Reset</button>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 2: CambiaTitulo — useEffect sin cleanup
// -------------------------------------------------------------
function CambiaTitulo() {
  const [texto, setTexto] = useState('');

  useEffect(() => {
    document.title = texto
      ? `🔔 ${texto} — React desde 0`
      : 'React desde 0 — Proyecto 10';
  }, [texto]);

  return (
    <div>
      <h2>📝 Cambiar título de la pestaña</h2>
      <input type="text" value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribí algo para verlo en el título..." />
      <p>👁️ Mirá el título de la pestaña</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: FetchPokemon — fetch con AbortController
// -------------------------------------------------------------
function FetchPokemon() {
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controlador = new AbortController();

    fetch('https://pokeapi.co/api/v2/pokemon/ditto',
      { signal: controlador.signal })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => setPokemon({
        nombre: d.name, id: d.id,
        peso: d.weight, altura: d.height,
        tipos: d.types.map(t => t.type.name),
        imagen: d.sprites.front_default,
      }))
      .catch(err => { if (err.name !== 'AbortError') setError(err.message); })
      .finally(() => setLoading(false));

    return () => controlador.abort();
  }, []);

  if (loading) return <div><h2>📡 Fetch</h2><p>⏳ Cargando...</p></div>;
  if (error) return <div><h2>📡 Fetch</h2><p>❌ {error}</p></div>;

  return (
    <div>
      <h2>📡 Fetch (PokéAPI)</h2>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <img src={pokemon.imagen} alt={pokemon.nombre}
          style={{ width: 96, height: 96 }} />
        <div>
          <p><strong>#{pokemon.id}</strong> — {pokemon.nombre.toUpperCase()}</p>
          <p>🏷️ {pokemon.tipos.join(', ')}</p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 4: BuscadorPokemon — useEffect con dependencia variable
// -------------------------------------------------------------
function BuscadorPokemon() {
  const [busqueda, setBusqueda] = useState('ditto');
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!busqueda.trim()) return;
    let ignore = false;
    const controlador = new AbortController();

    fetch(`https://pokeapi.co/api/v2/pokemon/${busqueda.toLowerCase().trim()}`,
      { signal: controlador.signal })
      .then(r => { if (!r.ok) throw new Error('No encontrado'); return r.json(); })
      .then(d => { if (!ignore) setPokemon({
        nombre: d.name, id: d.id,
        tipos: d.types.map(t => t.type.name),
        imagen: d.sprites.front_default,
      }); })
      .catch(err => { if (err.name !== 'AbortError' && !ignore) setError(err.message); })
      .finally(() => { if (!ignore) setLoading(false); });

    return () => { ignore = true; controlador.abort(); };
  }, [busqueda]);

  return (
    <div>
      <h2>🔍 Buscador</h2>
      <input type="text" value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        placeholder="pikachu, charizard..." />
      {loading && <p>⏳ Buscando...</p>}
      {error && <p style={{ color: 'red' }}>❌ {error}</p>}
      {pokemon && (
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          <img src={pokemon.imagen} alt={pokemon.nombre} style={{ width: 96 }} />
          <p><strong>#{pokemon.id}</strong> {pokemon.nombre.toUpperCase()} — {pokemon.tipos.join(', ')}</p>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 5: MouseTracker — useEffect con addEventListener
// -------------------------------------------------------------
function MouseTracker() {
  const [posicion, setPosicion] = useState({ x: 0, y: 0 });
  const [rastreando, setRastreando] = useState(false);

  useEffect(() => {
    if (!rastreando) return;

    const manejarMouse = (e) => {
      setPosicion({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', manejarMouse);

    return () => {
      window.removeEventListener('mousemove', manejarMouse);
    };
  }, [rastreando]);

  return (
    <div>
      <h2>🖱️ Mouse Tracker</h2>
      <button onClick={() => setRastreando(!rastreando)}>
        {rastreando ? '⏹️ Detener' : '▶️ Rastrear'}
      </button>
      {rastreando && <p>🖱️ X: {posicion.x}, Y: {posicion.y}</p>}
    </div>
  );
}

// -------------------------------------------------------------
function Demo() {
  return (
    <>
      <h1>🎯 useEffect</h1>
      <hr /><Cronometro />
      <hr /><CambiaTitulo />
      <hr /><FetchPokemon />
      <hr /><BuscadorPokemon />
      <hr /><MouseTracker />
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Demo />);
```

### 3. Iniciá el servidor

```bash
npm run dev
```

Abrí `http://localhost:5173`. Vas a ver:

- **Cronómetro:** setInterval con cleanup al pausar. Abrí la consola para ver los logs.
- **Cambia título:** cada letra cambia el título de la pestaña — efecto sin cleanup.
- **Fetch Pokémon:** carga un Pokémon desde la PokéAPI con AbortController.
- **Buscador:** buscá cualquier Pokémon — cada búsqueda cancela la anterior con "ignore" + AbortController.
- **Mouse Tracker:** event listener con cleanup perfecto.

### 4. Experimentá

1. En el **Cronómetro**, andá a otro componente y volvé — el intervalo no queda colgado gracias al cleanup
2. En **MouseTracker**, activá el rastreo, abrí la consola y verificá que no se acumulen listeners al activar/desactivar
3. En el **Buscador**, escribí rápido "pikachu" → borrá → "charizard" — si no tuviéramos AbortController, podría mostrarse el resultado incorrecto
4. **Sacá el cleanup** del cronómetro (comentá el `clearInterval`), pausá y reiniciá varias veces — fijate cuántos intervalos quedan corriendo

---

## 📄 Código Completo

### `package.json`

```json
{
  "name": "10-useEffect",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.2.7",
    "react-dom": "^19.2.7"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.2",
    "vite": "^8.1.0"
  }
}
```

---

## 🎯 Proyecto para hacer solo

Creá un proyecto NUEVO llamado `10-useEffect-practica`.

### Consigna

Construí una **aplicación de cotizaciones en vivo**. Simulá que obtenés el precio de varias criptomonedas que se actualiza cada 3 segundos.

**Requisitos técnicos:**

1. Usá `npm create vite@latest` para crear el proyecto.
2. Mostrá una lista de al menos 5 criptomonedas con su precio actual.
3. Usá `useEffect` con `setInterval` para simular la actualización de precios (cambiá los precios aleatoriamente cada 3 segundos).
4. Incluí un **botón de pausa/reanudar** que detenga y reanude el intervalo.
5. Mostrá un indicador visual de si los precios se están actualizando en vivo o están pausados.
6. Si una cripto sube de precio, mostralo en **verde**. Si baja, en **rojo**.
7. Incluí un **historial** de las últimas 10 cotizaciones de cada cripto (usá un array de objetos en el estado).

**Datos iniciales:**

```jsx
const criptos = [
  { id: 'bitcoin', nombre: 'Bitcoin', precio: 42000, cambio: 0 },
  { id: 'ethereum', nombre: 'Ethereum', precio: 2800, cambio: 0 },
  { id: 'solana', nombre: 'Solana', precio: 120, cambio: 0 },
  { id: 'cardano', nombre: 'Cardano', precio: 0.65, cambio: 0 },
  { id: 'polkadot', nombre: 'Polkadot', precio: 8.50, cambio: 0 },
];
```

**Extras (si querés ir más allá):**
- Usá `AbortController` para simular un fetch real (con un `setTimeout` que simule latencia de red)
- Mostrá un gráfico simple con barras que representen el cambio porcentual
- Agregá sonido cuando una cripto sube más de 5%
- Agregá la fecha/hora de la última actualización

---

## 🧠 Resumen

| Concepto | Explicación breve |
|----------|-------------------|
| **`useEffect`** | Ejecuta código después del render. Para efectos secundarios (fetch, timers, listeners, DOM). |
| **`[]` (vacío)** | El efecto se ejecuta UNA VEZ al montar. Cleanup al desmontar. |
| **`[dep]`** | El efecto se ejecuta al montar y cada vez que `dep` cambia. |
| **Cleanup** | `return () => { ... }`. Se ejecuta al desmontar O antes de re-ejecutar. Evita memory leaks. |
| **AbortController** | Cancela un fetch si el componente se desmonta o la dependencia cambia. |
| **Patrón "ignore"** | Flag booleano para ignorar respuestas de fetch obsoletas (race conditions). |
| **No dependencias** | `useEffect(fn)` sin array se ejecuta en CADA render. Casi nunca se usa. |

**En el próximo proyecto** vas a ver **`useRef`** — cómo acceder directamente al DOM y mantener valores que no causan re-render.
