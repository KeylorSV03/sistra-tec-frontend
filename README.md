# SISTRA-TEC — Frontend

Aplicación web construida con React, Vite y Tailwind CSS.

## Requisitos previos

- Node.js 18+

## Instalación

```bash
npm install
```

## Variables de entorno

Copia el archivo de ejemplo y completa los valores:

```bash
cp .env.example .env
```

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del backend (default: http://localhost:3000) |

## Correr el proyecto

**Desarrollo:**
```bash
npm run dev
```

**Compilar para producción:**
```bash
npm run build
```

**Vista previa del build:**
```bash
npm run preview
```

## Estructura

```
src/
├── main.jsx           # Punto de entrada
├── App.jsx            # Providers y rutas raíz
├── assets/            # Imágenes y recursos estáticos
├── components/
│   ├── ui/            # Componentes genéricos (Button, Modal, Input...)
│   └── modules/       # Componentes específicos de cada módulo
├── context/           # Estado global (AuthContext)
├── hooks/             # Hooks personalizados (useAuth...)
├── pages/
│   ├── public/        # Páginas sin autenticación
│   └── admin/         # Páginas protegidas por rol
├── routes/            # Definición de rutas y ProtectedRoute
├── services/          # Llamadas a la API (axios)
├── schemas/           # Esquemas de validación Zod
├── utils/             # Funciones reutilizables
└── styles/            # CSS global con Tailwind
```
