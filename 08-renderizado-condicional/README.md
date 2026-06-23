# Proyecto 08: Renderizado Condicional

> **Concepto**: `&&`, ternario, `early return`, empty states

---

## 📖 Nota Académica

### El problema: no podés usar `if` dentro de JSX

JSX solo acepta **expresiones** (código que produce un valor). `if`, `else`, `switch` son **sentencias** (ejecutan acciones pero no producen un valor).

```jsx
// ❌ Esto NO funciona:
return (
  <div>
    {if (algo) { return <p>Hola</p> }}
  </div>
);
```

Tenés 4 formas de hacer renderizado condicional en React:

| Forma | Para qué sirve |
|-------|----------------|
| `&&` | "Mostrar SOLO si se cumple X" |
| `? :` (ternario) | "Mostrar ESTO si se cumple, SINO mostrar aquello" |
| `if/else` fuera del JSX | Cuando la lógica es compleja |
| `Early return` | Cortar el componente antes si no corresponde |

### 1. AND `&&` — "mostrar si se cumple"

```jsx
{condicion && <Elemento />}
```

**Cómo funciona:** JavaScript evalúa `condicion && elemento`:
- Si `condicion` es **falsy** (`false`, `0`, `""`, `null`, `undefined`), JS devuelve ese valor
- Si `condicion` es **truthy**, JS devuelve el `elemento`

```jsx
function Aprobado({ nota }) {
  return (
    <div>
      <p>Nota: {nota}</p>
      {nota >= 6 && <p style={{ color: 'green' }}>✅ Aprobaste</p>}
    </div>
  );
}
```

**⚠️ TRAMPA con el número 0:**
```jsx
// ❌ MAL: si items = [], items.length es 0, renderiza "0"
{items.length && <Lista items={items} />}

// ✅ BIEN: convertir a booleano
{items.length > 0 && <Lista items={items} />}
```

React renderiza el número `0` si es el resultado de la expresión. Siempre usá condiciones **booleanas**.

### 2. Ternario `? :` — "elegir entre dos opciones"

```jsx
{condicion ? <SiSeCumple /> : <SiNoSeCumple />}
```

El ternario **siempre produce un valor**: o el de la izquierda o el de la derecha. No hay "tal vez no muestro nada".

```jsx
function Toggle({ activo }) {
  return (
    <div>
      <p>Estado: {activo ? '🟢 Activo' : '🔴 Inactivo'}</p>
      {activo ? <Panel /> : <MensajeInactivo />}
    </div>
  );
}
```

El ternario funciona para el texto de los botones también:

```jsx
<button onClick={handleClick}>
  {mostrar ? 'Ocultar' : 'Mostrar'}
</button>
```

### 3. Ternario vs AND — ¿cuándo usar cada uno?

| Situación | Usá |
|-----------|-----|
| "Mostrar X **solo si** se cumple, **sino nada**" | `&&` |
| "Mostrar X **si** se cumple, **sino** mostrar Y" | `? :` |
| "Mostrar una de **tres o más** opciones" | `if/else` fuera del JSX |
| "Validar permisos/estado **antes** de renderizar" | `Early return` |

### 4. Múltiples condiciones con `if/else` fuera del JSX

Para lógica más compleja, sacá el `if` del JSX:

```jsx
function Mensaje({ nota }) {
  // Variable que vamos a asignar según la condición
  let mensaje;

  if (nota >= 6) {
    mensaje = <p style={{ color: 'green' }}>✅ Aprobaste</p>;
  } else if (nota >= 4) {
    mensaje = <p style={{ color: 'orange' }}>⚠️ Recuperación</p>;
  } else {
    mensaje = <p style={{ color: 'red' }}>❌ Desaprobado</p>;
  }

  return (
    <div>
      <h2>Resultado</h2>
      {mensaje}
    </div>
  );
}
```

Esto es más legible que un ternario gigante.

### 5. Early return — "cortar antes"

El early return corta la ejecución del componente antes de llegar al JSX principal. Es ideal para **validaciones** o **guardias**:

