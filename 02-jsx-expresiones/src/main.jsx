/* ============================================================
   React desde 0 — Proyecto 02: Expresiones en JSX
   Concepto: { }, fragments, JS-in-JSX
   ============================================================ */

import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'));

// -------------------------------------------------------------
// DATOS: variables normales de JavaScript
// -------------------------------------------------------------
// Estas son variables JS comunes. No tienen nada de React
// todavía. Las vamos a usar DENTRO del JSX.
const nombre = 'Desarrollo de Software - UTN FrLP - Turno Noche';
const edad = 22;
const hobbies = ['programar', 'mate', 'guitarra'];

// -------------------------------------------------------------
// RENDER: JSX con expresiones adentro
// -------------------------------------------------------------
// Acá está lo NUEVO: las llaves { } nos permiten meter
// expresiones de JavaScript dentro del JSX.
//
// IMPORTANTE: solo EXPRESIONES, no sentencias (statements).
// Una expresión produce un valor (número, string, etc).
// Una sentencia ejecuta una acción (if, for, while).
//
// ✅ {nombre}          → expresión (variable)
// ✅ {edad + 5}        → expresión (operación matemática)
// ✅ {nombre.toUpperCase()} → expresión (llamada a método)
// ✅ {edad >= 18 ? 'Sí' : 'No'} → expresión (ternario)
// ❌ {if (edad > 18) { ... }}  → sentencia, NO funciona
//
// También usamos <></> (FRAGMENT) para agrupar varios
// elementos sin agregar un <div> al HTML final.
root.render(
  <>
    {/* ------------------------------------------------- */}
    {/* 1. Variables sueltas                             */}
    {/* ------------------------------------------------- */}
    <h1>Hola, {nombre}!</h1>
    <p>Tenés {edad} años.</p>

    {/* ------------------------------------------------- */}
    {/* 2. Expresiones matemáticas                       */}
    {/* ------------------------------------------------- */}
    <p>En 5 años vas a tener {edad + 5}.</p>
    <p>2 + 2 = {2 + 2}</p>

    {/* ------------------------------------------------- */}
    {/* 3. Llamadas a métodos de JavaScript              */}
    {/* ------------------------------------------------- */}
    <p>Tu nombre en mayúsculas: {nombre.toUpperCase()}</p>
    <p>Tu nombre tiene {nombre.length} letras.</p>

    {/* ------------------------------------------------- */}
    {/* 4. Ternario (if en línea)                        */}
    {/* ------------------------------------------------- */}
    <p>¿Sos mayor de edad? {edad >= 18 ? 'Sí' : 'No'}</p>

    {/* ------------------------------------------------- */}
    {/* 5. Arrays (los convierte a texto con coma)       */}
    {/* ------------------------------------------------- */}
    <p>Tus hobbies: {hobbies}</p>

    {/* ------------------------------------------------- */}
    {/* 6. Fragment <></> — agrupa sin agregar divs      */}
    {/* ------------------------------------------------- */}
    {/* Sin <></>, esto daría error porque React necesita
         un SOLO elemento raíz. El Fragment agrupa sin
         ensuciar el HTML con divs innecesarios.        */}
  </>
);
