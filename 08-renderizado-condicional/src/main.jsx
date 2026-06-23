/* ============================================================
   React desde 0 — Proyecto 08: Renderizado Condicional
   Concepto: &&, ternario, early return, empty states
   ============================================================
   En React no podés usar `if` dentro del JSX. Pero tenés
   herramientas más poderosas: &&, ternarios, y la posibilidad
   de cortar el componente antes del return (early return).
   ============================================================ */

import { createRoot } from 'react-dom/client';
import { useState } from 'react';

// =============================================================
// Formas de renderizado condicional en React
// =============================================================
// JSX no acepta `if` porque es una sentencia, no expresión.
//
// Las herramientas que SÍ tenés:
//
// 1. && (AND lógico)  → "mostrá esto SOLO si se cumple X"
//    {condicion && <Elemento />}
//
// 2. ? : (ternario)   → "mostrá ESTO si se cumple, SINO mostrá aquello"
//    {condicion ? <A /> : <B />}
//
// 3. if/else fuera del JSX
//    let contenido;
//    if (condicion) { contenido = <A />; }
//    else { contenido = <B />; }
//    return <div>{contenido}</div>;
//
// 4. Early return
//    if (!tienePermiso) return <p>Acceso denegado</p>;
//    return <div>Contenido sensible</div>;
// =============================================================