```jsx
function Dashboard({ usuario }) {
  // ⛔ Guardia 1: si no hay usuario, mostrá otra cosa y salí
  if (!usuario) {
    return <p>Iniciá sesión para ver el dashboard</p>;
  }

  // ⛔ Guardia 2: si es usuario común, no ve opciones de admin
  if (usuario.rol !== 'admin') {
    return (
      <div>
        <h2>Dashboard</h2>
        <p>Bienvenido, {usuario.nombre}</p>
        {/* Solo opciones de usuario común */}
      </div>
    );
  }

  // Solo los admin llegan acá
  return (
    <div>
      <h2>Dashboard Administrador</h2>
      {/* Opciones de admin */}
      <button>Borrar base de datos</button>
    </div>
  );
}
```

**Ventaja:** evita anidar condiciones. El código se lee de arriba a abajo, descartando casos en cada `return`.

### 6. Empty state — "qué mostrar si no hay datos"

Un patrón esencial: nunca asumas que los datos van a llegar. Tené un plan para **cada estado posible**:

```jsx
function ListaUsuarios({ usuarios }) {
  return (
    <div>
      {usuarios.length === 0 ? (
        // EMPTY STATE: diseño dedicado
        <div style={{ border: '2px dashed #ccc', padding: 20 }}>
          <p>📭 No hay usuarios</p>
          <p>Agregá el primero!</p>
        </div>
      ) : (
        <ul>
          {usuarios.map(u => <li key={u.id}>{u.nombre}</li>)}
        </ul>
      )}
    </div>
  );
}
```

Los estados que todo componente debería manejar:
- **Loading** — mientras se cargan los datos
- **Empty** — los datos llegaron, pero no hay nada
- **Error** — algo salió mal
- **Success** — todo bien, acá están los datos

---

## 🛠️ Paso a Paso — Creá tu propio proyecto

### 1. Creá el proyecto

```bash
cd react_desde_0
npm create vite@latest 08-renderizado-condicional -- --template react
cd 08-renderizado-condicional
npm install
rm -rf src/App.jsx src/App.css src/index.css src/assets public
```

### 2. Escribí `src/main.jsx`

