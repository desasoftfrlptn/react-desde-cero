# Proyecto 01: Hola, Mundo

> **Concepto**: JSX, `createRoot`, `render`

---

## 📖 Nota Académica

### ¿Qué es React?

React es una **biblioteca** (no un framework) para construir interfaces de usuario.
Su idea fundamental es **declarativa**: vos decís *qué* querés ver en pantalla,
React se encarga de *cómo* y *cuándo* actualizar el DOM.

### ¿Qué es JSX?

JSX es una **extensión de sintaxis** para JavaScript. Se ve como HTML, pero no lo es.

```jsx
<h1>¡Hola, Mundo!</h1>
```

Cuando Vite compila el proyecto, este JSX se transforma en JavaScript real:

```js
React.createElement('h1', null, '¡Hola, Mundo!');
```

Eso significa que **JSX no es HTML** — es azúcar sintáctica para llamar a funciones de React.
Pero se ve igual, lo que lo hace intuitivo.

### createRoot y render

Antes de React 18, se usaba `ReactDOM.render()`. Desde React 18 en adelante,
se usa `createRoot`, que crea un "root" concurrente y después llamás a `render()`.

```js
const root = createRoot(contenedorDOM);
root.render(loQueQuerésPintar);
```

El `contenedorDOM` es un elemento HTML (como `<div id="root">`) que React toma
control para gestionar su contenido. Una vez que React toma control de ese nodo,
**todo lo que estaba adentro se reemplaza** por lo que vos renderices.

### El archivo index.html

Todo proyecto React necesita un HTML de entrada. Ahí va un `<div>` con un `id`
(típicamente `id="root"`) y un `<script>` que apunta a `src/main.jsx`.

React no toca nada fuera de su contenedor. Puede convivir con HTML estático
sin problemas en la misma página.

### ¿Por qué no importamos 'react'?

En versiones viejas de React (antes de la 17), cada archivo JSX necesitaba
`import React from 'react'`. Desde React 17+, el nuevo JSX transform
lo hace automáticamente. Vite con `@vitejs/plugin-react` usa este nuevo
transform por defecto.

---

## 🛠️ Paso a Paso — Creá tu propio proyecto

Seguí estos pasos para crear el proyecto desde cero. **No copies el proyecto
final** — crealo vos mismo para entender cada parte.

### 1. Creá la carpeta del proyecto

```bash
mkdir 01-hola-mundo
cd 01-hola-mundo
```

### 2. Creá el `package.json`

Este archivo le dice a Node.js cuáles son las dependencias del proyecto.

```json
{
  "name": "01-hola-mundo",
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

**Explicación**:
- `"private": true` — evita publicar por error este proyecto en npm
- `"type": "module"` — habilita los `import`/`export` de ES Modules
- `"dependencies"` — lo que necesita el proyecto para funcionar (React)
- `"devDependencies"` — lo que necesita solo en desarrollo (Vite, plugin)

### 3. Instalá las dependencias

```bash
npm install
```

Esto descarga React, ReactDOM, Vite y el plugin de React dentro de una carpeta
`node_modules/`. También genera `package-lock.json` para mantener versiones
consistentes.

### 4. Creá `vite.config.js`

Vite necesita un archivo de configuración mínimo para saber que usamos React:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

**Explicación**: `defineConfig` es una función helper de Vite para tener
autocompletado. El array `plugins` le dice a Vite qué transformaciones aplicar
al código. `@vitejs/plugin-react` agrega soporte para JSX.

### 5. Creá `index.html`

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>01 — Hola, Mundo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

**Explicación**:
- `<div id="root"></div>` — el contenedor que React va a controlar
- `<script type="module" src="/src/main.jsx">` — carga nuestro código React.
  Notá que `type="module"` es necesario para usar `import`/`export` en el navegador.
  La ruta `/src/main.jsx` es relativa a la raíz del proyecto.

### 6. Creá `src/main.jsx`

Primero creá la carpeta `src/`:

```bash
mkdir src
```

Después creá `src/main.jsx`:

```jsx
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<h1>¡Hola, Mundo!</h1>);
```

**Explicación línea por línea**:
1. `import { createRoot } from 'react-dom/client'` — importa la función
   `createRoot` desde el paquete `react-dom`. Solo importamos lo que
   necesitamos, no toda la biblioteca.
2. `document.getElementById('root')` — busca en el HTML el elemento con
   `id="root"` (el `<div>` que creamos en el paso 5).
3. `createRoot(...)` — crea una raíz de React en ese elemento.
4. `root.render(...)` — pinta contenido JSX adentro de esa raíz.
5. `<h1>¡Hola, Mundo!</h1>` — JSX que React transforma a HTML real.

### 7. Iniciá el servidor de desarrollo

```bash
npm run dev
```

Vite inicia un servidor local y te muestra una URL (generalmente
`http://localhost:5173`). Abrí esa URL en tu navegador.

**Si todo funciona**, deberías ver el texto **"¡Hola, Mundo!"** como un
título grande en la pantalla. Felicitaciones, ¡acabás de crear tu primera
app con React!

### 8. (Opcional) Build para producción

```bash
npm run build
```

Esto genera una carpeta `dist/` con archivos optimizados para subir a un
servidor. Podés previsualizarlos con:

```bash
npm run preview
```

---

## 📄 Código Completo

### `src/main.jsx`

```jsx
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));
root.render(<h1>¡Hola, Mundo!</h1>);
```

### `index.html`

```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <title>01 — Hola, Mundo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `vite.config.js`

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

### `package.json`

```json
{
  "name": "01-hola-mundo",
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

---

## 🧠 Resumen

| Concepto | Explicación breve |
|----------|-------------------|
| **JSX** | Sintaxis que parece HTML pero es JavaScript |
| **createRoot** | Toma control de un elemento del DOM para React |
| **render** | Pinta contenido JSX dentro de la raíz |
| **Vite** | Bundler que compila y sirve el proyecto en desarrollo |
| **package.json** | Archivo de configuración del proyecto Node.js |

**En el próximo proyecto** vas a aprender a usar expresiones JavaScript dentro
de JSX usando llaves `{}`. Vas a ver cómo JSX no es solo HTML estático, sino
que puede mostrar datos dinámicos.