// -------------------------------------------------------------
// Componente 1: Aprobado — AND (&&)
// -------------------------------------------------------------
// && es la forma más simple: "si esto es verdad, mostrá aquello"
//
//   {nota >= 6 && <p>Aprobaste 🎉</p>}
//
// Cómo funciona: JS evalúa NOTA && MENSAJE
//   - Si NOTA es falsy (0, null, false, undefined), JS lo devuelve
//     y React no renderiza nada (o renderiza el número 0, cuidado)
//   - Si NOTA es truthy, JS devuelve MENSAJE y React lo renderiza
//
// ⚠️ TRAMPA: {0 && <p>Hola</p>} renderiza "0" en la pantalla,
// porque 0 es un valor que React muestra. Usá condiciones booleanas:
//   ✅ {nota >= 6 && <p>Aprobaste</p>}  → nota >= 6 da true/false
//   ❌ {nota && <p>Hola</p>}            → si nota=0, renderiza "0"
function Aprobado() {
  const [nota, setNota] = useState(0);

  return (
    <div>
      <h2>🧪 AND (&&) — "mostrar si se cumple"</h2>

      <p>Nota: {nota}</p>
      <input
        type="range"
        min="0"
        max="10"
        value={nota}
        onChange={(e) => setNota(Number(e.target.value))}
      />

      {/* &&: solo se muestra si nota >= 6 */}
      {nota >= 6 && <p style={{ color: 'green' }}>✅ ¡Aprobaste!</p>}

      {/* Otro &&: solo se muestra si nota < 4 */}
      {nota < 4 && <p style={{ color: 'red' }}>❌ Desaprobado</p>}

      {/* Si nota está entre 4 y 5.99 (no entra en ninguno de los dos &&) */}
      {nota >= 4 && nota < 6 && (
        <p style={{ color: 'orange' }}>⚠️ Estás en recuperación</p>
      )}

      <p>💡 Mové el slider — el mensaje cambia solo con &&</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 2: ToggleTexto — ternario (? :)
// -------------------------------------------------------------
// El ternario es como un if/else en línea:
//
//   {condicion ? <SiSeCumple /> : <SiNoSeCumple />}
//
// Siempre da UN valor: o el de la izquierda o el de la derecha.
// No hay "tal vez no muestro nada" como en &&. O uno, o el otro.
function ToggleTexto() {
  const [mostrarAyuda, setMostrarAyuda] = useState(false);

  return (
    <div>
      <h2>🔀 Ternario (? :) — "elegir entre dos opciones"</h2>

      <button onClick={() => setMostrarAyuda(!mostrarAyuda)}>
        {mostrarAyuda ? 'Ocultar ayuda' : 'Mostrar ayuda'}
      </button>

      {/* El texto del botón también usa un ternario 😄 */}

      {mostrarAyuda ? (
        <div style={{ background: '#fff3cd', padding: 12, borderRadius: 8, marginTop: 8 }}>
          <p>📖 React utiliza un DOM virtual (VDOM) para actualizar
          solo las partes del HTML que cambiaron. Cuando el estado
          se actualiza, React compara el VDOM anterior con el nuevo
          y aplica los cambios mínimos al DOM real.</p>
        </div>
      ) : (
        <p>🤷‍♀️ Hacé click en "Mostrar ayuda" para ver la explicación</p>
      )}

      {/* El ternario SIEMPRE muestra algo: o el div o el p */}
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: PanelLogin — múltiples estados (loading, error, ok)
// -------------------------------------------------------------
// Acá combinamos varias condiciones para cubrir todos los
// estados posibles de un componente: loading, error, vacío, éxito.
function PanelLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [estado, setEstado] = useState('idle');
  // estado puede ser: 'idle' | 'loading' | 'error' | 'success'

  const manejarLogin = (e) => {
    e.preventDefault();

    // Validación: si falta algo, mostramos error sin llamar a nada
    if (!email || !password) {
      setEstado('error');
      return;
    }

    setEstado('loading');

    // Simulamos un login que tarda 1.5 segundos
    setTimeout(() => {
      if (email === 'admin@test.com' && password === '1234') {
        setEstado('success');
      } else {
        setEstado('error');
      }
    }, 1500);
  };

  const resetear = () => {
    setEstado('idle');
    setEmail('');
    setPassword('');
  };

  // ---------------- RENDERIZADO CONDICIONAL ----------------
  // Dependiendo del estado, MOSTRAMOS algo DISTINTO.
  // Esto se llama "manejo de estados" o "state machine".
  // ---------------------------------------------------------

  // Estado: SESIÓN INICIADA
  if (estado === 'success') {
    return (
      <div>
        <h2>✅ Sesión iniciada</h2>
        <p>Bienvenido, {email}!</p>
        <button onClick={resetear}>Cerrar sesión</button>
      </div>
    );
  }

  // Estado: IDLE (formulario visible) o ERROR (formulario + mensaje)
  return (
    <div>
      <h2>🔐 Panel de login (múltiples estados)</h2>

      <form onSubmit={manejarLogin}>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={estado === 'loading'}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={estado === 'loading'}
          />
        </div>
        <button type="submit" disabled={estado === 'loading'}>
          {estado === 'loading' ? '⏳ Ingresando...' : 'Ingresar'}
        </button>
      </form>

      {/* Estado ERROR: mensaje de error condicional */}
      {estado === 'error' && (
        <p style={{ color: 'red' }}>
          {email && password
            ? '❌ Credenciales inválidas. Probá admin@test.com / 1234'
            : '❌ Completá todos los campos'}
        </p>
      )}

      {/* Estado LOADING: spinner condicional */}
      {estado === 'loading' && (
        <p>⏳ Verificando credenciales...</p>
      )}

      <p><strong>Credenciales de prueba:</strong> admin@test.com / 1234</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 4: ListaUsuarios — estado vacío (empty state)
// -------------------------------------------------------------
// Un patrón MUY común: si el array está vacío, mostrar un
// mensaje en lugar de la lista.
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
      <h2>📋 Empty state — "qué mostrar si no hay datos"</h2>

      <div>
        <input
          type="text"
          placeholder="Nombre del usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && agregarUsuario()}
        />
        <button onClick={agregarUsuario}>Agregar</button>
      </div>

      {/* EMPTY STATE: si no hay usuarios, mostramos un mensaje.
           En lugar de una <ul> vacía o nada. */}
      {usuarios.length === 0 ? (
        <div style={{
          border: '2px dashed #ccc',
          padding: 20,
          textAlign: 'center',
          borderRadius: 8,
          color: '#666',
          marginTop: 12,
        }}>
          <p>📭 No hay usuarios todavía</p>
          <p>Agregá uno arriba ☝️</p>
        </div>
      ) : (
        <ul>
          {usuarios.map((u) => (
            <li key={u.id}>{u.nombre}</li>
          ))}
        </ul>
      )}

      <p>Total: {usuarios.length} usuario{usuarios.length !== 1 ? 's' : ''}</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 5: Dashboard — early return
// -------------------------------------------------------------
// El early return corta el componente ANTES de renderizar todo.
// Es como un guardia: "si no se cumple X, mostrá Y y salí".
//
// Esto evita anidar condiciones. Es más limpio que tener
// if/else gigantes adentro del JSX.
function Dashboard() {
  const [rol, setRol] = useState('invitado');
  // rol: 'invitado' | 'usuario' | 'admin'

  // ⛔ GUARDIA 1: si es invitado, mostramos poco
  if (rol === 'invitado') {
    return (
      <div>
        <h2>🛡️ Early return — "cortar antes si no corresponde"</h2>
        <p>👋 Bienvenido, invitado.</p>
        <p>Iniciá sesión para ver el dashboard.</p>
        <button onClick={() => setRol('usuario')}>
          Iniciar sesión como usuario
        </button>
      </div>
    );
  }

  // ⛔ GUARDIA 2: si es usuario común, no ve opciones de admin
  if (rol === 'usuario') {
    return (
      <div>
        <h2>🛡️ Early return — "cortar antes si no corresponde"</h2>
        <p>👋 Bienvenido, usuario!</p>
        <ul>
          <li>📊 Ver reportes</li>
          <li>📝 Editar perfil</li>
          <li>📧 Mensajes</li>
        </ul>
        <button onClick={() => setRol('invitado')}>Cerrar sesión</button>
        <button onClick={() => setRol('admin')}>Ser admin</button>
      </div>
    );
  }

  // Solo los admin llegan acá
  return (
    <div>
      <h2>🛡️ Early return — "cortar antes si no corresponde"</h2>
      <p>👋 Bienvenido, <strong>Administrador</strong>!</p>
      <ul>
        <li>📊 Ver reportes</li>
        <li>📝 Editar perfil</li>
        <li>📧 Mensajes</li>
        <li>⚙️ Configuración del sistema</li>
        <li>👥 Administrar usuarios</li>
        <li>🗑️ Borrar base de datos (con cuidado!)</li>
      </ul>
      <button onClick={() => setRol('usuario')}>Degradar a usuario</button>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 6: Demo — todos los ejemplos
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

// =============================================================
const root = createRoot(document.getElementById('root'));
root.render(<Demo />);
