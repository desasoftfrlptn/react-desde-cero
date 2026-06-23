/* ============================================================
   React desde 0 — Proyecto 04: Props
   Concepto: props, children, valores por defecto
   ============================================================
   Llegó el momento de que los componentes dejen de ser
   estáticos. Con PROPS, un mismo componente puede mostrar
   datos DIFERENTES según lo que le pasemos.
   ============================================================ */

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
// Este componente recibe `props`, que es un objeto con TODO
// lo que le pasemos como atributos.
//
// Si usamos <Saludo nombre="Martina" />, entonces:
//   props = { nombre: "Martina" }
//
// Después accedemos a props.nombre adentro del JSX.
function Saludo(props) {
  // props es un objeto JS común y silvestre.
  // Podríamos hacer console.log(props) y veríamos { nombre: "..." }.
  return <h1>¡Hola, {props.nombre}!</h1>;
}

// -------------------------------------------------------------
// Componente 2: Usuario — múltiples props
// -------------------------------------------------------------
// Podemos pasar VARIAS props. Cada atributo se convierte en
// una propiedad del objeto props.
//
// <Usuario nombre="Martina" edad={25} activo={true} />
//   → props = { nombre: "Martina", edad: 25, activo: true }
//
// NOTA: los strings van con comillas "", los números y
// booleanos van con llaves {}.
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
// En lugar de escribir `props.nombre`, `props.precio` una y
// otra vez, podemos DESTRUCTURAR el objeto props directamente
// en los parámetros.
//
// Destructuring: sacar propiedades del objeto y asignarlas a
// variables con el mismo nombre.
//
// function Producto({ nombre, precio })  ← equivalente a:
// function Producto(props) {
//   const nombre = props.nombre;
//   const precio = props.precio;
// }
function Producto({ nombre, precio, disponible }) {
  // Acá podemos usar nombre, precio y disponible directamente,
  // sin escribir `props.` cada vez.
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
// ¿Qué pasa si una prop NO se pasa? No queremos que aparezca
// "undefined" en la pantalla.
//
// Solución: valores por defecto en la destructuración.
// Es JavaScript puro, nada de React:
//
//   function Tarjeta({ titulo = 'Sin título' })
//
// Si NO pasan `titulo`, se usa 'Sin título'.
// Si SÍ pasan `titulo`, se usa el valor que pasaron.
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
// `children` es un prop ESPECIAL. No se pasa como atributo.
// Contiene todo lo que pongas ENTRE la apertura y cierre
// del componente.
//
// <Caja>Este texto es children</Caja>
//   → props.children = "Este texto es children"
//
// <Caja><span>Hola</span></Caja>
//   → props.children = <span>Hola</span>
//
// Es la forma de hacer COMPOSICIÓN: un componente que
// envuelve a otros.
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
// Acá armamos la página completa. Cada componente recibe
// sus props y se renderiza con datos diferentes.
//
// Prestá atención a:
//   - <Saludo> recibe nombre como string ("")
//   - <Usuario> recibe nombre (string), edad (number),
//     activo (boolean) — notá los {} para números y booleanos
//   - <Producto> con destructuring, 3 props distintas
//   - <Tarjeta> con y sin props (para ver los valores default)
//   - <Caja> con children — adentro va JSX
function Pagina() {
  return (
    <>
      <h1>🎓 Props en React</h1>

      {/* ---- 1. Props básicas ---- */}
      <Saludo nombre="Martina" />
      <Saludo nombre="Carlos" />
      {/* Mismo componente, MISMO código, pero muestra distinto
           porque recibe distintas props. Esa es la magia. */}

      <hr />

      {/* ---- 2. Múltiples props ---- */}
      <Usuario nombre="Martina" edad={25} activo={true} />
      <Usuario nombre="Carlos" edad={30} activo={false} />

      <hr />

      {/* ---- 3. Destructuring ---- */}
      <Producto nombre="Mate" precio={2500} disponible={true} />
      <Producto nombre="Termo" precio={8500} disponible={false} />

      <hr />

      {/* ---- 4. Valores por defecto ---- */}
      <Tarjeta titulo="Nota importante" contenido="Esto es importante" />
      <Tarjeta />
      {/* La segunda Tarjeta no recibe props → usa valores default */}

      <hr />

      {/* ---- 5. children ---- */}
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
      {/* La primera Caja tiene etiqueta="Consejo", la segunda
           usa el valor por defecto "Info" */}
    </>
  );
}

// =============================================================
// Renderizado
// =============================================================
// Un solo <Pagina /> que renderiza todo. React se encarga de
// pasar las props a cada componente.
// =============================================================

const root = createRoot(document.getElementById('root'));
root.render(<Pagina />);
