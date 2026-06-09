# React desde 0

Curso práctico de React. **Un concepto por proyecto, sin mezclar nada**.

## Filosofía

Cada proyecto explica **exactamente un concepto nuevo**. No hay atajos, no hay "mágia".
Si el proyecto 4 enseña `props`, el proyecto 3 NO las usa. Simple, progresivo, sólido.

```
Proyecto N → Enseña concepto X
Proyecto N+1 → Enseña concepto Y (y repasa X sin explicarlo)
```

Aprendés React de abajo hacia arriba. No importa si venís de HTML/CSS/JS — esto arranca
con lo mínimo que necesitás para ver algo en pantalla.

## Proyectos

| #  | Proyecto              | Concepto                                    |
|----|-----------------------|---------------------------------------------|
| 01 | hola-mundo            | JSX, createRoot, render — el mínimo viable  |
| 02 | jsx-expresiones       | Llaves `{}`, expresiones, fragments         |
| 03 | componentes           | Funciones que devuelven JSX                 |
| 04 | props                 | Props, children, valores por defecto        |
| 05 | estado                | useState — la gran diferencia con HTML      |
| 06 | eventos               | onClick, onChange, onSubmit                 |
| 07 | renderizado-listas    | .map(), keys                                |
| 08 | renderizado-condicional | &&, ternario, condicional                 |
| 09 | formularios           | Controlled components                       |
| 10 | useEffect             | Side effects, fetch, ciclo de vida          |
| 11 | useRef                | Referencias al DOM                          |
| 12 | context               | Context API, Provider, useContext           |
| 13 | custom-hooks          | Tu primer hook propio                       |
| 14 | react-router          | Navegación SPA                              |

## Cómo usar este curso

Cada proyecto es **independiente** con su propio `package.json`:

```bash
cd 01-hola-mundo
npm install
npm run dev
```

Eso es todo. No necesitás nada más que un navegador y un editor de código.

### Estructura de cada proyecto

```
N-concepto/
├── README.md          ← LEÉ ESTO PRIMERO
│                       - 📖 Nota Académica: explicación del concepto
│                       - 🛠️ Paso a Paso: crealo desde 0 por tu cuenta
│                       - 📄 Código completo del proyecto
├── src/main.jsx       ← Código funcionando con comentarios didácticos
├── index.html         ← HTML de entrada
├── package.json       ← Dependencias
└── vite.config.js     ← Configuración de Vite
```

### Cómo estudiar cada proyecto

1. **Leé el README.md** — entendé el concepto con la Nota Académica
2. **Seguí el Paso a Paso** — creá tu propio proyecto desde cero, sin copiar
3. **Compará con `src/main.jsx`** — si te trabás, el código comentado te guía
4. **Experimentá** — cambiá algo, rompelo, arreglalo. Eso es aprender.

**NO copies y pegues**. Escribí cada línea. Rompela, fixeala, entende qué pasa.
Esa es la única forma de aprender de verdad.

## Prerrequisitos

- Node.js 18+ (instalado)
- Navegador moderno (Chrome, Firefox, Edge)
- Editor de código (VS Code recomendado)
- Ganas de **entender**, no de copiar
