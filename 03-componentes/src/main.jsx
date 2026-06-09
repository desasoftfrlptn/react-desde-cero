/* ============================================================
   React desde 0 — Proyecto 03: Componentes
   Concepto: funciones que devuelven JSX
   ============================================================
   Este es EL proyecto que cambia todo. Acá vas a entender
   de qué se trata React realmente: COMPONENTES.
   ============================================================ */

import { createRoot } from 'react-dom/client';

// =============================================================
// ¿Qué es un componente?
// =============================================================
// Un componente React es UNA FUNCIÓN que devuelve JSX.
// Nada más. No hay magia, no hay herencia, no hay clases.
// Es una función JS común y corriente.
//
// REGLA DE ORO: el nombre va en PascalCase (con mayúscula).
// Si el nombre empieza con minúscula, React lo trata como
// una etiqueta HTML normal, no como un componente.
// =============================================================

// -------------------------------------------------------------
// Componente 1: Título
// -------------------------------------------------------------
// La función más simple posible: no recibe nada, devuelve JSX.
function Titulo() {
  return <h1>¡Bienvenido a React!</h1>;
}

// -------------------------------------------------------------
// Componente 2: Descripción
// -------------------------------------------------------------
// Otro componente. Cada uno es independiente y hace una sola
// cosa. Esto se llama "responsabilidad única" — un componente,
// un propósito.
function Descripcion() {
  return (
    <p>
      React está hecho de componentes. Cada componente es una
      función que devuelve JSX. Los componentes se anidan unos
      adentro de otros como si fueran bloques de Lego.
    </p>
  );
}

// -------------------------------------------------------------
// Componente 3: ListaDeTemas
// -------------------------------------------------------------
function ListaDeTemas() {
  // Acá el JSX tiene varias líneas, así que va entre ( ).
  return (
    <ul>
      <li>Componente = función que devuelve JSX</li>
      <li>El nombre va con mayúscula (PascalCase)</li>
      <li>Se usa como etiqueta: &lt;Titulo /&gt;</li>
      <li>Los componentes se componen entre sí</li>
    </ul>
  );
}

// -------------------------------------------------------------
// Componente 4: Pagina (COMPOSICIÓN)
// -------------------------------------------------------------
// Este componente USA los otros componentes adentro.
// Titulo, Descripcion y ListaDeTemas están siendo
// "compuestos" dentro de Pagina.
//
// COMPOSICIÓN: armar componentes más grandes a partir de
// componentes más chicos. Así funciona React en su totalidad.
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

// =============================================================
// Renderizado
// =============================================================
// Solo renderizamos UN componente: Pagina. React se encarga
// de llamar a Titulo, Descripcion y ListaDeTemas por nosotros.
// =============================================================

const root = createRoot(document.getElementById('root'));
root.render(<Pagina />);
