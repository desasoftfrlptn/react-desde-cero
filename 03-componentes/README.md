# Proyecto 03: Componentes

> **Concepto**: funciones que devuelven JSX, composición

---

## 📖 Nota Académica

### ¿Qué es un componente?

Un componente React es **una función que devuelve JSX**. Eso es todo.

```js
function Titulo() {
  return <h1>¡Hola!</h1>;
}
```

No hay herencia, no hay clases, no hay decoradores, no hay magia.
Es JavaScript puro: una función que recibe datos (lo veremos en el proyecto 04)
y devuelve qué renderizar.

### ¿Por qué componentes?

Las aplicaciones modernas tienen UI complejas. Sin componentes, terminás con
un archivo gigante de HTML/JS imposible de mantener.

Los componentes te permiten:

| Problema | Solución con componentes |
|----------|--------------------------|
| Código duplicado | Creás un componente y lo reutilizás |
| Archivos enormes | Dividís la UI en piezas chicas |
| Equipo trabajando en paralelo | Cada uno trabaja en su componente |
| Dificultad para testear | Testeás cada componente por separado |

### PascalCase: no es opcional

```jsx
function titulo() {     // ❌ React piensa que es una etiqueta HTML <titulo>
function Titulo() {     // ✅ React sabe que es un componente
```

React distingue componentes de etiquetas HTML por la **primera letra**:
- Minúscula → `<div>`, `<span>`, `<h1>` → etiquetas HTML
- Mayúscula → `<Titulo>`, `<Pagina>`, `<Lista>` → componentes

Si ponés minúscula, React busca una etiqueta HTML con ese nombre (que no
existe) y no renderiza nada.

### Composición

La composición es la idea de que **componentes chicos forman componentes
grandes**:

```
Pagina
├── Titulo
├── Descripcion
└── ListaDeTemas
    ├── <li>
    ├── <li>
    └── <li>
```

Cada componente se enfoca en UNA cosa. Pagina solo se preocupa de la
estructura general. Titulo solo del título. Así, si mañana cambiás el
título, tocás solo Titulo, no toda la página.

### El JSX de varias líneas va entre paréntesis

Cuando un componente devuelve JSX de múltiples líneas, se envuelve en `()`:

```jsx
function Lista() {
  return (
    <ul>
      <li>Uno</li>
      <li>Dos</li>
    </ul>
  );
}
```

Sin los paréntesis, JavaScript interpreta el `return` y después encuentra
`<ul>` en la siguiente línea, lo que causa error (por el "automatic
semicolon insertion" de JS).

---

## 🛠️ Paso a Paso — Creá tu propio proyecto

### 1. Creá la carpeta

```bash
mkdir 03-componentes
cd 03-componentes
```

### 2. Creá `package.json`

```json
{
  "name": "03-componentes",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.4.0",
    "vite": "^6.3.0"
  }
}
```

### 3. Instalá

```bash
npm install
```

### 4. Creá `vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### 5. Creá `index.html`

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>03 — Componentes</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 6. Creá `src/main.jsx`

```bash
mkdir src
```

Creá `src/main.jsx`:

```jsx
import { createRoot } from 'react-dom/client';

function Titulo() {
  return <h1>¡Bienvenido a React!</h1>;
}

function Descripcion() {
  return (
    <p>
      React está hecho de componentes. Cada componente es una
      función que devuelve JSX.
    </p>
  );
}

function ListaDeTemas() {
  return (
    <ul>
      <li>Componente = función que devuelve JSX</li>
      <li>El nombre va con mayúscula (PascalCase)</li>
      <li>Se usa como etiqueta: &lt;Titulo /&gt;</li>
      <li>Los componentes se componen entre sí</li>
    </ul>
  );
}

function Pagina() {
  return (
    <div>
      <Titulo />
      <Descripcion />
      <h2>Temas de hoy:</h2>
      <ListaDeTemas />
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Pagina />);
```

**Notá**: no hay variables, no hay datos, no hay `useState`, no hay nada
raro. Son solo **funciones que devuelven JSX**, organizadas jerárquicamente.
`Pagina` llama a `Titulo`, `Descripcion` y `ListaDeTemas` — y React se
encarga de ejecutar cada función y reemplazar la etiqueta por su resultado.

### 7. Iniciá el servidor

```bash
npm run dev
```

Abrí `http://localhost:5173` y vas a ver una página armada a partir de
4 componentes. Abrí las DevTools del navegador (F12) y fijate en el HTML
generado — no ves `<Titulo>` ni `<Pagina>`, solo `<h1>`, `<p>`, `<ul>`,
etc. React reemplaza tus componentes por el JSX que devuelven.

### 8. Experimentá

- Cambiá el texto de `Titulo` — solo cambiás esa función, el resto no se toca
- Agregá un nuevo componente `Footer` y ponelo dentro de `Pagina`
- Sacále la mayúscula a `Titulo` → poné `function titulo()` y fijate qué pasa
- Creá un componente que use a otro componente 2 veces: `<Saludo /><Saludo />`

---

## 📄 Código Completo

### `src/main.jsx`

```jsx
import { createRoot } from 'react-dom/client';

function Titulo() {
  return <h1>¡Bienvenido a React!</h1>;
}

function Descripcion() {
  return (
    <p>
      React está hecho de componentes. Cada componente es una
      función que devuelve JSX. Los componentes se anidan unos
      adentro de otros como si fueran bloques de Lego.
    </p>
  );
}

function ListaDeTemas() {
  return (
    <ul>
      <li>Componente = función que devuelve JSX</li>
      <li>El nombre va con mayúscula (PascalCase)</li>
      <li>Se usa como etiqueta: &lt;Titulo /&gt;</li>
      <li>Los componentes se componen entre sí</li>
    </ul>
  );
}

function Pagina() {
  return (
    <div>
      <Titulo />
      <Descripcion />
      <h2>Temas de hoy:</h2>
      <ListaDeTemas />
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<Pagina />);
```

---

## 🧠 Resumen

| Concepto | Explicación breve |
|----------|-------------------|
| **Componente** | Función que devuelve JSX |
| **PascalCase** | El nombre del componente arranca con mayúscula |
| **Uso** | Se usa como etiqueta: `<Componente />` |
| **Composición** | Componentes adentro de componentes — así se arma la UI |
| **Responsabilidad única** | Cada componente hace una sola cosa |
| **`()` en return** | Para JSX multilínea, el return va entre paréntesis |

**En el próximo proyecto** vas a aprender **props**: cómo pasar datos a los
componentes para que no sean estáticos, sino que se adapten según la
información que reciben.
