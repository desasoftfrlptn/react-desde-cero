# Proyecto 04: Props

> **Concepto**: props, `children`, valores por defecto

---

## 📖 Nota Académica

### ¿Qué son las props?

Las props (de "properties") son la forma en que React pasa datos de un componente padre a un componente hijo.

Pensalo así: los componentes son funciones, y las props son sus parámetros.

```jsx
// Sin props — el componente siempre muestra lo mismo
function Saludo() {
  return <h1>¡Hola, Martina!</h1>;
}

// Con props — el mismo componente muestra lo que le pasen
function Saludo(props) {
  return <h1>¡Hola, {props.nombre}!</h1>;
}

// Uso:
<Saludo nombre="Martina" />   // → ¡Hola, Martina!
<Saludo nombre="Carlos" />    // → ¡Hola, Carlos!
```

**Un componente, infinitas variaciones.** Ese es el poder de las props.

### ¿Cómo funcionan?

Las props se pasan como **atributos HTML** en el JSX, pero se reciben como un **objeto JavaScript**:

```jsx
// El código JSX:
<Usuario nombre="Martina" edad={25} activo={true} />

// Es equivalente a llamar a:
Usuario({ nombre: "Martina", edad: 25, activo: true });

// Y adentro del componente:
function Usuario(props) {
  console.log(props); // { nombre: "Martina", edad: 25, activo: true }
  console.log(props.nombre); // "Martina"
}
```

### Reglas de las props

| Regla | Explicación |
|-------|-------------|
| **Flujo unidireccional** | Las props van de padre a hijo. Nunca al revés. |
| **Solo lectura** | Un componente NUNCA modifica sus propias props. Son inmutables. |
| **Cualquier valor JS** | Strings, números, booleanos, arrays, objetos, funciones, incluso otros componentes. |
| **String con `""`** | Los valores string se pasan con comillas: `nombre="Martina"` |
| **Otros valores con `{}`** | Números, booleanos, variables, expresiones van con llaves: `edad={25}`, `activo={true}` |

### Destructuring de props

En lugar de escribir `props.nombre`, `props.edad`, `props.activo` una y otra vez, podemos **destructurar** el objeto props:

```jsx
// Sin destructuring (funciona, pero repetitivo)
function Usuario(props) {
  return (
    <div>
      <h2>{props.nombre}</h2>
      <p>{props.edad} años</p>
    </div>
  );
}

// Con destructuring (limpio, directo)
function Usuario({ nombre, edad }) {
  return (
    <div>
      <h2>{nombre}</h2>
      <p>{edad} años</p>
    </div>
  );
}
```

El destructuring es **JavaScript puro** (no es algo de React):

```js
const persona = { nombre: 'Martina', edad: 25 };
const { nombre, edad } = persona;
console.log(nombre); // 'Martina'
console.log(edad);   // 25
```

### Valores por defecto

Si una prop no se pasa, su valor es `undefined`. Para evitar que se muestre "undefined" en la pantalla, podemos usar **valores por defecto** al destructurar:

```jsx
function Tarjeta({ titulo = 'Sin título', contenido = 'Sin contenido' }) {
  return (
    <div>
      <h3>{titulo}</h3>
      <p>{contenido}</p>
    </div>
  );
}

// Sin props → usa valores por defecto
<Tarjeta />  // muestra "Sin título" y "Sin contenido"

// Con props → usa los valores pasados
<Tarjeta titulo="Hola" contenido="Mundo" />
```

Esto también es **JavaScript puro** (ES6 default parameters).

### `children`: el prop invisible

`children` es un prop **especial** que no se pasa como atributo. Contiene **todo lo que va entre la apertura y cierre** del componente:

```jsx
<Caja>
  <p>Este contenido es children</p>
</Caja>

// Adentro de Caja:
function Caja({ children }) {
  return <div>{children}</div>;
}
```

Esto es la base de la **composición** en React: componentes que envuelven a otros componentes. Es como los `<div>` de HTML, pero con el comportamiento que vos definas.

### Lo que NO son las props

Las props NO son estado. Las props vienen de afuera, el estado es interno. Las props no cambian (son de solo lectura), el estado sí puede cambiar. Eso lo vamos a ver en el proyecto 05.

---

## 🛠️ Paso a Paso — Creá tu propio proyecto

**NOVEDAD**: a partir de este proyecto, vamos a usar el **scaffolding de Vite** para crear el proyecto, en lugar de escribir `package.json` a mano. Vite tiene un comando que genera todo el boilerplate automáticamente.

### 1. Creá el proyecto con Vite

```bash
# Te parás en la carpeta raíz del curso
cd react_desde_0

# Vite te crea toda la estructura del proyecto
npm create vite@latest 04-props -- --template react
```

**¿Qué hace este comando?**
1. Descarga `create-vite` (una herramienta que genera proyectos Vite)
2. Crea la carpeta `04-props/`
3. Usa el template `react` (configura React con Vite automáticamente)
4. Genera: `package.json`, `index.html`, `vite.config.js`, `src/`, `public/`