```jsx
import { createRoot } from 'react-dom/client';
import { useState } from 'react';

// =============================================================
// Formas de renderizado condicional en React
// =============================================================
// 1. && (AND)    → "mostrá esto SOLO si se cumple X"
// 2. ? : (ternario) → "mostrá ESTO si se cumple, SINO aquello"
// 3. if/else fuera del JSX → para lógica compleja
// 4. Early return → cortar el componente antes si no corresponde
// =============================================================

// -------------------------------------------------------------
// Componente 1: Aprobado — AND (&&)
// -------------------------------------------------------------
function Aprobado() {
  const [nota, setNota] = useState(0);

  return (
    <div>
      <h2>🧪 AND (&&)</h2>
      <p>Nota: {nota}</p>
      <input type="range" min="0" max="10" value={nota}
        onChange={(e) => setNota(Number(e.target.value))} />

      {nota >= 6 && <p style={{ color: 'green' }}>✅ ¡Aprobaste!</p>}
      {nota < 4 && <p style={{ color: 'red' }}>❌ Desaprobado</p>}
      {nota >= 4 && nota < 6 && (
        <p style={{ color: 'orange' }}>⚠️ Recuperación</p>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 2: ToggleTexto — ternario (? :)
// -------------------------------------------------------------
function ToggleTexto() {
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  return (
    <div>
      <h2>🔀 Ternario (? :)</h2>
      <button onClick={() => setMostrarAyuda(!mostrarAyuda)}>
        {mostrarAyuda ? 'Ocultar ayuda' : 'Mostrar ayuda'}
      </button>
      {mostrarAyuda ? (
        <div style={{ background: '#fff3cd', padding: 12, borderRadius: 8, marginTop: 8 }}>
          React utiliza un DOM virtual para actualizar solo
          las partes del HTML que cambiaron.
        </div>
      ) : (
        <p>Hacé click en "Mostrar ayuda"</p>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: PanelLogin — múltiples estados
// -------------------------------------------------------------
function PanelLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [estado, setEstado] = useState('idle');
  // 'idle' | 'loading' | 'error' | 'success'

  const manejarLogin = (e) => {
    e.preventDefault();
    if (!email || !password) { setEstado('error'); return; }
    setEstado('loading');
    setTimeout(() => {
      if (email === 'admin@test.com' && password === '1234') {
        setEstado('success');
      } else {
        setEstado('error');
      }
    }, 1500);
  };

  if (estado === 'success') {
    return (
      <div>
        <h2>✅ Sesión iniciada</h2>
        <p>Bienvenido, {email}!</p>
        <button onClick={() => { setEstado('idle'); setEmail(''); setPassword(''); }}>
          Cerrar sesión
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>🔐 Panel de login</h2>
      <form onSubmit={manejarLogin}>
        <input type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={estado === 'loading'} />
        <input type="password" placeholder="Contraseña" value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={estado === 'loading'} />
        <button type="submit" disabled={estado === 'loading'}>
          {estado === 'loading' ? '⏳ Ingresando...' : 'Ingresar'}
        </button>
      </form>
      {estado === 'error' && (
        <p style={{ color: 'red' }}>
          {email && password
            ? '❌ Credenciales inválidas'
            : '❌ Completá todos los campos'}
        </p>
      )}
      {estado === 'loading' && <p>⏳ Verificando...</p>}
      <p><strong>Test:</strong> admin@test.com / 1234</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 4: ListaUsuarios — empty state
// -------------------------------------------------------------
function ListaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [nombre, setNombre] = useState('');

  const agregarUsuario = () => {
    if (!nombre.trim()) return;
    setUsuarios([...usuarios, { id: Date.now(), nombre: nombre.trim() }]);
    setNombre('');
  };

  return (
    <div>
      <h2>📋 Empty state</h2>
      <div>
        <input type="text" placeholder="Nombre" value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && agregarUsuario()} />
        <button onClick={agregarUsuario}>Agregar</button>
      </div>
      {usuarios.length === 0 ? (
        <div style={{ border: '2px dashed #ccc', padding: 20, textAlign: 'center', borderRadius: 8, color: '#666', marginTop: 12 }}>
          <p>📭 No hay usuarios todavía</p>
          <p>Agregá uno arriba ☝️</p>
        </div>
      ) : (
        <ul>{usuarios.map((u) => <li key={u.id}>{u.nombre}</li>)}</ul>
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 5: Dashboard — early return
// -------------------------------------------------------------
function Dashboard() {
  const [rol, setRol] = useState('invitado');
  // 'invitado' | 'usuario' | 'admin'

  if (rol === 'invitado') {
    return (
      <div>
        <h2>🛡️ Early return</h2>
        <p>👋 Bienvenido, invitado. Iniciá sesión.</p>
        <button onClick={() => setRol('usuario')}>Iniciar sesión</button>
      </div>
    );
  }

  if (rol === 'usuario') {
    return (
      <div>
        <p>👋 Bienvenido, usuario!</p>
        <ul>
          <li>📊 Ver reportes</li>
          <li>📝 Editar perfil</li>
        </ul>
        <button onClick={() => setRol('invitado')}>Cerrar sesión</button>
        <button onClick={() => setRol('admin')}>Ser admin</button>
      </div>
    );
  }

  return (
    <div>
      <p>👋 Bienvenido, <strong>Administrador</strong>!</p>
      <ul>
        <li>📊 Ver reportes</li>
        <li>📝 Editar perfil</li>
        <li>⚙️ Configuración del sistema</li>
        <li>👥 Administrar usuarios</li>
      </ul>
      <button onClick={() => setRol('usuario')}>Degradar a usuario</button>
    </div>
  );
}

// -------------------------------------------------------------
function Demo() {
  return (
    <>
      <h1>🎯 Renderizado Condicional</h1>
      <hr /><Aprobado />
      <hr /><ToggleTexto />
      <hr /><PanelLogin />
      <hr /><ListaUsuarios />
      <hr /><Dashboard />
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

- **Aprobado:** slider que muestra diferentes mensajes solo con `&&`
- **ToggleTexto:** botón que alterna entre ayuda y "no hay ayuda" con ternario
- **PanelLogin:** login con 4 estados (idle, loading, error, success)
- **ListaUsuarios:** estado vacío con diseño dedicado cuando no hay usuarios
- **Dashboard:** 3 roles diferentes con early return

### 4. Experimentá

1. En `Aprobado`, cambiá `nota >= 6` por `nota` (sin comparación) — fijate qué pasa cuando la nota es 0
2. En `ToggleTexto`, sacá la parte `: <p>...</p>` del ternario — ¿qué pasa?
3. En `PanelLogin`, poné `email === 'admin'` sin el `@test.com` — probá y después fijate que nunca entra
4. En `ListaUsuarios`, reemplazá el ternario por `&&` en la lista — ¿qué pasa cuando hay 0 usuarios?
5. En `Dashboard`, sacá el primer `return` y usá un solo `return` con ternarios — compará la legibilidad

---

## 📄 Código Completo

### `package.json`

```json
{
  "name": "08-renderizado-condicional",
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

Creá un proyecto NUEVO llamado `08-renderizado-condicional-practica`.

### Consigna

Construí un **simulador de clima**. El usuario ingresa una ciudad y ve el clima actual (simulado). Hay que manejar todos los estados posibles.

**Requisitos técnicos:**

1. Usá `npm create vite@latest` para crear el proyecto
2. El usuario escribe el nombre de una ciudad y hace click en "Buscar"
3. Manejá estos estados:
   - **Idle:** sin búsqueda todavía, mostrá un mensaje inicial
   - **Loading:** mientras "buscamos" (simulalo con `setTimeout`)
   - **Success:** datos del clima (temperatura, humedad, descripción)
   - **Error:** la ciudad no existe (simulá que algunas ciudades "no existen")
   - **Empty:** el usuario no escribió nada y apretó buscar
4. Usá al menos **tres técnicas distintas** de renderizado condicional (`&&`, ternario, y early return o if/else)

**Datos simulados:**

```jsx
const ciudades = {
  'buenos aires': { temp: 28, humedad: 65, desc: 'Soleado' },
  'cordoba': { temp: 24, humedad: 70, desc: 'Nublado' },
  'mendoza': { temp: 32, humedad: 30, desc: 'Despejado' },
  'bariloche': { temp: 8, humedad: 80, desc: 'Lluvioso' },
  'ushuaia': { temp: 2, humedad: 85, desc: 'Nieve' },
};
```

**Estructura sugerida:**

```jsx
function Clima() {
  const [ciudad, setCiudad] = useState('');
  const [resultado, setResultado] = useState(null);
  const [estado, setEstado] = useState('idle');
  // 'idle' | 'loading' | 'success' | 'error'

  const buscarClima = () => {
    if (!ciudad.trim()) {
      // Mostrar error de campo vacío
      return;
    }

    setEstado('loading');

    setTimeout(() => {
      const datos = ciudades[ciudad.toLowerCase().trim()];
      if (datos) {
        setResultado({ nombre: ciudad, ...datos });
        setEstado('success');
      } else {
        setEstado('error');
      }
    }, 1500);
  };

  // ... render condicional acá
}
```

**Extras (si querés ir más allá):**
- Mostrá un icono distinto según el clima (☀️ 🌤 ☁️ 🌧 ❄️)
- Agregá un historial de búsquedas (en un array en el estado)
- Permití borrar el historial
- Animá la transición entre estados con CSS

---

## 🧠 Resumen

| Concepto | Explicación breve |
|----------|-------------------|
| **`&&`** | "Mostrar SOLO si se cumple". Cuidado con el 0 (React lo renderiza). |
| **`? :` (ternario)** | "O esto O aquello". Siempre produce un valor. |
| **`if/else` fuera del JSX** | Para lógica condicional compleja. Asignás a una variable y la usás en el JSX. |
| **Early return** | Cortar el componente con `return <OtroJSX />` si no corresponde seguir. |
| **Empty state** | Qué mostrar cuando no hay datos (array vacío, sin resultados, etc.) |
| **Loading state** | Qué mostrar mientras se cargan los datos. |
| **Error state** | Qué mostrar si algo salió mal. |

**En el próximo proyecto** vas a ver **formularios** a fondo: controlled components, validación, y manejo de múltiples campos.
