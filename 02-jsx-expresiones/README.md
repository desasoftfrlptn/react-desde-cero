# Proyecto 02: Expresiones en JSX

> **Concepto**: `{}`, fragments, JavaScript dentro de JSX

---

## 📖 Nota Académica

### JSX no es HTML — es JavaScript

En el proyecto anterior vimos que JSX se ve como HTML. Pero JSX es **JavaScript**
con una sintaxis especial. Y si JSX es JavaScript, entonces podemos meter
**código JS adentro**. ¿Cómo? Con las llaves `{}`.

```jsx
<h1>Hola, {nombre}!</h1>
```

Cualquier cosa que pongas entre `{` y `}` se evalúa como JavaScript, y el
**resultado** se inserta en ese lugar del JSX. El resultado siempre se
convierte a texto (salvo algunas excepciones como React elements).

### Expresiones vs Sentencias

Esta es LA regla más importante de JSX y la que más confunde al principio:

| | Expresa un valor | Ejecuta una acción |
|---|---|---|
| **Expresión** | ✅ `{nombre}`, `{2 + 2}`, `{fn()}` | ❌ |
| **Sentencia** | ❌ | ✅ `if`, `for`, `while`, `switch` |

**En JSX solo entran expresiones.**

```jsx
✅ {nombre}                    // variable → valor
✅ {2 + 2}                     // operación → valor
✅ {nombre.toUpperCase()}      // llamado a función → valor
✅ {edad >= 18 ? 'Sí' : 'No'}  // ternario → valor
✅ {[1, 2, 3].map(n => n * 2)} // .map() → nuevo array → valor

❌ {if (edad > 18) { ... }}    // if es sentencia
❌ {for (let i = 0; ...)}      // for es sentencia
```

**Pista**: si podés ponerlo a la derecha de un `=` (asignación), es una
expresión. Si no, no.

```js
const x = nombre;           // ✅ expresión
const x = if (edad) { };    // ❌ sentencia
```

### ¿Qué tipos de datos puedo meter?

| Tipo | Cómo se renderiza | Ejemplo |
|------|-------------------|---------|
| `string` | Como texto | `{'Hola'}` → Hola |
| `number` | Como texto | `{42}` → 42 |
| `boolean` | **No se ve** | `{true}` → (vacío) |
| `null` / `undefined` | **No se ve** | `{null}` → (vacío) |
| `array` | Unido con comas | `{['a','b']}` → a,b |
| `object` | ❌ Error | `{{a:1}}` → Error |

### Fragments: `<></>`

En el proyecto 01 renderizábamos un solo `<h1>`. Pero si querés devolver
**varios elementos** hermanos (sin un padre común), JSX no te deja:

```jsx
// ❌ Error: JSX debe tener un solo elemento raíz
root.render(
  <h1>Título</h1>
  <p>Párrafo</p>
);
```

La solución es el **Fragment**: `<></>` (o `<React.Fragment>`), que agrupa
elementos sin agregar un nodo extra al DOM.

```jsx
// ✅ Correcto: Fragment agrupa sin ensuciar el HTML
root.render(
  <>
    <h1>Título</h1>
    <p>Párrafo</p>
  </>
);
```

En el navegador vas a ver solo `<h1>` y `<p>` — no hay un `<div>` ni un wrapper
alrededor. Esto mantiene el HTML limpio y semántico.

---

## 🛠️ Paso a Paso — Creá tu propio proyecto

### 1. Creá la carpeta

```bash
mkdir 02-jsx-expresiones
cd 02-jsx-expresiones
```

### 2. Creá `package.json`

```json
{
  "name": "02-jsx-expresiones",
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
    <title>02 — Expresiones en JSX</title>
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

Creá `src/main.jsx` con el siguiente contenido. **Leé los comentarios**,
no los borres — explican cada línea:

```jsx
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

const nombre = 'Martina';
const edad = 22;
const hobbies = ['programar', 'mate', 'guitarra'];

root.render(
  <>
    <h1>Hola, {nombre}!</h1>
    <p>Tenés {edad} años.</p>
    <p>En 5 años vas a tener {edad + 5}.</p>
    <p>2 + 2 = {2 + 2}</p>
    <p>Tu nombre en mayúsculas: {nombre.toUpperCase()}</p>
    <p>Tu nombre tiene {nombre.length} letras.</p>
    <p>¿Sos mayor de edad? {edad >= 18 ? 'Sí' : 'No'}</p>
    <p>Tus hobbies: {hobbies}</p>
  </>
);
```

Acá está pasando algo nuevo: JSX ya no es solo HTML estático. Estamos
**inyectando datos** de JavaScript adentro del HTML. `{nombre}` se reemplaza
por "Martina", `{edad + 5}` se calcula como `27`, `{nombre.toUpperCase()}`
llama al método de JavaScript y muestra "MARTINA".

### 7. Iniciá el servidor

```bash
npm run dev
```

Abrí `http://localhost:5173` en tu navegador. Vas a ver:

- "Hola, Martina!"
- "Tenés 22 años."
- "En 5 años vas a tener 27."
- "2 + 2 = 4"
- "Tu nombre en mayúsculas: MARTINA"
- "Tu nombre tiene 7 letras."
- "¿Sos mayor de edad? Sí"
- "Tus hobbies: programar, mate, guitarra"

### 8. Experimentá

Cambiá el valor de `nombre`, sumale más años, agregá más hobbies.
Cada vez que guardes, el navegador se actualiza solo (HOT RELOAD).
Probá qué pasa si ponés:
- `{true}` — no se ve nada
- `{null}` — no se ve nada
- `{console.log('hola')}` — ¿qué esperás que pase?

---

## 📄 Código Completo

### `src/main.jsx`

```jsx
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

const nombre = 'Martina';
const edad = 22;
const hobbies = ['programar', 'mate', 'guitarra'];

root.render(
  <>
    <h1>Hola, {nombre}!</h1>
    <p>Tenés {edad} años.</p>
    <p>En 5 años vas a tener {edad + 5}.</p>
    <p>2 + 2 = {2 + 2}</p>
    <p>Tu nombre en mayúsculas: {nombre.toUpperCase()}</p>
    <p>Tu nombre tiene {nombre.length} letras.</p>
    <p>¿Sos mayor de edad? {edad >= 18 ? 'Sí' : 'No'}</p>
    <p>Tus hobbies: {hobbies}</p>
  </>
);
```

---

## 🧠 Resumen

| Concepto | Explicación breve |
|----------|-------------------|
| **`{}` en JSX** | Permite insertar expresiones de JavaScript |
| **Expresión** | Código que produce un valor (variable, operación, ternario, llamado a función) |
| **Sentencia** | Código que ejecuta una acción (if, for, while) — NO funciona en `{}` |
| **Fragment `<></>`** | Agrupa varios elementos sin agregar nodos al DOM |
| **Booleanos y null** | No se renderizan en pantalla (útiles para condicionales, lo veremos después) |

**En el próximo proyecto** vas a aprender qué son los **componentes** en React.
En lugar de tener todo en un solo `main.jsx`, vas a dividir la UI en piezas
reutilizables. Adiós al espaghetti.