**¿Qué es cada cosa que generó Vite?**
- `package.json` — dependencias (react, react-dom, vite, @vitejs/plugin-react)
- `vite.config.js` — configuración de Vite con el plugin de React
- `index.html` — HTML de entrada con `<div id="root">` y el `<script>` a `main.jsx`
- `src/main.jsx` — punto de entrada (viene con un ejemplo de contador)
- `src/App.jsx` — componente de ejemplo (NO lo necesitamos, lo vamos a borrar)
- `src/App.css`, `src/index.css` — estilos de ejemplo (los vamos a borrar)
- `public/` — archivos estáticos (favicon, etc. — los vamos a borrar)

**Vite también agrega cosas que no necesitamos para este curso:**
- `@types/react` y `@types/react-dom` — solo sirven para TypeScript
- `oxlint` — un linter de JavaScript (no lo necesitamos acá)

No pasa nada, las podemos borrar. Lo importante es que Vite nos ahorró escribir `package.json` y configurar Vite desde cero.

### 2. Entrá al proyecto

```bash
cd 04-props
```

### 3. Instalá las dependencias

```bash
npm install
```

Esto descarga React, ReactDOM y Vite dentro de `node_modules/`.

### 4. Limpiá el boilerplate (opcional, pero recomendado)

Vite genera archivos de ejemplo que no necesitamos. Borralos para mantener el proyecto limpio:

```bash
rm -rf src/App.jsx src/App.css src/index.css src/assets public
```

No te preocupes, todo esto es código de demostración que Vite incluye para mostrarte que funciona. Nosotros vamos a escribir nuestro propio código desde cero.

**¿Por qué hacemos esto?** Porque queremos entender **exactamente** qué estamos escribiendo, no tener un montón de código que vino "de regalo" y no entendemos cómo funciona. Recordá: un concepto por proyecto, sin mezclar nada.

### 5. Escribí `src/main.jsx`

Creá el archivo `src/main.jsx` con el siguiente contenido. **Leé los comentarios** — hay uno nuevo adentro que explica cada parte:

```jsx
import { createRoot } from 'react-dom/client';

// =============================================================
// ¿Qué son las props?
// =============================================================
// Props = "properties" = propiedades.
// Son los ARGUMENTOS de una función componente.
//
// Así como una función recibe parámetros:
//   function suma(a, b) { return a + b; }
//   suma(2, 3)
//
// Un componente recibe props:
//   function Saludo(props) { return <h1>{props.nombre}</h1>; }
//   <Saludo nombre="Martina" />
//
// Las props se pasan como ATRIBUTOS en JSX y llegan todas
// juntas dentro de un solo objeto: el parámetro `props`.
// =============================================================

// -------------------------------------------------------------
// Componente 1: Saludo — props básicas
// -------------------------------------------------------------
function Saludo(props) {
  return <h1>¡Hola, {props.nombre}!</h1>;
}

// -------------------------------------------------------------
// Componente 2: Usuario — múltiples props
// -------------------------------------------------------------
function Usuario(props) {
  return (
    <div>
      <h2>{props.nombre}</h2>
      <p>Edad: {props.edad} años</p>
      <p>Estado: {props.activo ? '🟢 Activo' : '🔴 Inactivo'}</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 3: Producto — destructuring de props
// -------------------------------------------------------------
function Producto({ nombre, precio, disponible }) {
  return (
    <div>
      <h3>{nombre}</h3>
      <p>Precio: ${precio}</p>
      <p>{disponible ? '✅ En stock' : '❌ Agotado'}</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 4: Tarjeta — valores por defecto en props
// -------------------------------------------------------------
function Tarjeta({ titulo = 'Sin título', contenido = 'Sin contenido' }) {
  return (
    <div>
      <h3>{titulo}</h3>
      <p>{contenido}</p>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 5: Caja — children (el prop invisible)
// -------------------------------------------------------------
function Caja({ children, etiqueta = 'Info' }) {
  return (
    <div>
      <span>[{etiqueta}]</span>
      <div>{children}</div>
    </div>
  );
}

// -------------------------------------------------------------
// Componente 6: Pagina — composición con props
// -------------------------------------------------------------
function Pagina() {
  return (
    <>
      <h1>🎓 Props en React</h1>

      {/* Props básicas */}
      <Saludo nombre="Martina" />
      <Saludo nombre="Carlos" />

      <hr />

      {/* Múltiples props */}
      <Usuario nombre="Martina" edad={25} activo={true} />
      <Usuario nombre="Carlos" edad={30} activo={false} />

      <hr />

      {/* Destructuring */}
      <Producto nombre="Mate" precio={2500} disponible={true} />
      <Producto nombre="Termo" precio={8500} disponible={false} />

      <hr />

      {/* Valores por defecto */}
      <Tarjeta titulo="Nota importante" contenido="Esto es importante" />
      <Tarjeta />
      {/* La segunda Tarjeta no recibe props → usa valores default */}

      <hr />

      {/* children */}
      <Caja etiqueta="Consejo">
        <p>Las props fluyen de padre a hijo, nunca al revés.</p>
      </Caja>

      <Caja>
        <ul>
          <li>Las props son de solo lectura</li>
          <li>No se modifican dentro del componente</li>
          <li>El padre pasa datos, el hijo los muestra</li>
        </ul>
      </Caja>
    </>
  );
}

// =============================================================
// Renderizado
// =============================================================
const root = createRoot(document.getElementById('root'));
root.render(<Pagina />);
```

