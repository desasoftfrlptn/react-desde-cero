/* ============================================================
   React desde 0 — Proyecto 01: Hola, Mundo
   Concepto: JSX, createRoot, render
   ============================================================
   Este archivo es el PUNTO DE ENTRADA de la aplicación.
   Vite lo carga desde <script src="/src/main.jsx"> en index.html
   y ejecuta todo lo que está acá.
   ============================================================ */

// -------------------------------------------------------------
// Paso 1: Importar createRoot
// -------------------------------------------------------------
// createRoot es una función que viene del paquete 'react-dom'.
// Su trabajo: tomar control de un elemento del HTML para que
// React pueda manejar todo lo que hay adentro.
//
// Usamos { } porque importamos SOLO esa función, no todo el
// paquete. Esto se llama "importación nombrada" (named import).
import { createRoot } from 'react-dom/client';

// -------------------------------------------------------------
// Paso 2: Crear la raíz de React
// -------------------------------------------------------------
// document.getElementById('root') busca en el HTML un elemento
// con id="root" — el <div id="root"> de index.html.
//
// createRoot(...) envuelve ese <div> y le dice a React:
// "a partir de ahora, vos manejás todo lo que hay acá adentro".
const root = createRoot(document.getElementById('root'));

// -------------------------------------------------------------
// Paso 3: Renderizar (pintar) contenido en la raíz
// -------------------------------------------------------------
// root.render() toma el JSX que le pasamos y lo convierte en
// elementos HTML reales que aparecen en el navegador.
//
// <h1>¡Hola, Mundo!</h1> es JSX. Se ve como HTML, pero NO es
// HTML — es JavaScript que React transforma a HTML por nosotros.
root.render(<h1>¡Hola, Mundo!</h1>);