### 6. Iniciá el servidor de desarrollo

```bash
npm run dev
```

Abrí `http://localhost:5173` en tu navegador. Vas a ver:

- Dos saludos: "¡Hola, Martina!" y "¡Hola, Carlos!"
- Dos usuarios con nombre, edad y estado
- Dos productos con nombre, precio y disponibilidad
- Dos tarjetas (una con datos, otra con valores por defecto)
- Dos cajas con contenido distinto (usando `children`)

### 7. Modificá y experimentá

Probá estas modificaciones para entender cómo funcionan las props:

1. **Agregá más `<Saludo>`** con distintos nombres
2. **Cambiá los valores** de edad, precio, activo
3. **Sacale una prop** a `<Producto>` — ¿qué pasa si no le pasás `precio`?
4. **Agregale más props** a un componente... pero cuidado, si el componente no las usa, no pasa nada
5. **Probá pasarle un objeto** como prop: `datos={{nombre: 'Ana', edad: 28}}` y recibilo como `{datos}` después accediendo a `datos.nombre`

### 8. (Opcional) Build para producción

```bash
npm run build
npm run preview
```

---

## 📄 Código Completo

### `package.json`

```json
{
  "name": "04-props",
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

### `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

### `index.html`

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>04 — Props</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `src/main.jsx`

El código completo está en la sección anterior (Paso 6). No lo repito acá para no alargar, pero está en el archivo `src/main.jsx` del proyecto.

---

## 🎯 Proyecto para hacer solo

> **IMPORTANTE**: esto NO es opcional. Hacelo. Es la única forma de que el concepto te quede grabado.

Creá un proyecto NUEVO (no modifiques `04-props`). Llamalo `04-props-practica`.

### Consigna

Vas a crear una **galería de perfiles de personas**. Cada perfil muestra:
- Foto (usá un emoji como placeholder)
- Nombre completo
- Edad
- Profesión
- Si está disponible para trabajar o no

**Requisitos técnicos:**

1. Usá `npm create vite@latest` para crear el proyecto (como aprendiste acá)
2. Creá un componente `Perfil` que reciba **como props** todos los datos de una persona
3. Usá **destructuring** en los parámetros del componente
4. La prop "disponible" debe tener un **valor por defecto** de `true`
5. Creá un componente `ListaPerfiles` que use `Perfil` varias veces con datos distintos
6. Usá `children` en al menos un componente (ej: una `Tarjeta` que envuelva a `Perfil`)

**Ejemplo de uso:**

```jsx
function Perfil({ nombre, edad, profesion, disponible = true }) {
  // Tu código acá
}

function ListaPerfiles() {
  return (
    <div>
      <h1>Galería de Perfiles</h1>
      <Perfil nombre="Martina García" edad={28} profesion="Ingeniera" />
      <Perfil nombre="Carlos López" edad={35} profesion="Diseñador" disponible={false} />
      <Perfil nombre="Ana Martínez" edad={24} profesion="Programadora" />
      {/* Agregá al menos 3 perfiles más */}
    </div>
  );
}
```

**Extras (si querés ir más allá):**
- Hacé que la tarjeta tenga un borde de color distinto según esté disponible o no
- Agregá un componente `Etiqueta` que reciba el texto y el color como props
- Pasá un objeto completo como una sola prop (ej: `datos={{nombre, edad, profesion}}`) en lugar de props separadas

**Pista:** fijate cómo usamos `<Caja>` en el proyecto principal para entender `children`. El `children` puede ser cualquier JSX: texto, elementos, incluso otros componentes.

---

## 🧠 Resumen

| Concepto | Explicación breve |
|----------|-------------------|
| **Props** | Argumentos de una función componente. Se pasan como atributos JSX. |
| **Flujo unidireccional** | Las props van de padre a hijo, nunca al revés. |
| **Solo lectura** | Un componente nunca modifica sus props. |
| **Destructuring** | `function Comp({ prop1, prop2 })` — evita escribir `props.` todo el tiempo. |
| **Valores por defecto** | `function Comp({ prop = 'default' })` — se usa si no se pasa la prop. |
| **`children`** | Prop especial que contiene el JSX entre apertura y cierre del componente. |
| **String vs otros** | Strings van con `""`, otros valores (números, booleanos, variables) van con `{}`. |

**En el próximo proyecto** vas a aprender sobre **estado** (`useState`). Acá las props eran datos que vienen de afuera y no cambian. El estado es lo que hace que un componente tenga vida propia, datos que cambian con el tiempo. Ahí es donde React empieza a brillar de verdad.
